# APIKA Frontend Architecture

## Overview

The APIKA frontend is a modern React application built with TypeScript, focusing on a responsive and interactive UI for the AI-Powered Interactive KodeKloud Assistant (APIKA). The architecture follows component-based design principles with a clear separation of concerns, allowing for modularity and maintainability.

## Directory Structure

```
src/
├── ai-logic/         # AI-related logic and utilities
├── bootstrap/        # Application initialization code
├── character/        # 3D character models and animations
├── components/       # Reusable UI components
│   ├── modules/      # Complex component modules (chat, scene)
│   ├── shared/       # Shared components like buttons
│   └── unit/         # Smaller UI units
├── events/           # Event handling and custom event definitions
├── flows/            # Conversation flow definitions
├── hooks/            # Custom React hooks
├── integrations/     # Integration with external systems
├── pages/            # Page-level components
├── providers/        # React context providers
├── store/            # State management with Jotai
└── types/            # TypeScript type definitions
```

## Key Components

### Application Shell (App.tsx)

The App component serves as the main entry point for the application. It:
- Sets up routing with React Router
- Manages the main application state
- Renders the appropriate view based on the current route
- Controls when the Assistant modal is displayed

### Assistant Component

The Assistant component is the main interactive interface, displayed as a modal overlay. It consists of:
- SceneModule: Manages the 3D character visualization
- ChatModule: Handles text-based interaction and chat history
- Voice control buttons for toggling microphone input

### Scene Module

Responsible for rendering and animating the 3D character:
- Uses WebGL for 3D rendering
- Handles lip sync animation based on audio processing
- Controls character expressions and movements
- Visualizes audio input levels

### Chat Module

Manages the text-based conversation interface:
- Displays conversation history
- Provides text input for typing messages
- Shows dynamic content like course cards and recommendations

## State Management

APIKA uses Jotai for state management, offering a lightweight and performant solution:

### Main State Atoms

```typescript
// Core application state
export const configurationAtom = atom({
  devMode: process.env.NODE_ENV === 'development',
  // Other global configuration
});

// Flow management
export const selectedFlowAtom = atom<string>('default');

// Assistant state
export const assistantStateAtom = atom({
  isListening: false,
  isSpeaking: false,
  // Other assistant state
});

// Conversation state
export const conversationHistoryAtom = atom<Message[]>([]);
```

## Custom Hooks

The application includes several custom hooks that encapsulate complex functionality:

### useApika

The main hook that provides AI assistant functionality:
- Manages voice input/output
- Handles message sending
- Controls the microphone state
- Interacts with the OpenAI Realtime API

### useApikaInitializer

Handles initializing the APIKA assistant:
- Sets up listeners for external events
- Prepares the assistant state
- Configures audio processing

## Routing

The application uses React Router for navigation between different views:

- `/` - Main landing page with the assistant button
- `/ai-raw` - Development view for raw AI interaction testing
- `/ai-assistant` - Full assistant view
- `/ai-flow` - Structured conversation flow testing
- `/ai-character` - Character animation testing

## Voice Interface

The voice interface is implemented using WebRTC:

1. **Audio Capture**: Uses the browser's MediaRecorder API to capture audio from the user's microphone
2. **Real-time Processing**: Processes audio streams in real-time
3. **Integration with OpenAI**: Connects to OpenAI's Realtime API for voice processing

## Styling

APIKA uses a combination of:

- **TailwindCSS**: For utility-based styling and responsive design
- **Custom CSS**: For advanced animations and effects
- **twMerge**: For handling class conflicts and composition

## Performance Considerations

1. **Lazy Loading**: Components are loaded only when needed
2. **Efficient Rendering**: Using React's memoization to prevent unnecessary re-renders
3. **Asset Optimization**: 3D models and media are optimized for web delivery

## Browser Compatibility

APIKA is optimized for modern browsers with support for:
- WebRTC for audio capture
- WebGL for 3D rendering
- Modern JavaScript features (ES2020+)

## Testing Strategy

The frontend includes Jest for testing:
- Component tests with React Testing Library
- Unit tests for utility functions
- Mock implementations for external dependencies

## Build System

APIKA uses Rollup for bundling:
- TypeScript compilation
- CSS processing with PostCSS
- Asset bundling and optimization
- Environment variable configuration 