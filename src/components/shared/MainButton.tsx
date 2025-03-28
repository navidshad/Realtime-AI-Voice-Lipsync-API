import {Button} from "./Button";
import React, {useEffect} from "react";
import {useDraggableButton} from "../../hooks/useDraggableButton";

export const MainButton = ({
                             isAssistantOpen,
                             setIsAssistantOpen,
}: {
  isAssistantOpen: boolean;
  setIsAssistantOpen: (isOpen: boolean) => void;
}) => {

  const {
    position,
    isDragging,
    hasMoved,
    handleMouseDown,
    setHasMoved,
    setPosition
  } = useDraggableButton()

  // Initialize and persist button position
  useEffect(() => {
    // Load saved position from localStorage or set default bottom-left
    const savedPosition = localStorage.getItem('apikaButtonPosition');
    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition);
        setPosition(parsedPosition);
      } catch (e) {
        setDefaultPosition();
      }
    } else {
      setDefaultPosition();
    }

    // Clear persistence on window resize without updating button position
    const handleResize = () => {
      localStorage.removeItem('apikaButtonPosition');
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setPosition]);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (hasMoved) {
      localStorage.setItem('apikaButtonPosition', JSON.stringify(position));
    }
  }, [position, hasMoved]);

  // Helper to set default bottom-left position
  const setDefaultPosition = () => {
    const padding = 20;
    setPosition({
      x: padding,
      y: window.innerHeight - padding - 60 // Account for button height
    });
  };

  return (
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
        className={`flex items-center justify-center w-12 h-12 text-white rounded-full cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl ${!isAssistantOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.8) 0%, rgba(29, 78, 216, 0.7) 70%)',
          backdropFilter: 'blur(2px)',
          boxShadow: '0 4px 12px rgba(29, 78, 216, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'radial-gradient(circle, rgba(37, 99, 235, 0.6) 0%, rgba(29, 78, 216, 0.5) 70%)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(29, 78, 216, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'radial-gradient(circle, rgba(37, 99, 235, 0.8) 0%, rgba(29, 78, 216, 0.7) 70%)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 78, 216, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
        }}
        onClick={(e) => {
          if (!hasMoved) {
            setIsAssistantOpen(true);
          }
          setHasMoved(false);
        }}
        title="Start Apika Assistant"
      >
        <div className="flex items-center">
          <span className="font-bold text-lg mr-1">A</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      </Button>
    </div>
  )
}