import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { TalkingHead } from "talkinghead";

export interface AudioData {
  audio: any;
  visemes: string[];
  vtimes: number[];
  vdurations: number[];
  words?: string[];
  wtimes?: number[];
  wdurations?: number[];
}

// Define props interface
interface TalkingHeadProps {
  characterUrl: string;
  bodyType?: "M" | "F";
  initialView?: "full" | "upper" | "mid" | "head";
  initialMood?: string;
  height?: string | number;
  width?: string | number;
  onReady?: (head: TalkingHead) => void;
  onError?: (error: any) => void;
}

// Define ref interface
export interface TalkingHeadRef {
  speak: (duration?: number) => void;
  provideLipSyncData: (lipSyncData: AudioData) => void;
  setView: (view: "full" | "upper" | "mid" | "head") => void;
  setMood: (mood: string) => void;
  playGesture: (gesture: string, duration?: number, mirror?: boolean) => void;
  getInstance: () => TalkingHead | null;
}

// Create a React component that wraps the TalkingHead library
const TalkingHeadAvatar = forwardRef<TalkingHeadRef, TalkingHeadProps>(
  (
    {
      characterUrl,
      bodyType = "M",
      initialView = "upper",
      initialMood = "neutral",
      height = "100%",
      width = "100%",
      onReady = () => {},
      onError = () => {},
    },
    ref
  ) => {
    const avatarRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<TalkingHead | null>(null);
    const initializedRef = useRef(false);
    // Initialize TalkingHead on component mount
    useEffect(() => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      // Import TalkingHead from CDN
      import("talkinghead")
        .then(async ({ TalkingHead }) => {
          try {
            if (!avatarRef.current) return;

            // Create the TalkingHead instance
            const head = new TalkingHead(avatarRef.current, {
              // Override the TTS requirement with minimal config
              lipsyncModules: ["en"],
              ttsEndpoint: "dummy",
              avatarMute: false,

              // Visual settings
              cameraView: initialView,
              cameraDistance: 0.3,
              cameraY: 0,
              lightAmbientIntensity: 2.5,
              lightDirectIntensity: 25,
              modelPixelRatio: window.devicePixelRatio,

              // Enable user interaction
              cameraRotateEnable: true,
              cameraPanEnable: false,
              cameraZoomEnable: false,
            });

            // Store reference for later use
            headRef.current = head;

            // Load the avatar
            await head.showAvatar({
              url: characterUrl,
            });

            // Call the ready callback
            onReady(head);
          } catch (error) {
            console.error("Error initializing TalkingHead:", error);
            onError(error);
          }
        })
        .catch((error) => {
          console.error("Error importing TalkingHead:", error);
          onError(error);
        });

      // Clean up when component unmounts
      return () => {
        if (headRef.current) {
          headRef.current.stop();
          headRef.current = null;
        }
      };
    }, [characterUrl, bodyType, initialView, initialMood, onReady, onError]);

    // Create custom lip-sync data
    const createFakeLipSync = (durationMs = 3000): AudioData => {
      // Oculus viseme codes
      const visemes = [
        "sil",
        "PP",
        "FF",
        "TH",
        "DD",
        "kk",
        "CH",
        "SS",
        "nn",
        "RR",
        "aa",
        "E",
        "I",
        "O",
        "U",
      ];

      // Create arrays for our viseme data
      const fakeLipSync: {
        visemes: string[];
        vtimes: number[];
        vdurations: number[];
      } = {
        visemes: [],
        vtimes: [],
        vdurations: [],
      };

      // Create a silent PCM audio buffer (we need this for timing)
      const sampleRate = 22050;
      const numSamples = Math.ceil((sampleRate * durationMs) / 1000);
      const silentAudio = new Int16Array(numSamples);

      // Generate a realistic sequence of visemes
      let currentTime = 0;
      while (currentTime < durationMs) {
        // Pick a random viseme, but make vowels more likely
        const rnd = Math.random();
        let visemeIndex;

        if (rnd < 0.4) {
          // 40% chance of vowel (aa, E, I, O, U)
          visemeIndex = 10 + Math.floor(Math.random() * 5);
        } else if (rnd < 0.7) {
          // 30% chance of consonant
          visemeIndex = 1 + Math.floor(Math.random() * 9);
        } else {
          // 30% chance of silence
          visemeIndex = 0;
        }

        const viseme = visemes[visemeIndex];
        const duration = 50 + Math.floor(Math.random() * 150); // 50-200ms per viseme

        fakeLipSync.visemes.push(viseme);
        fakeLipSync.vtimes.push(currentTime);
        fakeLipSync.vdurations.push(duration);

        currentTime += duration;
      }

      return {
        audio: {
          type: "pcm",
          data: [silentAudio.buffer], // Wrap buffer in array as it expects array of chunks
        },
        ...fakeLipSync,
        words: [], // Empty arrays for required fields
        wtimes: [],
        wdurations: [],
      };
    };

    // Method to make the avatar speak with custom lip-sync
    const speak = (duration = 3000) => {
      if (headRef.current) {
        const lipSyncData = createFakeLipSync(duration);
        headRef.current.speakAudio(lipSyncData as any);

        // Add natural head movements
        headRef.current.lookAt(
          window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          window.innerHeight / 2 + (Math.random() - 0.5) * 200,
          duration / 2
        );
      }
    };

    const provideLipSyncData = (lipSyncData: AudioData) => {
      if (headRef.current) {
        headRef.current.speakAudio(lipSyncData as any);
      }
    };

    // Method to change camera view
    const setView = (view: "full" | "upper" | "mid" | "head") => {
      if (headRef.current && ["full", "upper", "mid", "head"].includes(view)) {
        headRef.current.setView(view);
      }
    };

    // Method to change avatar mood
    const setMood = (mood: string) => {
      if (headRef.current) {
        headRef.current.setMood(mood);
      }
    };

    // Method to play a gesture
    const playGesture = (gesture: string, duration = 3, mirror = false) => {
      if (headRef.current) {
        headRef.current.playGesture(gesture, duration, mirror);
      }
    };

    // Expose methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        speak,
        provideLipSyncData,
        setView,
        setMood,
        playGesture,
        // Provide access to the underlying instance for advanced usage
        getInstance: () => headRef.current,
      }),
      []
    );

    return (
      <div
        ref={avatarRef}
        style={{
          width,
          height,
          position: "relative",
        }}
      />
    );
  }
);

export default TalkingHeadAvatar;
