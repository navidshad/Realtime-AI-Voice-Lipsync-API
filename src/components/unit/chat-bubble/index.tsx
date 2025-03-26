import React from "react";

interface ChatBubbleProps {
  text: string;
  sender: "user" | "ai";
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, sender }) => {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
<div
  className={`max-w-xs px-4 py-2 rounded-lg text-white text-sm shadow-md transition-all duration-300 whitespace-pre-wrap ${
    isUser
      ? "bg-blue-500 animate-slide-in-right"
      : "bg-gray-500 animate-slide-in-left"
  }`}
>
        {text}
      </div>
    </div>
  );
};

export default ChatBubble;
