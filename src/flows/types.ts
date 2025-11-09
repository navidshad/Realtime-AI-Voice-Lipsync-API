import { ConversationStep } from "../ai-logic/useFlowManager";
import { ActiveSceneType } from "../hooks/useSceneManager";

export type Flow = (setActiveScene: (scene: ActiveSceneType) => void) => {
  globalInstructions: string;
  steps: ConversationStep[];
};
