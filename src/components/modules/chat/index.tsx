import React, { useState } from "react";
import { SendButton, TextBox, ChatBubble } from "../../unit";
import { conversationDialogsAtom } from "../../../store/atoms";
import { useAtom } from "jotai";

interface Message {
  text: string;
  sender: "user" | "apika";
}

const ChatModule: React.FC<{ sendTextMessage: (message: string) => void }> = ({ sendTextMessage }) => {
    const [messages] = useAtom(conversationDialogsAtom);
    const [input, setInput] = useState<string>("");

  const handleSendMessage = () => {
    if (input.trim()) {
      sendTextMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto rounded-lg shadow-xl">
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