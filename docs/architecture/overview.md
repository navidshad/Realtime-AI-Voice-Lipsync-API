# APIKA Architecture Overview

## System Architecture

APIKA is built with a client-server architecture optimized for real-time voice and text interactions. The system is designed to provide a seamless, responsive experience with a focus on voice-first interaction while supporting text as a secondary input method.

### High-Level Components

```
┌─────────────────────────┐            ┌────────────────────┐
│                         │            │                    │
│   Frontend Application  │◄───────────►    Backend Server  │
│   (React + TypeScript)  │            │    (Express.js)    │
│                         │            │                    │
└───────────┬─────────────┘            └─────────┬──────────┘
            │                                    │
            │                                    │
            ▼                                    ▼
┌───────────────────────┐            ┌────────────────────┐
│                       │            │                    │
│  User Interface       │            │  OpenAI API        │
│  - Voice Input/Output │            │  - Realtime API    │
│  - 3D Character       │            │  - TTS/STT         │
│  - Chat Interface     │            │  - Chat Completion │
│                       │            │                    │
└───────────────────────┘            └────────────────────┘
```

## Core Components

### Frontend Application

The frontend application is built with React 19 and TypeScript, providing a modern, responsive user interface. Key frontend components include:

1. **Main Application Shell**: Handles routing and overall application structure
2. **Assistant Component**: Modal dialog that contains the character and chat interface
3. **Scene Module**: Manages the 3D character and animation
4. **Chat Module**: Handles text-based interaction and chat history
5. **Voice Interface**: Manages voice input/output through the browser's WebRTC API

State management is handled through Jotai, providing a lightweight and efficient state solution across components.

### Backend Server

The backend server is built with Express.js and serves as a bridge between the frontend application and the OpenAI API. Key responsibilities include:

1. **API Gateway**: Routes requests to appropriate handlers
2. **Token Generation**: Securely generates ephemeral tokens for OpenAI Realtime API
3. **Lip Sync Processing**: Processes audio through Rhubarb Lip Sync to generate mouth shape data
4. **Audio Processing**: Handles audio format conversion using FFmpeg

### External Services

1. **OpenAI API**: Provides AI capabilities including:
   - GPT-4o-mini model for conversation
   - Whisper model for speech-to-text
   - TTS-1 model for text-to-speech
   - Realtime API for low-latency voice conversations

## Data Flow

1. User speaks or types input in the frontend application
2. If voice input:
   - Audio is captured via WebRTC
   - Processed by Whisper for transcription
   - Sent to GPT-4o-mini through the Realtime API
3. If text input:
   - Text is sent to the backend server
   - Processed by GPT-4o-mini
   - Response is generated
4. Response text is processed by TTS-1 to generate audio
5. Lip sync data is generated from the audio using Rhubarb
6. 3D character is animated according to the lip sync data
7. Audio is played while the character animation runs

## Design Principles

1. **Voice-First Interaction**: The system prioritizes voice interaction while maintaining full functionality via text.
2. **Low Latency**: The architecture is optimized for minimal response time to create a natural conversation feel.
3. **Modular Design**: Components are designed with clear responsibilities to facilitate maintenance and testing.
4. **Responsive UI**: The interface adapts to different screen sizes and device capabilities.
5. **Decoupled Frontend/Backend**: Clear separation between frontend and backend allows independent development and scaling.

## Technology Stack

- **Frontend**: React 19, TypeScript, TailwindCSS, Jotai, WebRTC
- **Backend**: Express.js, Node.js
- **AI Services**: OpenAI GPT-4o-mini, Whisper, TTS-1, Realtime API
- **Audio Processing**: FFmpeg, Rhubarb Lip Sync
- **Deployment**: Docker, GitLab CI/CD

## Security Considerations

1. **API Key Management**: OpenAI API keys are stored securely on the backend and never exposed to the client.
2. **Ephemeral Tokens**: Short-lived tokens are generated for client-side OpenAI Realtime API access.
3. **Data Sanitization**: All user inputs are sanitized before processing.
4. **Secure Communications**: All communication uses HTTPS/WSS to ensure data privacy.

## Scalability

The system is designed to scale horizontally with increased load:

1. **Stateless Backend**: The backend server is stateless, allowing multiple instances to run behind a load balancer.
2. **Client-Side Processing**: Where possible, processing is done on the client to reduce server load.
3. **Efficient State Management**: Jotai provides efficient state updates that minimize re-renders.
4. **Container-Based Deployment**: Docker containers allow easy scaling and deployment across environments. 