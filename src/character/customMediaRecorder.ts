export class CustomMediaRecorder {
  private recorder1: MediaRecorder | null = null;
  private recorder2: MediaRecorder | null = null;
  private activeRecorder: 1 | 2 = 1;
  private isRecording: boolean = false;
  private switchTimeout: NodeJS.Timeout | null = null;
  private nextSwitchTimeout: NodeJS.Timeout | null = null;

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

      // Setup event handlers
      this.recorder1.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.onDataAvailable(event.data);
          // Only switch if we're still recording
          if (this.isRecording) {
            this.switchToRecorder(2);
          }
        }
      };

      this.recorder2.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.onDataAvailable(event.data);
          // Only switch if we're still recording
          if (this.isRecording) {
            this.switchToRecorder(1);
          }
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
      // Clear any pending timeouts
      if (this.switchTimeout) {
        clearTimeout(this.switchTimeout);
      }
      if (this.nextSwitchTimeout) {
        clearTimeout(this.nextSwitchTimeout);
      }

      // Start the new recorder with timeslice parameter
      currentRecorder.start(this.duration);
      this.activeRecorder = number;

      // Stop the previous recorder with a small overlap
      this.switchTimeout = setTimeout(() => {
        if (this.isRecording && otherRecorder.state === "recording") {
          otherRecorder.stop();
        }
      }, 200); // Increased overlap period

      // Schedule the next switch
      this.nextSwitchTimeout = setTimeout(() => {
        if (this.isRecording && currentRecorder.state === "recording") {
          currentRecorder.stop();
        }
      }, Math.max(this.duration - 100, 1000)); // Ensure minimum duration of 1 second
    } catch (error) {
      console.error("Error switching recorders:", error);
    }
  }

  start() {
    this.isRecording = true;
    this.switchToRecorder(1);
  }

  stop() {
    this.isRecording = false;

    if (this.switchTimeout) {
      clearTimeout(this.switchTimeout);
      this.switchTimeout = null;
    }

    if (this.nextSwitchTimeout) {
      clearTimeout(this.nextSwitchTimeout);
      this.nextSwitchTimeout = null;
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
