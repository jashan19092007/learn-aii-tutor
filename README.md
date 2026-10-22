# LearnFlow AI — Interactive AI Learning Assistant

**Watch. Pause. Ask. Understand. Continue.**

LearnFlow AI is an AI-powered interactive learning platform designed to transform passive video lectures into engaging learning experiences.

Students can watch educational YouTube videos, pause at any moment, ask questions, and receive explanations supported by lecture transcripts and timestamped citations.

The platform combines context-aware retrieval with Google Gemini to distinguish between information from the lecture and additional AI-generated explanations.

## Live Application

**Website:** https://learnflow-ai-one.vercel.app/

**GitHub Repository:** https://github.com/jashan19092007/learn-aii-tutor

## Problem Statement

Students often struggle to understand complex concepts while watching recorded lectures. They may repeatedly rewind videos, search for explanations on other platforms, or lose focus while switching between applications.

Traditional AI chatbots also lack awareness of a student's exact position within a lecture.

## Our Solution

LearnFlow AI provides an integrated learning workspace where students can watch videos and interact with an AI Tutor.

Its core learning flow is:

**Watch → Pause → Ask → Understand → Continue**

The AI receives timestamp-aware lecture context, helping students ask questions without relying on information from later portions of the video.

## Key Features

### 1. AI-Powered Lecture Tutor

- Interactive question-and-answer interface
- Google Gemini API integration
- Step-by-step explanations of concepts
- Follow-up questions using conversation context
- Quick actions for simplification, examples, summaries, comparisons, and quizzes

### 2. Knowledge Horizon

LearnFlow's Knowledge Horizon visualizes the boundary between available lecture context and future lecture content.

- Tracks the current playback timestamp
- Displays accessible transcript coverage
- Separates available and future captions
- Helps prevent the tutor from using unreached lecture content as lecture evidence

### 3. Context-Aware Explanations

The AI Tutor is designed to distinguish between three information sources:

**From the Lecture:** Explanations grounded in available video transcript evidence.

**From Your Materials:** Information from supported uploaded learning resources.

**Additional Explanation — Gemini AI:** General explanations, analogies, and examples that are not directly sourced from the lecture.

This separation is intended to improve transparency and reduce unsupported attribution.

### 4. Timestamped Citations

- Source references linked to lecture timestamps
- Clickable video citations
- Quick navigation to relevant lecture moments
- Citation validation against available evidence

### 5. Interactive Lecture Studio

- Embedded YouTube video player
- Play and pause controls
- Forward and backward seeking
- Real-time timestamp synchronization
- Lecture progress tracking

### 6. Context Intelligence Dashboard

- Automatic transcript retrieval where available
- Transcript import using supported timestamped formats
- Available-caption counter
- Future-caption counter
- Visual context coverage indicator

### 7. Learning Materials

- Learning resource upload interface
- Support for text and code content processing
- Document and resource management
- Additional file formats may require further processing before their contents can be used by the tutor

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript |
| Application Framework | TanStack Start |
| Styling | Tailwind CSS |
| UI Components | Radix UI, Lucide Icons |
| Build Tool | Vite |
| AI Integration | Google Gemini API |
| Transcript Retrieval | YouTubeTranscript.dev |
| Backend | TanStack Start server functions |
| Hosting | Vercel |
| Version Control | Git and GitHub |

## System Architecture

LearnFlow uses a frontend interface connected to server-side functions responsible for transcript retrieval and AI processing.

**Main workflow:**

1. The user submits a YouTube lecture URL.
2. The YouTube player loads the video.
3. The application retrieves available timestamped captions.
4. The current playback time defines the lecture-context boundary.
5. Relevant transcript segments and supported uploaded material are selected.
6. The student's question and contextual evidence are sent to the Gemini API through a server-side function.
7. The application displays the AI response and validated source citations.
8. Clicking a video citation seeks to the corresponding lecture timestamp.

See the [Architecture Diagram](docs/architecture.png) for the visual representation.

## Local Development

### Prerequisites

- Node.js and npm
- Gemini API credentials
- YouTubeTranscript.dev API credentials for automatic transcript retrieval

### Installation

```bash
git clone https://github.com/jashan19092007/learn-aii-tutor.git

cd learn-aii-tutor

npm install
```

### Environment Variables

Configure the following server-side environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key

YOUTUBE_TRANSCRIPT_DEV_API_KEY=your_transcript_api_key
```

Never commit actual API keys to the repository.

### Start Development Server

```bash
npm run dev
```

Open the local address displayed in your terminal.

## Deployment

LearnFlow AI is configured for deployment using Vercel.

Deployment requires:

1. Importing the GitHub repository into Vercel.
2. Selecting the TanStack Start application preset.
3. Configuring the required environment variables.
4. Deploying the application.
5. Verifying video playback, transcript retrieval, AI responses, and citations.

**Production URL:** https://learnflow-ai-one.vercel.app/

See [Deployment Instructions](DEPLOYMENT.md) for additional details.

## Project Documentation

- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Architecture Diagram](docs/architecture.png)
- [Sample Dataset](dataset/sample_transcript.json)
- [Testing and Evaluation Report](docs/TESTING_REPORT.md)

**Dataset note:** The provided sample transcript is illustrative and should not be interpreted as a transcript extracted from an actual lecture.

## Testing and Limitations

The project includes interfaces and backend functions for interactive video learning, timestamp-aware retrieval, and AI-assisted explanations.

Important considerations:

- Automatic transcript retrieval depends on caption availability, external API access, and available quota.
- Gemini responses depend on API configuration and model availability.
- AI-generated information may contain errors and should be checked against cited sources.
- Some uploaded document formats require additional processing.
- Prompt-based separation of lecture evidence and external explanations does not guarantee perfect factual attribution.

The testing report documents evaluation status and any remaining verification work. Live deployment functionality should be tested separately before submission.

## What Makes LearnFlow Different?

LearnFlow focuses on **learning at the student's current point in a lecture**.

Rather than treating a complete lecture as unrestricted context, LearnFlow uses the current playback position to select available transcript evidence.

The Knowledge Horizon makes that boundary visible, while Gemini can offer supplementary explanations that are explicitly separated from lecture-derived information.

Together, these features aim to create a more transparent and interactive learning experience.

## Future Scope

- AI-powered mock interview extension
- Speech-to-text fallback for lectures without captions
- Improved document extraction and processing
- Personalized learning analytics
- Topic-level weakness identification
- Adaptive revision and quiz generation
- Student learning progress dashboard

## Project Information

**Project:** LearnFlow AI

**Hackathon:** AHGV BuildVerse 2026

**Problem Statement:** PS-1 — AI-Powered Interactive Learning Assistant with AI Mock Interview Extension

**Source Code:** https://github.com/jashan19092007/learn-aii-tutor

**Live Application:** https://learnflow-ai-one.vercel.app/

---

*LearnFlow AI — Transforming passive lectures into interactive learning experiences.*
