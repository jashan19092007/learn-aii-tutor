# LearnFlow AI — Interactive AI Learning Assistant

LearnFlow AI is a interactive learning platform that helps students understand educational YouTube lectures through timestamp-aware transcripts and an AI-assisted learning interface.

## Live Application

**Website:** https://learn-aii-tutor.lovable.app/

**GitHub Repository:** https://github.com/jashan19092007/learn-aii-tutor

## Key Features

- Embedded YouTube lecture player
- Timestamped transcript retrieval
- AI Tutor interface for lecture-related questions
- Transcript-aware learning experience
- Quick actions for explanations, summaries, and quizzes
- Lecture resources and notes interface

## Technology Stack

- Frontend: React, TypeScript, Tailwind CSS
- Development and hosting: Lovable
- Transcript API: YouTubeTranscript.dev
- Backend: Server-side functions
- AI: Gemini integration under verification

## How It Works

1. Open LearnFlow AI.
2. Enter an educational YouTube video URL.
3. Watch the lecture and retrieve its transcript.
4. Pause at a specific timestamp.
5. Ask questions through the AI Tutor interface.
6. Review explanations using the available lecture context.

AI Tutor responses require a working AI provider configuration. The Gemini integration is currently being verified.

## Local Setup

```bash
git clone https://github.com/jashan19092007/learn-aii-tutor.git
cd learn-aii-tutor
npm install
npm run dev
```

Backend functionality requires separately configured API credentials.

## Documentation

- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Architecture Diagram](docs/architecture.png)
- [Sample Dataset](dataset/sample_transcript.json)
- [Testing Report](docs/TESTING_REPORT.md)

The sample transcript is illustrative and is not presented as a genuine extracted transcript.

## Project Status

LearnFlow AI is a working web prototype with video and transcript features. AI Tutor integration requires further verification following an AI provider migration.

## Project links

**Project:** LearnFlow AI

**Live Demo:** https://learn-aii-tutor.lovable.app/

**Source Code:** https://github.com/jashan19092007/learn-aii-tutor
