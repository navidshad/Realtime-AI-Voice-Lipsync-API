import React, {useState, useRef} from "react";

interface Position {
  x: number;
  y: number;
}

export const useDraggableButton = () => {

  const [position, setPosition] = useState<Position>({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const startPosRef = useRef<Position>({ x: 0, y: 0 });
  
  // Movement threshold in pixels - movements smaller than this won't count as "moved"
  const movementThreshold = 5;

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
    // Store the initial mouse position
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;
    
    // Save starting position for threshold calculation
    startPosRef.current = { x: e.clientX, y: e.clientY };

    setIsDragging(true);
    setHasMoved(false);

    // Handle mouse move
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Calculate total movement distance
      const deltaX = Math.abs(moveEvent.clientX - startPosRef.current.x);
      const deltaY = Math.abs(moveEvent.clientY - startPosRef.current.y);
      const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Only set hasMoved if movement exceeds threshold
      if (totalMovement > movementThreshold) {
        setHasMoved(true);
      }
      
      // Always update position regardless of threshold
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
    setHasMoved,
    setPosition
  }

}