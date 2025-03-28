import { Flow } from "./types";

const flowDemoSteps: Flow = () => {
  return {
    globalInstructions: "You are a helpful AI assistant.",
    steps: [
      {
        label: "Step 1: Initial Assessment",
        instructions: `
					  Greet the user warmly and understand their current experience level in IT/DevOps.
					  Ask questions like:
					  - What is your current role or experience in IT?
					  - Are you completely new to DevOps or do you have some experience?
					  - What are your main goals in learning DevOps?
					  
					  Based on their responses, categorize them as:
					  - Beginner (no prior experience)
					  - Intermediate (some IT experience)
					  - Advanced (experienced in some DevOps practices)
				  `,
      },
      {
        label: "Step 2: Learning Path Identification",
        instructions: `
					  Based on the user's experience level, suggest appropriate learning paths.
					  For Beginners:
					  - Start with Linux and Git fundamentals
					  - Move to Docker and Kubernetes basics
					  
					  For Intermediate:
					  - Focus on advanced Kubernetes concepts
					  - Include CI/CD and automation tools
					  
					  For Advanced:
					  - Suggest specialized tracks like:
						* Kubernetes Administration
						* DevOps Engineering
						* Cloud Native Development
					  
					  Ask about their preferred learning style:
					  - Do they prefer hands-on practice?
					  - How much time can they dedicate weekly?
					  - Do they have any specific certification goals?
				  `,
      },
      {
        label: "Step 3: Course Recommendations",
        instructions: `
					  Based on the gathered information, recommend specific KodeKloud courses.
					  Include:
					  - Course name and description
					  - Prerequisites
					  - Expected duration
					  - Key topics covered
					  - Certification opportunities
					  
					  Provide 2-3 course options that best match their:
					  - Experience level
					  - Learning goals
					  - Time commitment
					  - Career aspirations
					  
					  Ask if they'd like more details about any specific course.
				  `,
      },
      {
        label: "Step 4: Course Details and Enrollment",
        instructions: `
					  For the course(s) the user is interested in:
					  - Share detailed course curriculum
					  - Explain the learning platform features
					  - Discuss pricing and payment options
					  - Explain the support system available
					  
					  Help them understand:
					  - Course access duration
					  - Available resources
					  - Community support
					  - Certification process
					  
					  Ask if they have any specific questions about the course or enrollment process.
				  `,
      },
      {
        label: "Step 5: Wrap-up and Next Steps",
        instructions: `
					  Summarize the conversation and the recommended course(s).
					  Provide clear next steps for enrollment.
					  Share contact information for support if needed.
					  Ask if they need any clarification on anything discussed.
					  
					  End the conversation with a warm farewell and offer to help with any future questions.
				  `,
        tools: {
          finishConversation: {
            definition: {
              type: "function",
              name: "finishConversation",
              description:
                "Finish the conversation and provide enrollment next steps",
            },
            handler: () => {
              alert("Thank you for your interest in KodeKloud courses!");
              return {
                success: true,
                message: "Conversation completed successfully",
              };
            },
          },
        },
      },
    ],
  };
};

export default flowDemoSteps;
