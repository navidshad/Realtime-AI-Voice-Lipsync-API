import React from "react";
import CourseCard from "./CourseCard";
import { Course } from "../types";
import MotionDiv from "../../unit/motion";

type CourseListProps = {
  courses: Course[];
  onSelect?: (courseId: string) => void;
};

const CourseList: React.FC<CourseListProps> = ({ courses, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      {courses.map((course, index) => (
        <MotionDiv key={course.id} index={index}>
          <CourseCard key={course.id} course={course} onSelect={onSelect} />
        </MotionDiv>
      ))}
    </div>
  );
};

export default CourseList;
