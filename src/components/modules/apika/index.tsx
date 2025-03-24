import React, { useState } from "react";

interface ApikaCard {
    type: "card";
    title: string;
    description: string;
}

interface ApikaMessage {
    message: string;
    content: ApikaCard[];
}

const ApikaModule: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<ApikaMessage>({
    message: "Hi! I'm APIKA, your course selection assistant.",
    content: [{
      type: "card",
      title: "Course Selection Assistant",
      description: "I can help you find the perfect course based on your interests and goals. Would you like to start exploring courses together?"
    }, {
        type: "card",
        title: "Course Selection Assistant",
        description: "I can help you find the perfect course based on your interests and goals. Would you like to start exploring courses together?"
      }, {
        type: "card",
        title: "Course Selection Assistant",
        description: "I can help you find the perfect course based on your interests and goals. Would you like to start exploring courses together?"
      } ,{
        type: "card",
        title: "Course Selection Assistant",
        description: "I can help you find the perfect course based on your interests and goals. Would you like to start exploring courses together?"
      }]
  });

  // Method to set new message from AGI
  const setMessage = (message: ApikaMessage) => {
    setCurrentMessage(message);
  };

  const renderMessage = (message: ApikaMessage) => {
    return (
      <div className="w-full space-y-4">
        <div className="p-6">
          <p className="text-lg text-gray-800 text-center">{message.message}</p>
        </div>
        <div className="w-full flex flex-wrap gap-4">
            {message.content.map((card, index) => (
            <div key={index} className="w-full bg-white rounded-lg border border-gray-200 max-w-sm">
                <div className="border-b border-gray-200 p-4">
                <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
                </div>
                <div className="p-6">
                <div className="text-gray-700">{card.description}</div>
                </div>
            </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-auto p-6">
      {currentMessage && renderMessage(currentMessage)}
    </div>
  );
};

export default ApikaModule;
