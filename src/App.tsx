import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "./components/shared/Button";
import { Assistant } from "./components/Assistant";
import { twMerge } from "tailwind-merge";
import { JotaiProvider } from "./providers/JotaiProvider";
import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AiRaw } from "./pages/AiRaw";
import { AiAssistant } from "./pages/AiAssistant";
import { AiFlow } from "./pages/AiFlow";
import { Config } from "./bootstrap/_init";
import { useAtom } from "jotai";
import { selectedFlowAtom } from "./store/atoms";
import { flows } from "./flows";

// Declare the global apika interface
declare global {
  interface Window {
    apika: {
      show: () => void;
      hide: () => void;
      init: (options: any) => void;
      open: ((config: Config) => void) | null;
    };
  }
}

// FlowSelector component
const FlowSelector: React.FC = () => {
  const [selectedFlow, setSelectedFlow] = useAtom(selectedFlowAtom);

  return (
    <select
      value={selectedFlow}
      onChange={(e) => setSelectedFlow(e.target.value)}
      className="p-2 border rounded-md"
    >
      {Object.keys(flows).map((flowKey) => (
        <option key={flowKey} value={flowKey}>
          {flowKey}
        </option>
      ))}
    </select>
  );
};

export function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  //Expose the open function to the global apika object
  const open = (config: Config) => {
    console.log("Opening APIKA with config:", config);
    setIsAssistantOpen(true);
  };

  const hide = () => {
    setIsAssistantOpen(false);
  };

  // Connect to the global apika object
  useEffect(() => {
    // Dispatch event with the setter function
    const event = new CustomEvent("APIKA_READY", {
      detail: { setIsAssistantOpen },
    });
    window.dispatchEvent(event);

    // Allow direct calls from parent window
    if (window.apika) {
      window.apika.open = open;
      window.apika.hide = hide;
    }
  }, []);

  return (
    <JotaiProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/ai-raw" element={<AiRaw />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/ai-flow" element={<AiFlow />} />
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
                        <Link to="/ai-flow" className=" hover:text-gray-700">
                          AI Flow
                        </Link>
                        <Link
                          to="/ai-assistant"
                          className=" hover:text-gray-700"
                        >
                          AI Assistant
                        </Link>
                      </div>
                      <div className="flex justify-center mt-4">
                        <FlowSelector />
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
                      {isAssistantOpen && (
                        <div
                          className={twMerge(
                            "transition-opacity duration-300",
                            "opacity-100"
                          )}
                        >
                          <Assistant className="opacity-100" />
                        </div>
                      )}
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
