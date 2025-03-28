import { Flow } from "./types";

const FlowFreeTest: Flow = () => {
  return {
    globalInstructions: "You are a helpful AI assistant.",
    steps: [
      {
        label: "Step 1: Function testing",
        instructions: `
          Perform the function user has requested.
        `,
        tools: {
          normalFunction: {
            definition: {
              type: "function",
              name: "normalFunction",
              description: "Perform the function user has requested.",
            },
            handler: () => {
              return {
                success: true,
                message: "The normal function executed successfully",
              };
            },
          },
          asyncFunction: {
            definition: {
              type: "function",
              name: "asyncFunction",
              description:
                "Perform the function user has requested asynchronously.",
            },
            handler: async () => {
              return Promise.resolve({
                success: true,
                message: "The async function executed successfully",
              });
            },
          },
        },
      },
      {
        label: "Step 2: Function testing 2",
        instructions: `
          Perform the function user has requested.
        `,
        tools: {
          normalFunction: {
            definition: {
              type: "function",
              name: "normalFunction",
              description: "Perform the function user has requested.",
            },
            handler: () => {
              return {
                success: true,
                message: "The normal function executed successfully",
              };
            },
          },
          asyncFunction: {
            definition: {
              type: "function",
              name: "asyncFunction",
              description:
                "Perform the function user has requested asynchronously.",
            },
            handler: async () => {
              return Promise.resolve({
                success: true,
                message: "The async function executed successfully",
              });
            },
          },
        },
      },
    ],
  };
};

export default FlowFreeTest;
