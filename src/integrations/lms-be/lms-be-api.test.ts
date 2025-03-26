import { lmsBeApi } from './lms-be-api';
import { CourseList, CourseSingle } from './types';

// Mock fetch globally
global.fetch = jest.fn();

describe('lmsBeApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchCourses', () => {
    const mockCourseList: CourseList = {
      // @ts-ignore
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: '1',
          title: 'Test Course',
          description: 'Test Description',
        },
      ],
    };

    it('should return course list when API call is successful', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCourseList),
      });

      const result = await lmsBeApi.searchCourses('test');
      expect(result).toEqual(mockCourseList);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/courses/?search=test'));
    });

    it('should return undefined when API call fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const result = await lmsBeApi.searchCourses('test');
      expect(result).toBeUndefined();
    });

    it('should return undefined when API throws error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await lmsBeApi.searchCourses('test');
      expect(result).toBeUndefined();
    });
  });

  describe('getCourse', () => {
    const mockCourse: CourseSingle = {
      id: '1',
      title: 'Test Course',
      description: 'Test Description',
    } as CourseSingle;

    it('should return course when API call is successful', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCourse),
      });

      const result = await lmsBeApi.getCourse('1');
      expect(result).toEqual(mockCourse);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/courses/1'));
    });

    it('should return undefined when API call fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const result = await lmsBeApi.getCourse('1');
      expect(result).toBeUndefined();
    });

    it('should return undefined when API throws error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await lmsBeApi.getCourse('1');
      expect(result).toBeUndefined();
    });
  });
}); 