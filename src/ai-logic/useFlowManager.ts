import { useRef, useState } from "react";
import { useLiveSessionManager } from "./useLiveSessionManager";
import { AiToolResponse, AiTools } from "./types";
import { isAsync } from "./utils";

export type ConversationStep = {
  label: string;
  instructions: string;
  tools?: AiTools;
  onEnter?: () => void;
  exitCondition?: () => boolean;
  onExit?: () => void;
};

export type FlowConfig = {
  globalInstructions?: string;
  steps: ConversationStep[];
  onBeforeStepTransition?: (step: ConversationStep) => void | Promise<void>;
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
    microphoneTrackRef,
  } = useLiveSessionManager();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const stepsRef = useRef(config.steps);

  // Function to be provided to AI for step transitions
  async function transitionToStep(options: {
    stepLabel: string;
  }): Promise<AiToolResponse> {
    const targetIndex = stepsRef.current.findIndex(
      (step) => step.label.toLowerCase() === options.stepLabel.toLowerCase()
    );

    /*
      Only for forward transtions
      - If the goal of the current step is not achieved, return false
      - If the goal of the current step is achieved, return true
    */
    if (
      // only for forward transtions
      targetIndex > currentStepIndex &&
      stepsRef.current[currentStepIndex].exitCondition
    ) {
      if (!stepsRef.current[currentStepIndex].exitCondition()) {
        return {
          success: false,
          message: `The goal of the current step is not achieved.`,
          instructionsForAi: `
            - Please try to achieve the goal of the current step.
            - If you are not sure how to achieve the goal, ask the user for clarification.
            - If you are not sure what the goal of the current step is, ask the user for clarification.
          `,
        };
      }
    }

    if (config.onBeforeStepTransition !== undefined) {
      if (isAsync(config.onBeforeStepTransition)) {
        // @ts-ignore
        await config.onBeforeStepTransition(stepsRef.current[targetIndex]);
      } else {
        config.onBeforeStepTransition(stepsRef.current[targetIndex]);
      }
    }

    if (targetIndex === -1) {
      console.error(`Step with label "${options.stepLabel}" not found`);
      return {
        success: false,
        message: `Step "${options.stepLabel}" not found`,
      };
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

    return {
      success: true,
      message: `Transitioned to step "${options.stepLabel}"`,
    };
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
        instructions:
          config.globalInstructions || "You are a helpful AI assistant.",
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
    console.log(
      "stepsRef.current[currentStepIndex].label",
      stepsRef.current[currentStepIndex].label
    );

    // Create base instruction that explains the flow context
    const baseInstruction = `You are part of a multi-step conversation flow. Here's the context:
				- Total steps: ${stepsRef.current.length}
				- Current step: ${stepsRef.current[currentStepIndex].label} (Step 1 of ${
      stepsRef.current.length
    })
				- Next steps: ${stepsRef.current
          .slice(1)
          .map((s) => s.label)
          .join(", ")}
				- Previous steps: None (this is the first step)
				
				Crucial instructions:
				1. Focus on the current step's instructions and context, try to achieve the goal of the current step as soon as possible.
				2. when you achieve the goal of the current step, use the transitionToStep function with the appropriate step label.
        3. stay a bit discriptive about the current step, but don't be too verbose.

        General goal or instructions: 
        ${config.globalInstructions}
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
    microphoneTrackRef,
  };
}
