import { useAtom } from "jotai";
import React, { useState } from "react";
import { conversationDialogsAtom } from "../../../store/atoms";
import { ConversationDialog } from "../../../ai-logic/types";
import { AudioVisualizer } from "../../unit";

interface ApikaCard {
    type: "card";
    title: string;
    description: string;
}

interface ApikaMessage {
    message: string;
    content: ApikaCard[];
}

const ApikaModule: React.FC<{
  toggleMicrophone: () => void;
  isMicrophoneMuted: boolean;
  audioAnalyser: AnalyserNode | null;
}> = ({ toggleMicrophone, isMicrophoneMuted, audioAnalyser }) => {
  const [conversationDialogs] = useAtom(conversationDialogsAtom);
  const apikaMessage = conversationDialogs
    .slice()
    .reverse()
    .find((dialog) => dialog.speaker === "ai");

  const renderMessage = (message: ConversationDialog) => {
    return (
      <div className="w-full space-y-4">
        <div className="p-6">
          <p className="text-lg text-gray-800 text-center animate-fade-in mx-10 whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        {/* 
        TODO: This is for card content, that we will figure out later
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
        </div> */}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="flex-1 overflow-auto p-6 mx-8 mb-12">
        {apikaMessage && renderMessage(apikaMessage)}
      </div>
      <div className="flex justify-end pb-3 mx-6">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <AudioVisualizer
            analyser={audioAnalyser}
            isMicrophoneMuted={isMicrophoneMuted}
          />
        </div>
        <button
          onClick={() => toggleMicrophone()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label={isMicrophoneMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMicrophoneMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
              <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ApikaModule;
