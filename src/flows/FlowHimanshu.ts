import { Flow } from "./types";
import categories from "./categories.json";
const FlowHimanshu: Flow = (setActiveScene) => [
  {
    label: "Step 1: Discover Interests",
    instructions: `
            1. FIRST: Call getListOfCategories to fetch the ONLY valid categories.
            2. THEN: Help the user select SPECIFICALLY from these categories.

            ⚠️ CRITICAL RULES:
            - ONLY accept interests that EXACTLY match the categories from getListOfCategories
            - If user mentions anything not in the list, say: "I don't see that in our available categories.
              Let me show you what we have..." and then list some relevant options from our actual categories
            - Never proceed until user has selected a valid category from the list

            Suggested approach:
            - Start broad: "We offer courses in areas like DevOps, Cloud, Security, and AI. Which interests you?"
            - If needed, list more specific options from our categories
            - Always verify the user's interest matches one of our exact categories

            Remember: Do not suggest any specific courses at this stage.
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
          setActiveScene({
            type: "none",
            data: undefined,
          });
          return { success: true, message: "Active scene cleared" };
        },
      },
      getListOfCategories: {
        definition: {
          type: "function",
          name: "getListOfCategories",
          description:
            "Get a list of categories that is supported by the AI. Interests of the user should be one of these categories.",
        },
        handler: () => {
            return {
                success: true,
                data: categories
            };
        },
      },
    },
  },
  {
    label: "Step 2: Show Relevant Courses",
    instructions: `
              IMPORTANT: Only use the exact category name that was validated in Step 1 using getListOfCategories.
              DO NOT modify, paraphrase, or alter the category name in any way.

              Based on the user's validated category:
              1. Call fetchCourses with the EXACT category name
              2. Wait for the UI to display the course cards
              3. Wait for user's selection

              ⚠️ IMPORTANT:
              - DO NOT list or describe any courses yourself
              - DO NOT generate markdown, bullet points, or numbered course lists
              - DO NOT paraphrase or repeat course data
              - DO NOT use markdown or any formatting
              - DO NOT modify the category name - use it exactly as validated in Step 1

              ✅ INSTEAD:
              - Simply call the fetchCourses tool with the exact category name from Step 1
              - The UI will automatically display the courses as cards
              - Wait for the user's selection to proceed

              Only respond with follow-up questions or clarifications (if needed), NOT course content.
              If they want to change their interests, go back to Step 1.
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
                description: "category to filter courses",
              },
            },
            required: ["category"],
          },
        },
        handler: async ({ category }) => {
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
          setActiveScene({
            type: "list",
            data: data,
          });
          return {
            success: true,
            data,
          };
        },
      },
    },
  },
  {
    label: "Step 3: Course Deep Dive",
    instructions: `
            When a user selects a course, fetch its details using the Course Details API.
            Display course syllabus, duration, difficulty, and any relevant highlights in a visually engaging way.
            Ask if the user wants to explore more courses or end the session.
              ⚠️ IMPORTANT:
              - DO NOT list or describe any course details yourself.
              - DO NOT generate markdown, bullet points, or numbered items for any course details.
              - DO NOT paraphrase or repeat course data.
              - DO NOT use markdown or any formatting.
              ✅ INSTEAD:
              - Simply call the fetchCourseDetails tool with the courseId.
              - The UI will automatically display the course as a card.
              - Wait for the user's selection to proceed.

              Only respond with follow-up questions or clarifications (if needed), NOT course content.
              If they want to explore more courses, ask if they still have the same interests.
                  If yes, then go back to Step 2.
                  If they want to change their interests, go back to Step 1.
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
          setActiveScene({
            type: "details",
            data: data,
          });
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
    label: "Step 4: Wrap Up",
    instructions: `
            If the user has found a course or doesn't want to continue, end the conversation positively.
            Remind them they can always come back to explore more.
            Say goodbye.
            If they want to explore more courses, ask if they still have the same interests. If yes, then go back to Step 2.
            If they want to change their interests, go back to Step 1.
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
          setActiveScene({
            type: "none",
            data: undefined,
          });
          return { success: true, message: "Active scene cleared" };
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
          return { success: true, message: "Conversation finished" };
        },
      },
    },
  },
];

export default FlowHimanshu;
