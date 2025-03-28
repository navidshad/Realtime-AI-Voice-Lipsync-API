import React from "react";
import { twMerge } from "tailwind-merge";
import { type CourseDetails } from "../types";
import { markdownToHtml } from "../../../utils/markdown-to-html";

type CourseDetailsCardProps = {
  course: CourseDetails;
  onSelect?: (courseId: string) => void;
};

const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({ course }) => {
  return (
    <div className="flex flex-col max-w-3xl shadow-lg rounded-3xl overflow-hidden mx-auto animate-fade-in">
      <header className="relative h-64 overflow-hidden rounded-2.5xl bg-slate-100 sm:h-60 lg:h-52 xl:h-48">
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="relative h-full w-full object-cover"
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

        <p
          className="mb-4 text-sm text-gray-600 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: markdownToHtml(course.description),
          }}
        />

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

          {course.duration && (
            <div className="flex justify-between mb-2">
              <div>Duration: </div>
              <div>{course.duration}</div>
            </div>
          )}

          {course.id && (
            <div className="flex justify-between mb-2">
              <div>Course ID: </div>
              <div>{course.id}</div>
            </div>
          )}
        </div>

        <div className="flex justify-center w-full my-3 pt-4">
          <button
            onClick={() =>
              window.open(
                `https://learn.dev.kodekloud.com/user/courses/${course.slug}`,
                "_blank"
              )
            }
            className="mt-3 w-full py-2.75 max-w-xl rounded-3xl font-bold bg-gradient-button cursor-pointer transition-all"
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
