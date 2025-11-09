# User Interaction Features

## Overview

APIKA provides a highly interactive experience through a combination of voice and text-based interactions. The core design principle is "voice-first", with text serving as a complementary input method. This document outlines the interaction capabilities and user experience design.

## Voice Interaction

### Voice Input

APIKA captures and processes voice input through the browser's WebRTC API:

1. **Microphone Access**: Users grant microphone access when initiating a conversation
2. **Real-time Audio Capture**: Audio is streamed in real-time to the backend
3. **Voice Activation**: Users can toggle voice input on/off with a microphone button
4. **Audio Visualization**: Visual feedback shows when the assistant is listening
5. **Background Noise Handling**: System filters out background noise for clearer recognition

### Voice Output

The assistant responds through natural-sounding speech:

1. **Text-to-Speech**: Generated using OpenAI's TTS-1 model with the "alloy" voice
2. **Lip Sync**: Speech is synchronized with the 3D character's mouth movements
3. **Prosody and Intonation**: Natural speech patterns with appropriate emphasis and pauses
4. **Expressive Voice**: Voice conveys emotion and engagement through tone variations
5. **Playback Controls**: Users can replay or pause spoken responses

## Text Interaction

Though secondary to voice, text interaction provides important functionality:

1. **Chat Interface**: Standard chat UI with message history
2. **Text Input**: Users can type messages when voice input is not preferred
3. **Message Persistence**: Text history is maintained throughout the session
4. **Rich Text Support**: Formatting for course names, links, and emphasis
5. **Copy Functionality**: Users can copy text responses for reference

## Hybrid Interaction Model

The system supports seamless switching between voice and text:

1. **Mode Switching**: Users can change input method at any time
2. **Concurrent Display**: Voice responses are also displayed as text
3. **Interaction History**: Both voice and text interactions appear in the chat history
4. **Contextual Continuity**: Context is maintained when switching between modes

## 3D Character Animation

The virtual assistant is represented by an animated 3D character:

1. **Lip Synchronization**: Character's mouth movements match spoken words
2. **Facial Expressions**: Character displays appropriate emotions during conversation
3. **Idle Animations**: Subtle movements when not actively speaking
4. **Reaction Animations**: Visual responses to user input (nodding, smiling, etc.)
5. **Attention Focus**: Character appears to look at the user or relevant content

## Rich Media Integration

Beyond voice and text, the system supports rich media content:

1. **Course Cards**: Visual representations of course recommendations
2. **Comparison Tables**: Side-by-side course feature comparisons
3. **Learning Path Visualization**: Graphics showing suggested learning progression
4. **Embedded Video Previews**: Short course preview videos when relevant
5. **Interactive Elements**: Clickable options for navigating recommendations

## Accessibility Considerations

The system is designed to be accessible to users with various needs:

1. **Voice and Text Alternatives**: Full functionality through either input method
2. **Subtitles/Captions**: Text display of all spoken content
3. **High Contrast Mode**: Visual design accommodates vision impairments
4. **Keyboard Navigation**: Complete keyboard control for non-mouse users
5. **Screen Reader Compatibility**: Proper ARIA labels and semantic HTML

## User Experience Flow

### Initial Interaction

1. User clicks the APIKA assistant button
2. Assistant appears with a friendly greeting
3. System requests microphone permission if voice input is enabled
4. Brief introduction explains the assistant's capabilities

### Conversation Flow

1. User asks questions about courses through voice or text
2. Assistant processes input and generates personalized responses
3. Responses include relevant course recommendations with rationale
4. User can ask follow-up questions or request more details
5. Assistant maintains context throughout the conversation

### Session Conclusion

1. User indicates they have completed their consultation
2. Assistant provides a summary of key recommendations
3. System offers to generate a personalized learning plan
4. User receives option to save or share their consultation results
5. Assistant provides friendly closing and minimizes

## Technical Implementation

### Voice Processing Pipeline

```
User Speech → WebRTC → OpenAI Whisper → GPT-4o-mini → Text Response → TTS-1 → Lip Sync → Audio Playback
```

### Lip Sync Process

```
Text → TTS-1 → WAV File → FFmpeg → OGG File → Rhubarb Lip Sync → Viseme Data → 3D Character Animation
```

## Personalization Features

1. **Learning Path Memory**: System remembers user's interests across sessions
2. **Preference Adaption**: Assistant adjusts recommendations based on user reactions
3. **Interaction Style**: Adapts to user's preferred conversation style (formal/casual)
4. **Technical Level**: Adjusts language complexity based on user expertise
5. **Pacing**: Matches the user's conversational pace

## Future Enhancements

1. **Voice Recognition Training**: Improved recognition of technical terms
2. **Multiple Character Options**: Different assistant personalities/appearances
3. **Multilingual Support**: Conversations in multiple languages
4. **AR Integration**: Augmented reality assistant experience
5. **Offline Mode**: Basic functionality without internet connection 