import React, { useState } from "react";
import { SendButton, TextBox, ChatBubble } from "../../unit";
import { conversationDialogsAtom } from "../../../store/atoms";
import { useAtom } from "jotai";
import ChatHistoryIcon from "../../unit/chat-history-icon";

interface Message {
  text: string;
  sender: "user" | "apika";
}

const ChatModule: React.FC<{ sendTextMessage: (message: string) => void, onToggleChatHistory: () => void }> = ({ sendTextMessage, onToggleChatHistory }) => {
    const [messages] = useAtom(conversationDialogsAtom);
    const [input, setInput] = useState<string>("");

  const handleSendMessage = () => {
    if (input.trim()) {
      sendTextMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto rounded-lg shadow-xl relative animate-slide-from-right">
      <ChatHistoryIcon onClick={onToggleChatHistory} className="absolute top-2 right-4 text-blue-500 hover:text-gray-500" />
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <ChatBubble key={index} text={msg.content} sender={msg.speaker} />
        ))}
      </div>
      <div className="flex p-4 border-t border-gray-200">
        <TextBox input={input} setInput={setInput} onEnter={handleSendMessage} />
        <SendButton onClick={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatModule;