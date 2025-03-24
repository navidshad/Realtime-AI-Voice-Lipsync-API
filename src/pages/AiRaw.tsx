import React, { useEffect, useRef, useState } from "react";
import { useLiveSessionManager } from "../ai-logic/useLiveSessionManager";

export const AiRaw: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const initializedRef = useRef(false);
  const [message, setMessage] = useState("");
  const {
    liveSession,
    sessionStarted,
    conversationDialogs,
    isMicrophoneMuted,
    createLiveSession,
    endLiveSession,
    triggerConversation,
    clearConversationDialogs,
    toggleMicrophone,
  } = useLiveSessionManager();

  useEffect(() => {
    // Initialize the live session when the component mounts
    const initSession = async () => {
      if (initializedRef.current) return;

      // Only set initialized after successful session creation
      initializedRef.current = true;

      try {
        await createLiveSession({
          sessionDetails: {
            instructions:
              "You are a helpful AI assistant. Help the user with their questions.",
            voice: "alloy",
            turnDetectionSilenceDuration: 1000,
          },
          tools: {}, // Add your tools here
          audioRef: audioRef.current,
        });
      } catch (error) {
        console.error("Failed to initialize session:", error);
      }
    };

    initSession();

    // Cleanup when component unmounts
    return () => {
      // Only end the session if we've actually initialized it
      if (initializedRef.current) {
        endLiveSession();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      triggerConversation(message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">AI Raw Chat</h1>

        {/* Audio element for AI responses */}
        <audio ref={audioRef} className="hidden" />

        {/* Conversation history */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[60vh] overflow-y-auto">
          {conversationDialogs.map((dialog, index) => (
            <div
              key={dialog.id}
              className={`mb-4 p-3 rounded-lg ${
                dialog.speaker === "ai"
                  ? "bg-blue-100 ml-4"
                  : "bg-gray-100 mr-4"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {dialog.speaker === "ai" ? "AI" : "You"}
              </p>
              <p>{dialog.content}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleMicrophone()}
            className={`px-4 py-2 rounded-lg ${
              isMicrophoneMuted
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {isMicrophoneMuted ? "Unmute" : "Mute"} Microphone
          </button>

          <button
            onClick={clearConversationDialogs}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Clear Chat
          </button>
        </div>

        {/* Message input */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg"
            disabled={!sessionStarted}
          />
          <button
            onClick={handleSendMessage}
            disabled={!sessionStarted || !message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
