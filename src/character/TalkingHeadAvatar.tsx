import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { TalkingHead } from "talkinghead";
import { AudioData, SpeakData } from "./types";
// import { createFakeLipSync } from "./utils";

// Define props interface
interface TalkingHeadProps {
  characterUrl: string;
  bodyType?: "M" | "F";
  initialView?: "full" | "upper" | "mid" | "head";
  initialMood?: string;
  lipsyncLang?: string;
  height?: string | number;
  width?: string | number;
  onReady?: (head: TalkingHead) => void;
  onError?: (error: any) => void;
}

// Define ref interface
export interface TalkingHeadRef {
  speak: (duration?: number) => void;
  provideLipSyncData: (lipSyncData: AudioData) => void;
  provideOculusLipSyncData: (lipSyncData: AudioData) => void;
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
      lipsyncLang = "en",
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

            // @ts-ignore
            window.head = head;

            // Load the avatar
            await head.showAvatar({
              url: characterUrl,
              body: bodyType,
              avatarMood: initialMood,
              lipsyncLang: lipsyncLang,
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

    // Method to make the avatar speak with custom lip-sync
    const speak = (duration = 3000) => {
      // if (headRef.current) {
      //   const lipSyncData = createFakeLipSync(duration);
      //   headRef.current.speakAudio(lipSyncData as any);
      //   // Add natural head movements
      //   headRef.current.lookAt(
      //     window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      //     window.innerHeight / 2 + (Math.random() - 0.5) * 200,
      //     duration / 2
      //   );
      // }
    };

    const provideLipSyncData = async (lipSyncData: AudioData) => {
      if (headRef.current) {
        const speakData = {
          // @ts-ignore
          audio: await headRef.current?.audioCtx.decodeAudioData(
            lipSyncData.audio
          ),
          ...generateLipSyncDataFromTranscription({
            words: lipSyncData.words,
            segments: lipSyncData.segments,
          }),
        };

        headRef.current.speakAudio(speakData as any);
      }
    };

    const provideOculusLipSyncData = async (lipSyncData: AudioData) => {
      if (headRef.current) {
        const speakData = {
          // @ts-ignore
          audio: await headRef.current?.audioCtx.decodeAudioData(
            lipSyncData.audio
          ),
          ...generateLipSyncDataFromTranscription({
            words: lipSyncData.words,
            segments: lipSyncData.segments,
          }),
        };

        headRef.current.speakAudio(speakData as any);
      }
    };

    function generateLipSyncDataFromTranscription({
      words,
      segments,
    }: {
      words: any[];
      segments: any[];
    }) {
      const audioData: SpeakData = {
        words: [],
        wtimes: [],
        wdurations: [],
        markers: [],
        mtimes: [],
      };

      // Process words
      words.forEach((word) => {
        audioData.words.push(word.word);
        audioData.wtimes.push(1000 * word.start - 50); // Adjust timing to match example
        audioData.wdurations.push(1000 * (word.end - word.start));
      });

      // Callback function to make the avatar look at the camera
      const startSegment = async () => {
        console.log("startSegment");
        // @ts-ignore
        headRef.current?.lookAtCamera(500);
        // @ts-ignore
        headRef.current?.speakWithHands();
      };

      // Add timed callback markers to the audio object
      segments.forEach((x) => {
        if (x.start > 2 && x.text.length > 10) {
          audioData.markers.push(startSegment);
          audioData.mtimes.push(1000 * x.start - 1000);
        }
      });

      return audioData;
    }

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
        provideOculusLipSyncData,
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
