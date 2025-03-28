import { Flow } from "./types";
import categories from "./categories.json";
import { Course, CourseDetails } from "../components/shared/types";

const FlowHimanshu: Flow = (setActiveScene) => [
  {
    label: "Step 0: Welcome",
    instructions: `
      👋 Welcome the user with a friendly message.

      ✅ Let them know you can help them discover and explore technical courses.
      ✅ Mention that you'll ask about their interests and guide them step-by-step.
      ✅ Do not ask for any preferences yet—this is just an onboarding moment.

      Example:
      "Hi there! I can help you discover hands-on courses in DevOps, Cloud, AI, and more. Ready to get started?"

      Wait for a response like "Yes" or "Let’s go" before proceeding to Step 1.
    `,
    tools: {},
  },
  {
    label: "Step 1: List of Broad Categories",
    instructions: `
        ✅ Step Overview:
        - As soon as this step starts, your **very first action** must be to call the "getListOfBroadCategories" tool.
        - Do not wait for a user message. Do not say anything before calling the tool.
        - This tool also handles rendering the list on screen — you MUST NOT describe the categories in text.
        - Accept broad inputs like "DevOps", "Cloud", "AI", etc.
        - If the user's input is unclear, follow up with a clarifying question.
        - Once a broad topic is recognized, transition to Step 2 for further refinement.

        ⚠️ Important:
        - Do NOT wait for the user to say “show me options” — you must render them proactively by calling the tool.
        - You MUST NOT list category names manually in any response.
        - You MUST call "getListOfBroadCategories" FIRST — before any explanation or conversation.

        🧠 Example:
        → *FIRST: call "getListOfBroadCategories"*
        → THEN: You may say something like:
        "Let's start by discovering your broad interests. Here are some areas you might be curious about:"

        🔁 Transition Trigger:
        - Once the user shares a broad interest, proceed to Step 2 for category clarification.
    `,
    tools: {
        getListOfBroadCategories: {
            definition: {
                type: "function",
                name: "getListOfBroadCategories",
                description: "Use this tool at the start of Step 1 to retrieve and render the list of broad categories. This MUST be your first action in this step.",

            },
            handler: () => {
            const broadCategories = Object.keys(categories)
            setActiveScene({ type: "categories", data: broadCategories });
                return {
                success: true,
                data: broadCategories,
                messageToAI:
                    "The list of broad categories has now been rendered. Do NOT list them. You may now ask the user to choose a broad interest from the rendered options."
                };
            },
        },
    },
  },
  {
    label: "Step 2: Refine and Select Category",
    instructions: `
        ✅ What to do:
        - Call getListOfCategories **with the user's broad input** (from Step 1) as the 'broadCategory' parameter to retrieve the relevant list of valid categories
        - Based on this filtered list, ALWAYS call renderListOnScreen to show the matching categories
        - Wait for the user to select one exact category from the list rendered by renderListOnScreen
        - If no selection is made, politely ask the user to pick one from the displayed list
        - If the user selects another broad or vague term that does not EXACTLY match a category from getListOfCategories, repeat this step from the beginning

        ⚠️ Important:
        - You MUST NOT list, describe, or explain categories manually
        - You MUST ALWAYS call renderListOnScreen to render the list of categories
        - You MUST NOT proceed unless the selected input exactly matches a valid category from getListOfCategories

        ✅ INSTEAD:
        - Let the UI show the options using renderListOnScreen
        - Only proceed once a valid, specific selection is made

            🧠 Examples:
            User: "I'm into DevOps"
            Assistant: "Great! Let me show you some options."
            Assistant then calls getListOfCategories({ broadCategory: "DevOps" }) → ["CI/CD", "Containers", "Monitoring"]
            Assistant then calls renderListOnScreen with: ["CI/CD", "Containers", "Monitoring"]
    `,
    tools: {
        getListOfCategories: {
            definition: {
              type: "function",
              name: "getListOfCategories",
              description: "Get the list of valid categories that the user must choose from, filtered by a broad category.",
              parameters: {
                type: "object",
                properties: {
                  broadCategory: {
                    type: "string",
                    description: "A broad or general category used to filter the list of valid categories",
                  },
                },
                required: ["broadCategory"],
              },
            },
            handler: ({ broadCategory }: { broadCategory: keyof typeof categories }) => {
          
              // Simple filter logic based on inclusion of the broadCategory string
              const filteredCategories = categories[broadCategory];
              return {
                success: true,
                data: filteredCategories,
                messageToAI: `Filtered categories based on "${broadCategory}". Use renderListOnScreen to show them.`,
              };
            },
          },
      renderListOnScreen: {
        definition: {
          type: "function",
          name: "renderListOnScreen",
          description:
            "Render a list of items (like categories) as interactive UI elements instead of listing them manually.",
          parameters: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: { type: "string" },
                description: "Array of items to show the user",
              },
            },
            required: ["items"],
          },
        },
        handler: async ({ items }) => {
          setActiveScene({ type: "categories", data: items });
          return {
            success: true,
            messageToAI:
              "The list has been rendered for the user to pick from. Wait for a valid selection.",
            data: items,
          };
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
              thumbnailUrl: "https://placekitten.com/300/200",
              tutors: ["John Doe", "Jane Smith"],
              plan: "Free",
              difficultyLevel: "Beginner"
            },
            {
              id: "course-2",
              title: `${category} Advanced`,
              thumbnailUrl: "https://placekitten.com/300/201", 
              tutors: ["Alice Johnson"],
              plan: "Pro",
              difficultyLevel: "Advanced"
            },
            {
              id: "course-3",
              title: `${category} Hands-On Projects`,
              thumbnailUrl: "https://placekitten.com/300/202",
              tutors: ["Bob Wilson", "Carol Taylor"],
              plan: "Pro",
              difficultyLevel: "Intermediate"
            }
          ] as Course[];
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
          const data: CourseDetails = {
            id: courseId,
            title: "Mock Course Title", 
            description: "This is a detailed description of the selected course.",
            duration: "6 hours",
            difficultyLevel: "Intermediate",
            tutors: ["John Doe", "Jane Smith"],
            plan: "Premium",
            thumbnailUrl: "/images/mock-course.jpg"
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
];

export default FlowHimanshu;
