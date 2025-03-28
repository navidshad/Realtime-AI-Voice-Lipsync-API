import { Flow } from "./types";
import categories from "./categories.json";
import { useState } from "react";

const FlowHimanshu: Flow = (setActiveScene) => {
  let selectedBroadCategory: string | undefined;
  let selectedCategory: string | undefined;

  return {
    globalInstructions: `
      You are the AI assistant for KodeKloud.
      You are helping the user to find the best available courses for their interests based on kodekloud's catalog.
    `,
    steps: [
      {
        label: "Step 1: Greeting, List of Broad Categories",
        instructions: `
          This step is two genral parts:
          1. Greeting the user
          2. Showing the list of broad categories
    
          Part 1: Greeting the user
          - 👋 Welcome the user with a friendly message.
          - Let them know you can help them discover and explore technical courses.
          - Mention that you'll ask about their interests and guide them step-by-step.
          - Do not ask for any preferences yet—this is just an onboarding moment.
    
          Part 2: Showing the list of broad categories
          - As soon as this step starts, your **very first action** must be to call the "showCategories" tool.
          - Do not wait for a user message. Do not say anything before calling the tool.
          - This tool also handles rendering the list on screen — you MUST NOT describe the categories in text.
          - Accept broad inputs like "DevOps", "Cloud", "AI", etc.
          - If the user's input is unclear, follow up with a clarifying question.
          - Once a broad topic is recognized, transition to Step 2 for further refinement.
    
          ⚠️ Important:
          - Do NOT wait for the user to say "show me options" — you must render them proactively by calling the tool.
          - You MUST NOT list category names manually in any response.
          - You MUST call "showCategories" FIRST — before any explanation or conversation.
    
          Goal:
          - Greet the user
          - Show the list of broad categories
          - Wait for the user to choose a broad interest
        `,
        tools: {
          showCategories: {
            definition: {
              type: "function",
              name: "showCategories",
              description:
                "Call this tool to show the list of broad categories to the user",
            },
            handler: () => {
              const broadCategories = Object.keys(categories);
              setActiveScene({ type: "categories", data: broadCategories });
              return {
                success: true,
                data: broadCategories,
                messageToAI:
                  "The list of broad categories has now been rendered. Do NOT list them. You may now ask the user to choose a broad interest from the rendered options.",
              };
            },
          },
          selectBroadCategory: {
            definition: {
              type: "function",
              name: "selectBroadCategory",
              description:
                "Select a broad category from the list of categories",
              parameters: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    description: "The selected category",
                  },
                },
                required: ["category"],
              },
            },
            handler: ({ category }) => {
              const broadCategories = Object.keys(categories);
              if (!broadCategories.includes(category)) {
                return {
                  success: false,
                  messageToAI: `Invalid category: ${category}`,
                };
              } else {
                selectedBroadCategory = category;
                setActiveScene({ type: "none", data: undefined });
                return {
                  success: true,
                  messageToAI: `Selected broad category: ${category}, now transition to next step`,
                };
              }
            },
          },
        },
        exitCondition: () => {
          if (selectedBroadCategory === undefined) {
            return false;
          } else {
            return true;
          }
        },
      },
      {
        label: "Step 2: Refine and Select Category",
        instructions: (stepIndex) => {
          const validCategories = categories[
            selectedBroadCategory as keyof typeof categories
          ].map((c: any) => c.name);
          const validCategoriesString = validCategories.join(", ");

          return `
            ✅ What to do:
            - Wait for the user to select one exact category from the list rendered on the screen
            - If no selection is made, politely ask the user to pick one from the displayed list
            - If the user selects another broad or vague term that does not EXACTLY match a category from getListOfCategories, repeat this step from the beginning
    
            ⚠️ Important:
            - You MUST NOT list, describe, or enumerate categories manually in your response
            - You MUST verify the user's selection against the returned list of valid categories
            - You MUST NOT proceed unless the selected category EXACTLY matches a category name from the list
            - If the user wants to select a different broad category, return to Step 1
            - If user's selection is ambiguous or not an exact match, ask them to specifically choose one from the displayed list
    
            Goal:
            - to help user to select a valid category from the list

            Valid categories:
            ${validCategoriesString}
        `;
        },
        exitCondition: () => {
          if (selectedCategory === undefined) {
            return false;
          } else {
            return true;
          }
        },
        onEnter: () => {
          const filteredCategories =
            categories[selectedBroadCategory as keyof typeof categories];
          setActiveScene({
            type: "categories",
            data: filteredCategories.map((c: any) => c.name),
          });
        },
        tools: {
          // getListOfCategories: {
          //   definition: {
          //     type: "function",
          //     name: "getListOfCategories",
          //     description:
          //       "Get the list of valid categories that the user must choose from, filtered by a broad category.",
          //     parameters: {
          //       type: "object",
          //       properties: {
          //         broadCategory: {
          //           type: "string",
          //           description:
          //             "A broad or general category used to filter the list of valid categories",
          //         },
          //       },
          //       required: ["broadCategory"],
          //     },
          //   },
          //   handler: ({
          //     broadCategory,
          //   }: {
          //     broadCategory: keyof typeof categories;
          //   }) => {
          //     // Simple filter logic based on inclusion of the broadCategory string
          //     const filteredCategories = categories[broadCategory];
          //     setActiveScene({
          //       type: "categories",
          //       data: filteredCategories.map((c) => c.name),
          //     });
          //     return {
          //       success: true,
          //       data: filteredCategories,
          //       messageToAI: `Filtered categories based on "${broadCategory}" are on the screen.`,
          //     };
          //   },
          // },
          selectCategory: {
            definition: {
              type: "function",
              name: "selectCategory",
              description: "Select a category from the list of categories",
            },
            handler: ({ category }) => {
              const filteredCategories =
                categories[selectedBroadCategory as keyof typeof categories];
              const existingCategory = filteredCategories.find(
                (c) => c.name === category
              );
              if (!existingCategory) {
                return {
                  success: false,
                  messageToAI: `Invalid category: ${category}`,
                };
              } else {
                selectedCategory = category;
                setActiveScene({ type: "none", data: undefined });
                return {
                  success: true,
                };
              }
            },
          },
        },
      },
      {
        label: "Step 3: Show Relevant Courses",
        instructions: `
          ✅ Use the exact category name validated in Step 1.
    
          1. Call fetchCourses with the EXACT category name
          2. Wait for the UI to display course cards
          3. Wait for user's selection
    
          ⚠️ STRICT RULES:
          - DO NOT list, describe, paraphrase or format course data
          - DO NOT use markdown, bullet points or alter the category name
    
          ✅ INSTEAD:
          - Simply call fetchCourses tool with the exact category name
          - UI will render the cards
          - Wait for user interaction to proceed
    
          🔁 If user wants to change interest, go back to Step 1.
        `,
        tools: {
          fetchCourses: {
            definition: {
              type: "function",
              name: "fetchCourses",
              description: "Fetch a list of courses based on a category.",
              parameters: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    description: "Category to filter courses",
                  },
                },
                required: ["category"],
              },
            },
            handler: async ({ category }) => {
              // https://learn-api.dev.kodekloud.com/api/courses?category=Automation
              console.log(`Mock fetchCourses called with topic: ${category}`);
              const data = [
                {
                  id: "course-1",
                  title: `Intro to ${category}`,
                  description: `A beginner-friendly introduction to ${category}.`,
                  level: "Beginner",
                },
                {
                  id: "course-2",
                  title: `${category} Advanced`,
                  description: `An advanced course diving deep into ${category}.`,
                  level: "Advanced",
                },
                {
                  id: "course-3",
                  title: `${category} Hands-On Projects`,
                  description: `Practice ${category} through real-world projects.`,
                  level: "Intermediate",
                },
              ];
              setActiveScene({ type: "list", data });
              return {
                success: true,
                data,
                messageToAI: `Courses for ${category} have been fetched and displayed as cards.`,
              };
            },
          },
        },
      },
      {
        label: "Step 4: Course Deep Dive",
        instructions: `
          ✅ When a user selects a course, fetch details using the Course Details API.
    
          ⚠️ RULES:
          - DO NOT describe or paraphrase the course
          - DO NOT use formatting or generate bullet points
    
          ✅ INSTEAD:
          - Call fetchCourseDetails with the selected courseId
          - UI will show the content
          - Wait for user's response on what to do next
    
          🔁 If they want more courses, check if the interest is same, if yes go back to Step 3
          🔁 If they want new topics or interests or categories go back to Step 1
        `,
        tools: {
          fetchCourseDetails: {
            definition: {
              type: "function",
              name: "fetchCourseDetails",
              description: "Fetch detailed info about a single course by ID.",
              parameters: {
                type: "object",
                properties: {
                  courseId: {
                    type: "string",
                    description: "Unique ID of the course",
                  },
                },
                required: ["courseId"],
              },
            },
            handler: async ({ courseId }) => {
              console.log(
                `Mock fetchCourseDetails called with courseId: ${courseId}`
              );
              const data = {
                id: courseId,
                title: "Mock Course Title",
                description:
                  "This is a detailed description of the selected course.",
                level: "Intermediate",
                duration: "6 hours",
                syllabus: [
                  "Module 1: Introduction",
                  "Module 2: Core Concepts",
                  "Module 3: Hands-On Labs",
                  "Module 4: Final Project",
                ],
                highlights: [
                  "100% hands-on",
                  "Certificate of Completion",
                  "Lifetime Access",
                ],
              };
              setActiveScene({ type: "details", data });
              return {
                success: true,
                messageToAI: `This is the data. Explain in a natural conversation way only.`,
                data,
              };
            },
          },
        },
      },
      {
        label: "Step 5: Wrap Up",
        instructions: `
          ✅ Wrap up the conversation politely.
    
          - If user found a course or wants to leave → say goodbye and offer to return anytime
          - If they want more → ask if same interest → Step 3 or new one → Step 1
        `,
        tools: {
          clearActiveScene: {
            definition: {
              type: "function",
              name: "clearActiveScene",
              description:
                "Clear the active scene, if any scene from previous steps is still active",
            },
            handler: async () => {
              setActiveScene({ type: "none", data: undefined });
              return {
                success: true,
                message: "Active scene cleared",
                messageToAI: "The active scene has been reset for a clean end.",
              };
            },
          },
          finishConversation: {
            definition: {
              type: "function",
              name: "finishConversation",
              description: "Finish the conversation and say goodbye",
            },
            handler: async () => {
              alert("Conversation finished");
              return {
                success: true,
                message: "Conversation finished",
                messageToAI:
                  "The user has completed their session. Say goodbye warmly.",
              };
            },
          },
        },
      },
    ],
  };
};

export default FlowHimanshu;
