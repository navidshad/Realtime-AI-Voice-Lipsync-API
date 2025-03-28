export class CustomMediaRecorder {
  private recorder1: MediaRecorder | null = null;
  private recorder2: MediaRecorder | null = null;
  private activeRecorder: 1 | 2 = 1;
  private isRecording: boolean = false;
  private switchInterval: NodeJS.Timer | null = null;
  private switchTimeout: any | null = null;
  private currentDuration: number;
  private iterationCount: number = 0;
  private readonly MAX_ITERATIONS = 3; // Number of iterations before reaching max duration

  constructor(
    private stream: MediaStream,
    private initialDuration: number = 2000,
    private onDataAvailable: (blob: Blob) => void
  ) {
    this.currentDuration = initialDuration;
    this.initialize();
  }

  private calculateDuration(text: string): number {
    // Base duration calculation based on text length
    const wordCount = text.split(/\s+/).length;
    const charCount = text.length;

    // Determine initial duration based on text length
    let baseDuration = Math.min(
      Math.max(
        1000, // Minimum 1 second
        Math.ceil(wordCount * 100) // 100ms per word as base
      ),
      2000 // Maximum initial duration 2 seconds
    );

    // Calculate max duration based on text length
    const maxDuration = Math.min(
      Math.max(
        4000, // Minimum max duration
        Math.ceil(charCount * 50) // 50ms per character
      ),
      8000 // Hard maximum of 8 seconds
    );

    // Progressive increase based on iteration count
    if (this.iterationCount < this.MAX_ITERATIONS) {
      const progressFactor = this.iterationCount / this.MAX_ITERATIONS;
      this.currentDuration = Math.ceil(
        baseDuration + (maxDuration - baseDuration) * progressFactor
      );
      this.iterationCount++;
    } else {
      this.currentDuration = maxDuration;
    }

    console.log("capture duration", this.currentDuration);

    return this.currentDuration;
  }

  private initialize() {
    try {
      // Initialize both recorders with the provided stream
      this.recorder1 = new MediaRecorder(this.stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      this.recorder2 = new MediaRecorder(this.stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      // Setup event handlers - now they only handle the data
      this.recorder1.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.onDataAvailable(event.data);
        }
      };

      this.recorder2.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.onDataAvailable(event.data);
        }
      };
    } catch (error) {
      console.error("Failed to initialize recorders:", error);
      throw error;
    }
  }

  private switchToRecorder(number: 1 | 2) {
    const currentRecorder = number === 1 ? this.recorder1 : this.recorder2;
    const otherRecorder = number === 1 ? this.recorder2 : this.recorder1;

    if (!currentRecorder || !otherRecorder) return;

    try {
      // Start the new recorder with timeslice parameter
      currentRecorder.start(this.currentDuration);
      this.activeRecorder = number;

      // Stop the previous recorder with a small overlap
      // this.switchTimeout = setTimeout(() => {
      if (this.isRecording && otherRecorder.state === "recording") {
        otherRecorder.stop();
      }
      // }, 50);
    } catch (error) {
      console.error("Error switching recorders:", error);
    }
  }

  start(caption?: string) {
    this.isRecording = true;

    // Reset iteration count when starting new recording
    this.iterationCount = 0;

    // Calculate initial duration if caption is provided
    if (caption) {
      this.currentDuration = this.calculateDuration(caption);
    } else {
      this.currentDuration = this.initialDuration;
    }

    this.switchToRecorder(1);

    // Set up the interval for switching recorders
    this.switchInterval = setInterval(() => {
      if (this.isRecording) {
        // Recalculate duration for next iteration if caption exists
        if (caption) {
          this.currentDuration = this.calculateDuration(caption);
        }
        this.switchToRecorder(this.activeRecorder === 1 ? 2 : 1);
      }
    }, this.currentDuration - 100);
  }

  stop() {
    this.isRecording = false;

    // Clear the switch interval
    if (this.switchInterval) {
      clearInterval(this.switchInterval as NodeJS.Timeout);
      this.switchInterval = null;
    }

    // Clear any pending switch timeout
    if (this.switchTimeout) {
      clearTimeout(this.switchTimeout);
      this.switchTimeout = null;
    }

    // Stop both recorders
    if (this.recorder1?.state === "recording") {
      this.recorder1.stop();
    }
    if (this.recorder2?.state === "recording") {
      this.recorder2.stop();
    }
  }

  dispose() {
    this.stop();
    this.recorder1 = null;
    this.recorder2 = null;
  }
}
