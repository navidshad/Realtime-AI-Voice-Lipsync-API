import React from "react";
import { twMerge } from "tailwind-merge";
import { type CourseDetails } from "../types";
import {markdownToHtml} from "../../../utils/markdown-to-html";

type CourseDetailsCardProps = {
  course: CourseDetails;
  onSelect?: (courseId: string) => void;
};

const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({ course }) => {
  return (
    <div className="flex flex-col rounded-2.5xl shadow-card">
      <header className="relative h-64 overflow-hidden rounded-t-2.5xl bg-slate-100 sm:h-60 lg:h-52 xl:h-48">
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
        <p className="mb-3.25 mt-1 line-clamp-2 h-12.5 text-lg font-semibold">{course.title}</p>
        
        <p className="mb-4 text-sm text-gray-600 line-clamp-3"
           dangerouslySetInnerHTML={{__html: markdownToHtml(course.description)}}
        />

        <div className="mt-4 space-y-2 text-xs">
          {course.tutors && (
            <p className="mb-2">
              <span className="font-medium">Tutors:</span> {course.tutors.join(", ")}
            </p>
          )}
          {course.difficultyLevel && (
            <p>
              <span className="font-medium">Level:</span> {course.difficultyLevel}
            </p>
          )}
          {course.duration && (
            <p>
              <span className="font-medium">Duration:</span> {course.duration}
            </p>
          )}
          {course.id && (
            <p>
              <span className="font-medium">Course ID:</span> {course.id}
            </p>
          )}
        </div>

        <button
          onClick={() => null}
          className={twMerge(
            "mt-6 w-full py-2.75",
            "btn-primary"
          )}
        >
            Start Learning
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;