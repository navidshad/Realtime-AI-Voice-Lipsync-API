import React, {useState} from "react";

export const useDraggableButton = () => {

  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Store the initial mouse position
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    setIsDragging(true);
    setHasMoved(false);

    // Handle mouse move
    const handleMouseMove = (moveEvent: MouseEvent) => {
      setHasMoved(true);
      setPosition({
        x: moveEvent.clientX - offsetX,
        y: moveEvent.clientY - offsetY
      });
    };

    // Handle mouse up
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    position,
    isDragging,
    hasMoved,
    handleMouseDown,
    setHasMoved
  }

}