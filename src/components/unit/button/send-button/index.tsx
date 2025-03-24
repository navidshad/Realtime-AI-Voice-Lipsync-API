import React from "react";
import { SendHorizonal } from "lucide-react";

interface SendButtonProps {
  onClick: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-3 rounded-r-md flex items-center justify-center hover:bg-blue-600"
    >
      <SendHorizonal className="h-4 w-4" />
    </button>
  );
};

export default SendButton;