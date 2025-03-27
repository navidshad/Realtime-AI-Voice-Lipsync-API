import React, { useState, useRef } from "react";
import {Button} from "./components/shared/Button";
import {Assistant} from "./components/Assistant";
import {twMerge} from "tailwind-merge";
import {JotaiProvider} from "./providers/JotaiProvider";
import {MemoryRouter as Router, Routes, Route, Link} from "react-router-dom";
import {AiRaw} from "./pages/AiRaw";
import {AiAssistant} from "./pages/AiAssistant";
import {AiAssistantFlow01} from "./pages/AiAssistanFlow01";
import {useApikaInitializer} from "./hooks/useApikaInitializer";
import {useAtom} from "jotai";
import {configurationAtom} from "./store/atoms";
import {useDraggableButton} from "./hooks/useDraggableButton";

export function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  
  useApikaInitializer(setIsAssistantOpen);

  const [config] = useAtom(configurationAtom);
  const {devMode} = config;
  const {
    position,
    isDragging,
    hasMoved,
    handleMouseDown,
    setHasMoved
  } = useDraggableButton()

  return (
    <JotaiProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/ai-raw" element={<AiRaw/>}/>
            <Route path="/ai-assistant" element={<AiAssistant/>}/>
            <Route
              path="/ai-assistant-flow01"
              element={<AiAssistantFlow01/>}
            />
            <Route
              path="/"
              element={
                <>
                  <div className="flex flex-col items-center justify-center min-h-screen">
                    {devMode ? (
                      <div
                        className="max-w-[500px] min-h-fit border border-gray-300 rounded-lg shadow-sm p-6 bg-white pointer-events-auto">
                        <nav className="w-full p-4">
                          <div className="container mx-auto flex justify-center space-x-4">
                            <Link to="/ai-raw" className=" hover:text-gray-700">
                              AI Raw
                            </Link>
                            <Link
                              to="/ai-assistant-flow01"
                              className=" hover:text-gray-700"
                            >
                              AI Assistant Flow 01
                            </Link>
                            <Link
                              to="/ai-assistant"
                              className=" hover:text-gray-700"
                            >
                              AI Assistant
                            </Link>
                          </div>
                        </nav>
                        <header className="app-header flex flex-col items-center justify-center">
                          <h1 className={"text-blue-500"}>
                            Welcome to AI Virtual Assistant Demo!
                          </h1>
                          <p>Click on the button to start APIKA!</p>
                          <Button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4`}
                            onClick={() => setIsAssistantOpen(true)}
                          >
                            Start Assistant
                          </Button>
                        </header>
                      </div>
                    ):(
                      <div
                        className="fixed pointer-events-auto z-50"
                        style={{ 
                          left: `${position.x}px`, 
                          top: `${position.y}px`,
                          cursor: isDragging ? 'grabbing' : 'pointer'
                        }}
                        onMouseDown={handleMouseDown}
                      >
                        <Button
                          className={`flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:shadow-xl ${!isAssistantOpen ? 'opacity-100' : 'opacity-0'}`}
                          onClick={(e) => {
                            if (!hasMoved) {
                              setIsAssistantOpen(true);
                            }
                            setHasMoved(false);
                          }}
                          title="Start Apika Assistant (Drag to move)"
                        >
                          <div className="flex items-center">
                            <span className="font-bold text-lg mr-1">A</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                        </Button>
                      </div>
                    )}
                    {isAssistantOpen && (
                      <div
                        className={twMerge(
                          "transition-opacity duration-300",
                          "opacity-100"
                        )}
                      >
                        <Assistant className="opacity-100"/>
                      </div>
                    )}
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </JotaiProvider>
  );
}

export default App;
