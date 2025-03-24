import React, { useState } from "react";
import { SendButton, TextBox, ChatBubble } from "../../unit";

interface Message {
  text: string;
  sender: "user" | "apika";
}

const ChatModule: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm APIKA, your course selection assistant.",
      sender: "apika"
    },
    {
      text: "Hi! I'd like to learn more about course selection.",
      sender: "user"
    },
    {
      text: "I'd be happy to help you with course selection! What's your area of interest?",
      sender: "apika"
    },
    {
      text: "I'm interested in computer science and artificial intelligence.",
      sender: "user"
    },
    {
      text: "Great choice! There are many exciting courses in those fields. Would you like me to recommend some introductory courses or more advanced options?",
      sender: "apika"
    }
  ]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (!input.trim()) return;
    // Preserve newlines in the message
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto rounded-lg shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <ChatBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <div className="flex p-4 border-t border-gray-200">
        <TextBox input={input} setInput={setInput} onEnter={handleSend} />
        <SendButton onClick={handleSend} />
      </div>
    </div>
  );
};

export default ChatModule;