import { useEffect, useRef } from "react";
import { useAudioVisualiser } from "./useAudioVisualiser";
import { useFlowManager } from "../ai-logic/useFlowManager";
import { flows } from "../flows";
import { useSceneManager } from "./useSceneManager";
import { selectedFlowAtom } from "../store/atoms";
import { useAtom } from "jotai";

export const useApika = () => {
  const [currentActiveFlow] = useAtom(selectedFlowAtom);
  const { setActiveScene, sceneManager } = useSceneManager();
  const {
    initializeFlow,
    endLiveSession,
    sendTextMessage,
    toggleMicrophone,
    isMicrophoneMuted,
    sessionStarted,
    microphoneTrackRef,
  } = useFlowManager({
    steps: flows[currentActiveFlow](setActiveScene),
    onBeforeStepTransition() {
        setActiveScene({ 
            type: "none",
            data: undefined
        });
    },
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
    audioAnalyser,
    sceneManager,
  };
};
