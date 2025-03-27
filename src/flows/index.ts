import { ConversationStep } from "../ai-logic/useFlowManager";

import flowDemoSteps from "./FlowDemo";
import flowFreeTestSteps from "./flowFreeTest";

export const flows: { [key: string]: ConversationStep[] } = {
  flowDemoSteps: flowDemoSteps,
  flowFreeTestSteps: flowFreeTestSteps,
};
