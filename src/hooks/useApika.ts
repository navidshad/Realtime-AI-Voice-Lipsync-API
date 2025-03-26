import { useEffect, useRef, useState } from "react";
import { useAudioVisualiser } from "./useAudioVisualiser";
import { useFlowManager } from "../ai-logic/useFlowManager";
import { flows } from "../flows";

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
    steps: flows.flowDemoSteps,
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