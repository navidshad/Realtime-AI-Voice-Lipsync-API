import React from "react";
import { useState } from "react";
import { Button } from "./components/shared/Button";
import { Assistant } from "./components/Assistant";
import { twMerge } from "tailwind-merge";
import { JotaiProvider } from "./providers/JotaiProvider";
import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AiRaw } from "./pages/AiRaw";
import { AiAssistant } from "./pages/AiAssistant";

export function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <JotaiProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/ai-raw" element={<AiRaw />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route
              path="/"
              element={
                <>
                  <div className="flex flex-col items-center justify-center min-h-screen">
                    <nav className="w-full p-4">
                      <div className="container mx-auto flex justify-center space-x-4">
                        <Link to="/ai-raw" className=" hover:text-gray-700">
                          AI Raw
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
                        className="mt-4"
                        onClick={() => setIsAssistantOpen(true)}
                      >
                        Start Assistant
                      </Button>
                      <Assistant
                        className={twMerge(
                          isAssistantOpen
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        )}
                      />
                    </header>
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
