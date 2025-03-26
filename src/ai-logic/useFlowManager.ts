import { useRef, useState } from "react";
import { useLiveSessionManager } from "./useLiveSessionManager";
import { AiTools } from "./types";

export type ConversationStep = {
	label: string;
	instructions: string;
	tools?: AiTools;
	onEnter?: () => void;
	onExit?: () => void;
};

export type FlowConfig = {
	steps: ConversationStep[];
	onComplete?: () => void;
};

export function useFlowManager(config: FlowConfig) {
	const {
		updateSessionConfig,
		conversationDialogs,
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

	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const stepsRef = useRef(config.steps);

	// Function to be provided to AI for step transitions
	function transitionToStep(options: { stepLabel: string }) {
		const targetIndex = stepsRef.current.findIndex(
			(step) => step.label.toLowerCase() === options.stepLabel.toLowerCase()
		);

		if (targetIndex === -1) {
			console.error(`Step with label "${options.stepLabel}" not found`);
			return { success: false, message: `Step "${options.stepLabel}" not found` };
		}

		// Call onExit for current step if exists
		if (stepsRef.current[currentStepIndex].onExit) {
			stepsRef.current[currentStepIndex].onExit!();
		}

		// Update current step
		setCurrentStepIndex(targetIndex);

		// Call onEnter for new step if exists
		if (stepsRef.current[targetIndex].onEnter) {
			stepsRef.current[targetIndex].onEnter!();
		}

		const currentStep = stepsRef.current[targetIndex];

		// Combine step-specific tools with the default transition tool
		const allTools = {
			transitionToStep: getTransitionTool(),
			...(currentStep.tools ? currentStep.tools : {}),
		};

		// Update session config with new step's instructions and tools
		updateSessionConfig(
			getInstructions(currentStep.instructions),
			allTools as AiTools
		);

		// Check if this is the last step
		if (targetIndex === stepsRef.current.length - 1 && config.onComplete) {
			config.onComplete();
		}

		return { success: true, message: `Transitioned to step "${options.stepLabel}"` };
	}



	function getTransitionTool() {
		const defaultTransitionTool = {
			definition: {
				type: "function",
				name: "transitionToStep",
				description:
					"Transition to a different conversation step. Use this when you determine it's time to move to the next step in the conversation flow.",
				parameters: {
					type: "object",
					properties: {
						stepLabel: {
							type: "string",
							description:
								"The label of the steps: " +
								stepsRef.current.map((s) => s.label).join(", "),
						},
					},
					required: ["stepLabel"],
				},
			},
			handler: transitionToStep,
		};

		return defaultTransitionTool;
	}

	// Initialize the first step
	const initializeFlow = (options: {
		onUpdate?: (eventData: any) => void;
		audioRef: HTMLAudioElement | null;
	}) => {
		/**
		 * Initialize the live session
		 */
		createLiveSession({
			sessionDetails: {
				instructions: "You are a helpful AI assistant.",
				voice: "alloy",
				turnDetectionSilenceDuration: 1000,
			},
			tools: {}, // Add your tools here
			audioRef: options.audioRef,
			onUpdate: options.onUpdate,
			onSessionCreated() {
				/**
				 * Initialize the first step
				 */
				const firstStep = stepsRef.current[0];

				if (firstStep.onEnter) {
					firstStep.onEnter();
				}

				// Combine step-specific tools with the default transition tool
				const allTools = {
					transitionToStep: getTransitionTool(),
					...firstStep.tools,
				};

				updateSessionConfig(
					getInstructions(firstStep.instructions),
					allTools as AiTools
				);
			},
		});
	};

	function getInstructions(stepInstructions: string) {
		// Create base instruction that explains the flow context
		const baseInstruction = `You are part of a multi-step conversation flow. Here's the context:
				- Total steps: ${stepsRef.current.length}
				- Current step: ${stepsRef.current[currentStepIndex].label} (Step 1 of ${stepsRef.current.length
			})
				- Next steps: ${stepsRef.current
				.slice(1)
				.map((s) => s.label)
				.join(", ")}
				- Previous steps: None (this is the first step)
				
				Crucial instructions:
				1. Focus on the current step's instructions and context, try to achieve the goal of the current step as soon as possible.
				2. when you achieve the goal of the current step, use the transitionToStep function with the appropriate step label.
			`;

		return `${baseInstruction}\n\n${stepInstructions}`;
	}

	// Get current step
	const getCurrentStep = () => {
		return stepsRef.current[currentStepIndex];
	};

	// Get all available steps
	const getSteps = () => {
		return stepsRef.current;
	};

	// Reset flow to initial state
	const resetFlow = (options: { audioRef: HTMLAudioElement | null }) => {
		if (stepsRef.current[currentStepIndex].onExit) {
			stepsRef.current[currentStepIndex].onExit!();
		}
		setCurrentStepIndex(0);
		initializeFlow(options);
	};

	return {
		currentStep: getCurrentStep(),
		currentStepIndex,
		steps: getSteps(),
		transitionToStep,
		initializeFlow,
		resetFlow,

		// Live session manager
		updateSessionConfig,
		conversationDialogs,
		endLiveSession,
		triggerConversation,
		sendTextMessage,
		clearConversationDialogs,
		toggleMicrophone,
		isMicrophoneMuted,
		sessionStarted,
		microphoneTrackRef
	};
}
