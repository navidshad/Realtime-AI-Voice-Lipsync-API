import {CourseList, CourseSingle} from "./types";
import {isLocalhost} from "../../constants";

const baseUrl = `https://learn-api${isLocalhost && '.dev'}.kodekloud.com`

export const lmsBeApi = {
  searchCourses: async (search: string): Promise<CourseList | undefined> => {
    return fetch(`${baseUrl}/api/courses/?search=${search}`)
      .then((res) => {
        if (!res.ok) {
          return undefined
        }
        return res.json();
      })
      .catch((e) => {
        console.error(e);
        return undefined
      });
  },
  getCourse: async (courseId: string): Promise<CourseSingle | undefined> => {
    try {
      const response = await fetch(`${baseUrl}/api/courses/${courseId}`);
      if (!response.ok) {
        console.error(`Failed to fetch course with ID ${courseId}`);
        return undefined;
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching course with ID ${courseId}: ${error}`);
      return undefined;
    }
  }
}