import React from 'react';
import {twMerge} from "tailwind-merge";

export const Assistant = ({className = ''}) => {
  return (
    <div
      id="apika-assistant"
      className={twMerge(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300",
        className
      )}
    >
      <div className="relative w-[95%] h-[90%] bg-white rounded-lg shadow-xl p-6 m-4 transform transition-all duration-300 ease-in-out animate-popup">
        <p>Hello, I'm your assistant. How can I help you today?</p>
      </div>
    </div>
  );
}

// Add this to your global CSS or tailwind.config.js
// @keyframes popup {
//   0% { opacity: 0; transform: scale(0.95); }
//   100% { opacity: 1; transform: scale(1); }
// }
// .animate-popup { animation: popup 0.3s ease-out; }