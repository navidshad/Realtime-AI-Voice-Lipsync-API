import React from "react";
import { twMerge } from "tailwind-merge";
import { Course } from "../../types";

type CourseCardProps = {
  course: Course;
  onSelect?: (courseId: string) => void;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {

  return (
    <div className="flex flex-col rounded-2.5xl shadow-card">
      <header className="relative h-64 overflow-hidden rounded-t-2.5xl bg-slate-100 sm:h-60 lg:h-52 xl:h-48">
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="relative h-full w-full object-cover object-right-bottom"
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
        <p className="mb-3.25 mt-1 line-clamp-2 h-12.5 text-lg">{course.title}</p>
        
        <div className="mt-6 text-xs">
          {course.tutors && (
            <p className="mb-2">
              Tutors: {course.tutors.join(", ")}
            </p>
          )}
          {course.difficultyLevel && (
            <p>Level: {course.difficultyLevel}</p>
          )}
        </div>

        <button
          onClick={() => null}
          className={twMerge(
            "mt-3 w-full py-2.75",
            "btn-primary"
          )}
        >
            Start Learning
        </button>
      </div>
    </div>
  );
};

export default CourseCard;