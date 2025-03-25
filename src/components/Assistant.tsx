import React, { useRef, useState } from 'react';
import {twMerge} from "tailwind-merge";
import ChatModule from './modules/chat';
import ApikaModule from './modules/apika';
import { conversationDialogsAtom } from '../store/atoms';
import { useAtom } from 'jotai';
import { useApika } from '../hooks/useApika';

export const Assistant = ({className = ''}) => {

  const {
    sendTextMessage,
    clearConversationDialogs,
    toggleMicrophone,
    isMicrophoneMuted,
  } = useApika();

  const [showChatHistory, setShowChatHistory] = useState(true);

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
          <ApikaModule />
        </div>
         {showChatHistory && <ChatModule sendTextMessage={sendTextMessage} />}
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