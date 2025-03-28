import { 
  Course, 
  CourseSingle, 
  CourseList, 
  LessonType, 
  CourseModule, 
  Lesson,
  Metadata,
  CourseTutor,
  CourseCategory,
  IncludesSection
} from './types';

describe('Types Validation', () => {
  describe('Course Structure', () => {
    const validCourse: Course = {
      id: '1',
      slug: 'test-course',
      title: 'Test Course',
      thumbnail_url: 'https://example.com/thumb.jpg',
      thumbnail_video_url: 'https://example.com/video.mp4',
      tutors: [{
        id: '1',
        name: 'John Doe',
        bio: 'Expert Tutor',
        description: 'Experienced in teaching',
        avatar_url: 'https://example.com/avatar.jpg'
      }],
      popularity: 100,
      difficulty_level: 'Intermediate',
      categories: [{
        id: '1',
        name: 'Programming'
      }],
      plan: 'premium'
    };

    it('should validate a correct Course structure', () => {
      expect(validCourse).toBeTruthy();
      expect(validCourse.tutors.length).toBeGreaterThan(0);
      expect(validCourse.categories.length).toBeGreaterThan(0);
    });
  });

  describe('Lesson Types', () => {
    const lessons: Record<LessonType, Lesson> = {
      [LessonType.VIDEO]: {
        id: '1',
        title: 'Video Lesson',
        type: LessonType.VIDEO,
        position: 1,
        duration: 300
      },
      [LessonType.LAB]: {
        id: '2',
        title: 'Lab Exercise',
        type: LessonType.LAB,
        position: 2
      },
      [LessonType.QUIZ]: {
        id: '3',
        title: 'Quiz Test',
        type: LessonType.QUIZ,
        position: 3
      },
      [LessonType.MOCK_EXAM]: {
        id: '4',
        title: 'Mock Exam',
        type: LessonType.MOCK_EXAM,
        position: 4
      },
      [LessonType.ARTICLE]: {
        id: '5',
        title: 'Article Content',
        type: LessonType.ARTICLE,
        position: 5
      }
    };

    it('should validate all lesson types', () => {
      Object.values(lessons).forEach(lesson => {
        expect(lesson).toHaveProperty('id');
        expect(lesson).toHaveProperty('title');
        expect(lesson).toHaveProperty('type');
        expect(lesson).toHaveProperty('position');
      });
    });
  });

  describe('Course Module Structure', () => {
    const validModule: CourseModule = {
      id: '1',
      title: 'Introduction Module',
      position: 1,
      lessons_count: 2,
      lessons: [
        {
          id: '1',
          title: 'First Lesson',
          type: LessonType.VIDEO,
          position: 1,
          duration: 300
        },
        {
          id: '2',
          title: 'Second Lesson',
          type: LessonType.LAB,
          position: 2
        }
      ]
    };

    it('should validate module structure', () => {
      expect(validModule.lessons.length).toBe(validModule.lessons_count);
      expect(validModule.lessons.every(l => 'position' in l)).toBe(true);
    });
  });

  describe('Complete Course Single', () => {
    const validCourseSingle: CourseSingle = {
      id: '1',
      slug: 'complete-course',
      title: 'Complete Course',
      thumbnail_url: 'https://example.com/thumb.jpg',
      thumbnail_video_url: 'https://example.com/video.mp4',
      tutors: [{
        id: '1',
        name: 'John Doe',
        bio: 'Expert Tutor',
        description: 'Experienced in teaching',
        avatar_url: 'https://example.com/avatar.jpg'
      }],
      popularity: 100,
      difficulty_level: 'Advanced',
      categories: [{
        id: '1',
        name: 'Programming'
      }],
      plan: 'premium',
      excerpt: 'Course excerpt',
      description: 'Full course description',
      lessons_count: 2,
      userback_id: 'UB123',
      hidden: false,
      modules: [{
        id: '1',
        title: 'Module 1',
        position: 1,
        lessons_count: 2,
        lessons: [
          {
            id: '1',
            title: 'Lesson 1',
            type: LessonType.VIDEO,
            position: 1,
            duration: 300
          }
        ]
      }],
      includes_section: {
        modules_count: 1,
        lessons_count: 2,
        lab_lessons: true,
        lab_lesson_count: 1,
        quiz_lessons: true,
        quiz_lesson_count: 1,
        mock_exams: false,
        hours_of_video: 2,
        course_duration: 7200
      }
    };

    it('should validate complete course single structure', () => {
      expect(validCourseSingle).toBeTruthy();
      expect(validCourseSingle.modules.length).toBeGreaterThan(0);
      expect(validCourseSingle.includes_section).toBeTruthy();
    });
  });

  describe('Course List Structure', () => {
    const validCourseList: CourseList = {
      courses: [{
        id: '1',
        slug: 'test-course',
        title: 'Test Course',
        thumbnail_url: 'https://example.com/thumb.jpg',
        thumbnail_video_url: 'https://example.com/video.mp4',
        tutors: [{
          id: '1',
          name: 'John Doe',
          bio: 'Expert Tutor',
          description: 'Experienced in teaching',
          avatar_url: 'https://example.com/avatar.jpg'
        }],
        popularity: 100,
        difficulty_level: 'Beginner',
        categories: [{
          id: '1',
          name: 'Programming'
        }],
        plan: 'free'
      }],
      metadata: {
        limit: 10,
        page: 1,
        total_count: 100,
        next_page: 2
      }
    };

    it('should validate course list structure', () => {
      expect(validCourseList.courses.length).toBeGreaterThan(0);
      expect(validCourseList.metadata).toBeTruthy();
      expect(validCourseList.metadata.page).toBe(1);
    });
  });
}); 