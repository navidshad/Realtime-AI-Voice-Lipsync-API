import { useAtom } from "jotai";
import React, { useState } from "react";
import { conversationDialogsAtom } from "../../../store/atoms";
import { ConversationDialog } from "../../../ai-logic/types";

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
    const [conversationDialogs] = useAtom(conversationDialogsAtom);
    const apikaMessage = conversationDialogs
    .slice()
    .reverse()
    .find((dialog) => dialog.speaker === "ai");

  const renderMessage = (message: ConversationDialog) => {
    return (
      <div className="w-full space-y-4">
        <div className="p-6">
          <p className="text-lg text-gray-800 text-center">{message.content}</p>
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
    <div className="h-full w-full overflow-auto p-6">
      {apikaMessage && renderMessage(apikaMessage)}
    </div>
  );
};

export default ApikaModule;
