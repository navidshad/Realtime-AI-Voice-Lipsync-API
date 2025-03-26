import { ConversationStep } from "../ai-logic/useFlowManager";

import flowDemoSteps from "./FlowDemo";

export const flows: { [key: string]: ConversationStep[] } = {
	flowDemoSteps: flowDemoSteps
}