export class CustomMediaRecorder {
  private recorder1: MediaRecorder | null = null;
  private recorder2: MediaRecorder | null = null;
  private activeRecorder: 1 | 2 = 1;
  private isRecording: boolean = false;
  private switchInterval: NodeJS.Timer | null = null;
  private switchTimeout: any | null = null;

  constructor(
    private stream: MediaStream,
    private duration: number = 2000,
    private onDataAvailable: (blob: Blob) => void
  ) {
    this.initialize();
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
      currentRecorder.start(this.duration);
      this.activeRecorder = number;

      // Stop the previous recorder with a small overlap

      if (this.isRecording && otherRecorder.state === "recording") {
        otherRecorder.stop();
      }
    } catch (error) {
      console.error("Error switching recorders:", error);
    }
  }

  start() {
    this.isRecording = true;
    this.switchToRecorder(1);

    // Set up the interval for switching recorders
    this.switchInterval = setInterval(() => {
      if (this.isRecording) {
        this.switchToRecorder(this.activeRecorder === 1 ? 2 : 1);
      }
    }, this.duration - 100); // Switch slightly before the duration ends
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
