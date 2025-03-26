import { useEffect, useRef, useState } from "react";
import { useAudioVisualiser } from "./useAudioVisualiser";
import { useFlowManager } from "../ai-logic/useFlowManager";


export const useApika = () => {
      const {
        initializeFlow,
        endLiveSession,
        sendTextMessage,
        toggleMicrophone,
        isMicrophoneMuted,
        sessionStarted,
        microphoneTrackRef
      } = useFlowManager({
        steps: [
        {
            label: "Step 1: Discover Interests",
            instructions: `
                Greet the user and help them identify their area of interest for learning DevOps.
                Ask questions like: "Are you interested in DevOps, AI, or something else?".
                Avoid suggesting any specific courses at this stage.
            `,
            tools: {},
            },
          {
            label: "Step 2",
            instructions: `
            Goal: Now let's talk about the selected city.
            Instructions: Talk about the selected city in detail.
            Finish signal: if user shows he or she got the enough information about the city.
            `,
            tools: {},
          },
          {
            label: "Step 3",
            instructions: "Finish the conversation, and say goodbye",
            tools: {
              finishConversation: {
                definition: {
                  type: "function",
                  name: "finishConversation",
                  description: "Finish the conversation, and say goodbye",
                },
                handler: () => {
                  alert("Conversation finished");
                  return { success: true, message: "Conversation finished" };
                },
              },
            },
          },
        ],
      });

    const initializedRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { audioAnalyser } = useAudioVisualiser(microphoneTrackRef);
    useEffect(() => {
        if (!initializedRef.current) {
          initializedRef.current = true;
          initializeFlow({ audioRef: audioRef.current, onUpdate });
        }
        return () => {
          if (initializedRef.current) {
            endLiveSession();
          }
        };
      }, []);
      const onUpdate = (eventData: any) => {
        console.log("onUpdate", eventData);
      };

      return {
        sendTextMessage,
        toggleMicrophone,
        isMicrophoneMuted,
        sessionStarted,
        audioRef,
        audioAnalyser
      }
}