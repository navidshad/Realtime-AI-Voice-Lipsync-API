import React, { useState, useRef, useEffect } from "react";
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
import {MainButton} from "./components/shared/MainButton";

export function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useApikaInitializer(setIsAssistantOpen);

  const [config] = useAtom(configurationAtom);
  const {devMode} = config;

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
                      <MainButton
                        isAssistantOpen={isAssistantOpen}
                        setIsAssistantOpen={setIsAssistantOpen}
                      />
                    )}
                    {isAssistantOpen && (
                      <div
                        className={twMerge(
                          "transition-opacity duration-300 pointer-events-auto",
                          "opacity-100"
                        )}
                      >
                        <Assistant
                          className="opacity-100"
                          onClose={() => setIsAssistantOpen(false)}
                        />
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
