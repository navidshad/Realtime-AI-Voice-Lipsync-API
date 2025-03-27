import React from "react";
import CourseCard from "../CourseCard";

type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration?: string;
  syllabus?: string[];
  highlights?: string[];
};

type CourseListProps = {
  courses: Course[];
  onSelect?: (courseId: string) => void;
};

const CourseList: React.FC<CourseListProps> = ({ courses, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default CourseList;