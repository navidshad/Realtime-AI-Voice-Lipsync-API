export type Course = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  tutors?: string[];
  plan?: string;
  difficultyLevel?: string;
  slug?: string;
};


export type CourseDetails = {
    id: string;
    title: string;
    description: string;
    duration?: string;
    thumbnailUrl?: string;
    tutors?: string[];
    plan?: string;
    difficultyLevel?: string;
    slug?: string;
}