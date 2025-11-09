import React from "react";
import { JotaiProvider } from "./providers/JotaiProvider";
import { AiCharacter } from "./pages/AiCharacter";

export function App() {
  return (
    <JotaiProvider>
      <AiCharacter />
    </JotaiProvider>
  );
}

export default App;
