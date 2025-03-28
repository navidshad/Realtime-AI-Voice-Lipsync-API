import React, { useState, useRef, MouseEvent } from "react";
import { twMerge } from "tailwind-merge";
import ChatModule from "./modules/chat";
import SceneModule from "./modules/scene";
import { useApika } from "../hooks/useApika";
import ChatHistoryIcon from "./unit/chat-history-icon";

interface AssistantProps {
  className?: string;
  isReady?: boolean;
  onClose: () => void;
}

export const Assistant = ({ className = "", isReady = false, onClose }: AssistantProps) => {
  const {
    sendTextMessage,
    toggleMicrophone,
    isMicrophoneMuted,
    audioRef,
    audioAnalyser,
    sceneManager
  } = useApika();
  const [showChatHistory, setShowChatHistory] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close only if clicking on the overlay and not the content
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      id="apika-assistant"
      className={twMerge(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300",
        className
      )}
      onClick={handleOutsideClick}
    >
      <div 
        ref={contentRef}
        className="relative w-[95%] h-[90%] rounded-lg p-6 m-4 transform transition-all duration-300 ease-in-out animate-popup flex"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 255, 0.35) 80%, rgba(224, 242, 254, 0.8) 100%)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 10px 30px rgba(29, 78, 216, 0.15), 0 0 20px rgba(37, 99, 235, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.15)',
          borderRadius: '16px'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-0 cursor-pointer rounded-full hover:bg-gray-200/30 transition-colors duration-200 z-10"
          style={{
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 22 22" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 h-full mt-8">
          <SceneModule
            toggleMicrophone={toggleMicrophone}
            isMicrophoneMuted={isMicrophoneMuted}
            audioAnalyser={audioAnalyser}
            sceneManager={sceneManager}
          />
        </div>
        {!showChatHistory && (
          <ChatHistoryIcon
            onClick={() => setShowChatHistory(!showChatHistory)}
            className="absolute top-2 right-14"
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
