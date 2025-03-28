# APIKA - AI-Powered Virtual Course Consultant

APIKA is an interactive conversational AI assistant designed to streamline the course discovery process for KodeKloud applications. This assistant provides real-time, voice- and text-based consultations to guide users toward the most relevant DevOps courses and learning paths through a dynamic and personalized interface.

## Features

- **Voice-First Interaction**: Primary focus on voice input/output with text as a secondary option
- **AI-Powered Recommendations**: Personalized course suggestions based on user goals and experience
- **Interactive UI**: Animated agent with dynamic content display
- **Hybrid Chat Experience**: Seamless switching between voice and text input
- **Session Persistence**: Maintains conversation history for continuity

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Backend**: Express.js
- **AI**: OpenAI GPT-4o-mini with realtime voice API
- **Animation**: WebGL/WebRTC for fluid character animations

## Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- Yarn package manager
- FFmpeg (for audio processing)
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/apika-ai-assistant.git
   cd apika-ai-assistant
   ```

2. Install dependencies:
   ```bash
   yarn install
   yarn be:install
   ```

3. Set up environment variables:
   ```bash
   cp .env-template .env
   ```
   Then edit `.env` to add your OpenAI API key.

### Development

Run the development server:
```bash
yarn dev
```

This will start both the frontend and backend servers concurrently:
- Frontend: [http://localhost:10001](http://localhost:10001)
- Backend: [http://localhost:8080](http://localhost:8080)

### Production Build

Build for production:
```bash
yarn prod
```

Start production server:
```bash
yarn serve
```

### Docker Deployment

```bash
# Development mode
yarn docker:local:build
yarn docker:local:up

# Production mode
yarn docker:prod:build
yarn docker:prod:up
```

## Documentation

Full documentation is available in the `/docs` directory:

- [Features Specification](/docs/features/README.md)
- [System Architecture](/docs/architecture/README.md)
- [API Design](/docs/api/README.md)
- [Frontend Architecture](/docs/frontend/README.md)
- [Development Guidelines](/docs/development/README.md)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Acknowledgments

- KodeKloud Learning Platform
- OpenAI for voice and AI capabilities 