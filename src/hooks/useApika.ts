import { useEffect, useRef, useState } from "react";
import { useLiveSessionManager } from "../ai-logic/useLiveSessionManager";
import { useAudioVisualiser } from "./useAudioVisualiser";


export const useApika = () => {
    const {
        createLiveSession,
        endLiveSession,
        triggerConversation,
        sendTextMessage,
        clearConversationDialogs,
        toggleMicrophone,
        isMicrophoneMuted,
        sessionStarted,
        microphoneTrackRef
      } = useLiveSessionManager();
    const initializedRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { audioAnalyser } = useAudioVisualiser(microphoneTrackRef);
    useEffect(() => {
        if (!initializedRef.current) {
          initializedRef.current = true;
          createLiveSession({
            sessionDetails: {
              instructions:
                "You are a helpful AI assistant. Help the user with their questions.",
              voice: "alloy",
              turnDetectionSilenceDuration: 1000,
            },
            tools: {}, // Add your tools here
            audioRef: audioRef.current,
            onSessionCreated() {
              triggerConversation(
                "User is here, greeting and start the conversation"
              );
            },
          });
        }
        return () => {
          if (initializedRef.current) {
            endLiveSession();
          }
        };
      }, []);

      return {
        sendTextMessage,
        clearConversationDialogs,
        toggleMicrophone,
        isMicrophoneMuted,
        sessionStarted,
        audioRef,
        audioAnalyser
      }
}