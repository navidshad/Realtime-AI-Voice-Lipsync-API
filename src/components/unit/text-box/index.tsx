import React, { useRef, useEffect } from "react";

interface TextBoxProps {
  input: string;
  setInput: (value: string) => void;
  onEnter: () => void;
}

const TextBox: React.FC<TextBoxProps> = ({ input, setInput, onEnter }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to properly calculate new height
      textareaRef.current.style.height = 'auto';
      // Set new height based on scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className="flex-1 border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
      placeholder="Type a message..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      rows={1}
    />
  );
};

export default TextBox;
