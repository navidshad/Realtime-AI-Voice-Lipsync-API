import React from 'react';
import {useState} from "react";
import {Button} from './components/shared/Button';
import {Assistant} from "./components/Assistant";
import {twMerge} from "tailwind-merge";

export function App() {
  const [
    isAssistantOpen,
    setIsAssistantOpen
  ] = useState(false);
  return (
    <div className="app flex flex-col items-center justify-center h-screen">
      <header className="app-header flex flex-col items-center justify-center">
        <h1 className={"text-blue-500"}>Welcome to AI Virtual Assistant Demo!</h1>
        <p>Click on the button to start APIKA!</p>
        <Button className="mt-4" onClick={() => setIsAssistantOpen(true)}>Start Assistant</Button>
        <Assistant className={twMerge(
          isAssistantOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )} />
      </header>
    </div>
  );
} 