import React, { useEffect, useRef, useState } from "react";
import { useLiveSessionManager } from "../ai-logic/useLiveSessionManager";
import { useAtom } from "jotai";
import { conversationDialogsAtom } from "../store/atoms";
import { useFlowManager } from "../ai-logic/useFlowManagr";

export const AiAssistantFlow01: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    initializeFlow,
    endLiveSession,
    sendTextMessage,
    toggleMicrophone,
    isMicrophoneMuted,
    sessionStarted,
  } = useFlowManager({
    steps: [
      {
        label: "Step 1",
        instructions:
          "Help the user to select a city from all the cities in the world.",
        tools: {},
      },
      {
        label: "Step 2",
        instructions: "now let's talk about the selected city",
        tools: {},
      },
      {
        label: "Step 3",
        instructions: "Finish the conversation, and say goodbye",
        tools: {
          finishConversation: {
            definition: {
              type: "function",
              name: "finishConversation",
              description: "Finish the conversation, and say goodbye",
            },
            handler: () => {
              alert("Conversation finished");
              return { success: true, message: "Conversation finished" };
            },
          },
        },
      },
    ],
  });

  const [conversationDialogs] = useAtom(conversationDialogsAtom);
  const [showChatbox, setShowChatbox] = useState(false);
  const [message, setMessage] = useState("");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeFlow({ audioRef: audioRef.current, onUpdate });
    }
    return () => {
      if (initializedRef.current) {
        endLiveSession();
      }
    };
  }, []);

  const onUpdate = (eventData: any) => {
    console.log("onUpdate", eventData);
  };

  const handleChatboxToggle = () => {
    setShowChatbox((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (message.trim() && sessionStarted) {
      sendTextMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get the last AI dialog
  const lastAiDialog = conversationDialogs
    .slice()
    .reverse()
    .find((dialog) => dialog.speaker === "ai");

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          width: showChatbox ? "calc(100% - 350px)" : "100%",
          transition: "width 0.3s ease",
        }}
      >
        {/* Presentation Section */}
        {lastAiDialog && (
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: "#fff",
              maxWidth: "80%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              fontSize: "18px",
              lineHeight: "1.6",
            }}
          >
            {lastAiDialog.content}
          </div>
        )}
      </div>

      {/* Action Buttons Section */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          width: showChatbox ? "calc(100% - 350px)" : "100%",
          transition: "width 0.3s ease",
        }}
      >
        <button
          onClick={() => toggleMicrophone()}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "20px",
            backgroundColor: isMicrophoneMuted ? "#ff4444" : "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isMicrophoneMuted ? "Unmute" : "Mute"} Mic
        </button>

        <button
          onClick={handleChatboxToggle}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "20px",
            backgroundColor: "#2196F3",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {showChatbox ? "Hide History" : "Show History"}
        </button>
      </div>

      {/* Chatbox */}
      {showChatbox && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "350px",
            height: "100vh",
            backgroundColor: "#fff",
            borderLeft: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Chat History</h3>
            <button
              onClick={handleChatboxToggle}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              ×
            </button>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {conversationDialogs.map((dialog) => (
              <div
                key={dialog.id}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor:
                    dialog.speaker === "user" ? "#e3f2fd" : "#f5f5f5",
                  maxWidth: "80%",
                  alignSelf:
                    dialog.speaker === "user" ? "flex-end" : "flex-start",
                }}
              >
                {dialog.content}
              </div>
            ))}
          </div>
          {/* Chat Input Section */}
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-end",
              }}
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={!sessionStarted}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  resize: "none",
                  minHeight: "40px",
                  maxHeight: "120px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!sessionStarted || !message.trim()}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor:
                    sessionStarted && message.trim() ? "#2196F3" : "#ccc",
                  color: "white",
                  cursor:
                    sessionStarted && message.trim()
                      ? "pointer"
                      : "not-allowed",
                  fontSize: "14px",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} />
    </div>
  );
};
