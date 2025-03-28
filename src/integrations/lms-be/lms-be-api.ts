import {CourseList, CourseSingle} from "./types";

const baseUrl = `https://learn-api.dev.kodekloud.com`

// Function to convert keys from snake_case to camelCase
const toCamelCase = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {} as any);
};

export const lmsBeApi = {
  searchCourses: async (search: string): Promise<CourseList | undefined> => {
    return fetch(`${baseUrl}/api/courses/?search=${search}`)
      .then((res) => {
        if (!res.ok) {
          return undefined
        }
        return res.json().then(toCamelCase);
      })
      .catch((e) => {
        console.error(e);
        return undefined
      });
  },
  getCoursesByCategories: async (categories: string[]): Promise<CourseList | undefined> => {
    try {
      const serializedCategories = categories.join(',')
      console.log('serialized', serializedCategories)
      const response = await fetch(`${baseUrl}/api/courses/?category=${serializedCategories}`);
      if (!response.ok) {
        console.error(`Failed to fetch courses with category ${serializedCategories}`);
        return undefined;
      }
      return response.json().then(toCamelCase);
    } catch (error) {
      console.error(`Error fetching courses with categories: ${error}`);
      return undefined;
    }
  },
  getCoursesByTutors: async (tutors: string[]): Promise<CourseList | undefined> => {
    try {
      const serializedTutors = tutors.join(',')
      console.log('serialized', serializedTutors)
      const response = await fetch(`${baseUrl}/api/courses/?tutor_name=${serializedTutors}`);
      if (!response.ok) {
        console.error(`Failed to fetch courses with tutor ${serializedTutors}`);
        return undefined;
      }
      return response.json().then(toCamelCase);
    } catch (error) {
      console.error(`Error fetching courses with tutor: ${error}`);
      return undefined;
    }
  },
  getCoursesByPlan: async (plans: string[]): Promise<CourseList | undefined> => {
    try {
      const serializedPlans = plans.join(',')
      console.log('serialized', serializedPlans)
      const response = await fetch(`${baseUrl}/api/courses/?plan=${serializedPlans}`);
      if (!response.ok) {
        console.error(`Failed to fetch courses with plan ${serializedPlans}`);
        return undefined;
      }
      return response.json().then(toCamelCase);
    } catch (error) {
      console.error(`Error fetching courses with plan: ${error}`);
      return undefined;
    }
  },
  getCourse: async (courseId: string): Promise<CourseSingle | undefined> => {
    try {
      const response = await fetch(`${baseUrl}/api/courses/${courseId}`);
      if (!response.ok) {
        console.error(`Failed to fetch course with ID ${courseId}`);
        return undefined;
      }
      return response.json().then(toCamelCase);
    } catch (error) {
      console.error(`Error fetching course with ID ${courseId}: ${error}`);
      return undefined;
    }
  }
}