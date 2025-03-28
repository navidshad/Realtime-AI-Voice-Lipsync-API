import { useAtom } from "jotai";
import React from "react";
import { conversationDialogsAtom } from "../../../store/atoms";
import { ConversationDialog } from "../../../ai-logic/types";
import { AudioVisualizer } from "../../unit";
import { SceneManager } from "../../../hooks/useSceneManager";
import { markdownToHtml } from "../../../utils/markdown-to-html";
import CourseList from "../../shared/CourseList";

const SceneModule: React.FC<{
  toggleMicrophone: () => void;
  isMicrophoneMuted: boolean;
  audioAnalyser: AnalyserNode | null;
  sceneManager: SceneManager;
}> = ({ toggleMicrophone, isMicrophoneMuted, audioAnalyser, sceneManager }) => {
  const [conversationDialogs] = useAtom(conversationDialogsAtom);
  const apikaMessage = conversationDialogs
    .slice()
    .reverse()
    .find((dialog) => dialog.speaker === "ai");

  const renderMessage = (message: ConversationDialog) => {
    return (
      <div className="w-full h-full space-y-4 flex flex-col justify-between">
        <div className="w-full flex-1">{sceneManager.renderScene()}</div>
        {sceneManager.activeScene === "none" && (
          <div className="flex justify-center items-center p-6 pb-0">
            <div className="rounded-2xl p-6 inline-block max-w-3xl">
              <div
                id="apika-text-area"
                className="text-lg text-gray-800 leading-relaxed animate-fade-in whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(message.content),
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="flex-1 overflow-auto p-6 mx-8">
        {apikaMessage && renderMessage(apikaMessage)}
      </div>
      <div className="flex justify-between items-center pb-3 mx-6">
        <div className="flex-1" /> {/* Spacer */}
        <div className="flex-1 flex justify-center">
          <AudioVisualizer
            analyser={audioAnalyser}
            isMicrophoneMuted={isMicrophoneMuted}
          />
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => toggleMicrophone()}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={
              isMicrophoneMuted ? "Unmute microphone" : "Mute microphone"
            }
          >
            {isMicrophoneMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
                <line
                  x1="3"
                  y1="3"
                  x2="21"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SceneModule;
