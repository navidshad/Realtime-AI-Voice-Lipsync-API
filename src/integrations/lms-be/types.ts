export type Metadata = {
  limit: number
  page: number
  total_count: number
  next_page: number | null
}

export type CourseTutor = {
  id: string
  name: string
  bio: string
  description: string
  avatar_url: string
}
export type CourseCategory = {
  id: string
  name: string
}
export type Course = {
  id: string
  slug: string
  title: string
  thumbnail_url: string
  thumbnail_video_url: string
  tutors: CourseTutor[]
  popularity: number
  difficulty_level:string
  categories: CourseCategory[]
  plan: string
}

export type IncludesSection = {
  modules_count: number
  lessons_count: number
  lab_lessons: boolean
  lab_lesson_count: number
  quiz_lessons: boolean
  quiz_lesson_count: number
  mock_exams: boolean
  hours_of_video: number
  course_duration: number
}

export enum LessonType {
  LAB = 'lab',
  QUIZ = 'quiz',
  MOCK_EXAM = 'mock_exam',
  VIDEO = 'video',
  ARTICLE = 'article',
}

export type Lesson = {
  id: string
  title: string
  type: LessonType
  position: number
  duration?: number
}

export type CourseModule = {
  id: string
  title: string
  position: number
  lessons_count: number
  lessons: Lesson[]
}

export type CourseSingle = {
  excerpt: string
  description: string
  lessons_count: number
  userback_id: string
  hidden: boolean
  modules: CourseModule[]
  includes_section: IncludesSection
} & Course

export type CourseList = {
  courses: Course[]
  metadata: Metadata
}