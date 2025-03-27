import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import ChatModule from "./modules/chat";
import ApikaModule from "./modules/apika";
import { useApika } from "../hooks/useApika";
import ChatHistoryIcon from "./unit/chat-history-icon";

export const Assistant = ({ className = "", isReady = false }) => {
  const {
    sendTextMessage,
    toggleMicrophone,
    isMicrophoneMuted,
    audioRef,
    audioAnalyser,
    sceneManager
  } = useApika();
  const [showChatHistory, setShowChatHistory] = useState(false);

  return (
    <div
      id="apika-assistant"
      className={twMerge(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300",
        className
      )}
    >
      <div className="relative w-[95%] h-[90%] rounded-lg p-6 m-4 transform transition-all duration-300 ease-in-out animate-popup flex shadow-2xl bg-white">
        <div className="flex-1 h-full">
          <ApikaModule
            toggleMicrophone={toggleMicrophone}
            isMicrophoneMuted={isMicrophoneMuted}
            audioAnalyser={audioAnalyser}
            sceneManager={sceneManager}
          />
        </div>
        {!showChatHistory && (
          <ChatHistoryIcon
            onClick={() => setShowChatHistory(!showChatHistory)}
          />
        )}
        {showChatHistory && (
          <ChatModule
            sendTextMessage={sendTextMessage}
            onToggleChatHistory={() => setShowChatHistory(!showChatHistory)}
          />
        )}
      </div>
      <audio ref={audioRef} />
    </div>
  );
};
