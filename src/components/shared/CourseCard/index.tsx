import React from "react";

type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration?: string;
  syllabus?: string[];
  highlights?: string[];
};

type CourseCardProps = {
  course: Course;
  onSelect?: (courseId: string) => void;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div
      className="border border-gray-300 rounded-2xl p-4 shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={() => onSelect?.(course.id)}
    >
      <h2 className="text-xl font-bold mb-1">{course.title}</h2>
      <p className="text-sm text-gray-600 mb-2">{course.description}</p>

      <div className="text-sm mb-2">
        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
          Level: {course.level}
        </span>
        {course.duration && (
          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Duration: {course.duration}
          </span>
        )}
      </div>

      {course.syllabus && (
        <div className="mt-2">
          <h4 className="font-semibold text-sm mb-1">Syllabus:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {course.syllabus.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {course.highlights && (
        <div className="mt-2">
          <h4 className="font-semibold text-sm mb-1">Highlights:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {course.highlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseCard;