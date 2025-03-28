import React from "react";
import { twMerge } from "tailwind-merge";
import { Course } from "../../types";

type CourseCardProps = {
  course: Course;
  onSelect?: (courseId: string) => void;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div className="flex flex-col max-w-xs min-w-xs shadow-lg rounded-3xl overflow-hidden">
      <header className="relative h-64 overflow-hidden rounded-2.5xl bg-slate-100 sm:h-60 lg:h-52 xl:h-48">
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="relative h-full w-full object-contain object-right-bottom"
          />
        )}

        <div className="absolute bottom-2 right-2 rounded-3xl py-1 text-xs text-white backdrop-blur backdrop-brightness-50">
          {course.plan && (
            <span className="rounded-3xl px-3 py-1 text-xs text-white backdrop-blur backdrop-brightness-100">
              {course.plan}
            </span>
          )}
        </div>
      </header>

      <div className={"rounded-b-2.5xl p-6 text-gray-900"}>
        <p className="mb-3.25 mt-1 line-clamp-2 h-12.5 text-lg">
          {course.title}
        </p>

        <div className="mt-6 text-xs">
          {course.tutors && (
            <div className="flex justify-between mb-2">
              <div>Tutors: </div>
              <div>{course.tutors.join(", ")}</div>
            </div>
          )}

          {course.difficultyLevel && (
            <div className="flex justify-between mb-2">
              <div>Level: </div>
              <div>{course.difficultyLevel}</div>
            </div>
          )}
        </div>

        <button
          onClick={() => null}
          className={twMerge("mt-3 w-full py-2.75 bg-blue-500 text-white rounded-3xl font-bold bg-gradient-button")}
        >
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
