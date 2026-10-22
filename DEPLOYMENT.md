# LearnFlow AI | Deployment Guide

> Technical deployment, environment configuration, and verification guide for LearnFlow AI.

## Live Application

**Production URL:** https://learnflow-ai-one.vercel.app/

**GitHub Repository:** https://github.com/jashan19092007/learn-aii-tutor

**Hosting Platform:** Vercel

**Application Framework:** TanStack Start

LearnFlow AI is deployed using Vercel, with its source code maintained in a public GitHub repository. The application uses server-side functions for transcript retrieval and AI-powered tutoring.

## Prerequisites

- A GitHub account with access to the repository
- A Vercel account
- Node.js and npm for local development
- A valid Google Gemini API key
- A valid YouTubeTranscript.dev API key
- Available API quota for both external services

## Environment Configuration

Configure the following environment variables through the Vercel project dashboard.

| Environment Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Authenticates requests to Google's Gemini API |
| `YOUTUBE_TRANSCRIPT_DEV_API_KEY` | Authenticates transcript retrieval requests |

### Configuration Steps

1. Open the project in Vercel.
2. Navigate to **Environment Variables**.
3. Add `GEMINI_API_KEY` with the corresponding secret value.
4. Add `YOUTUBE_TRANSCRIPT_DEV_API_KEY` with the corresponding secret value.
5. Enable the variables for Production and Preview environments.
6. Save the configuration.
7. Redeploy if the variables were added or changed after the previous deployment.

**Security:** API keys must remain server-side. Never expose them in frontend source code, screenshots, public repositories, or client-side environment variables.

## Deployment Process

### Step 1: Import the Repository

1. Open https://vercel.com/new.
2. Sign in using GitHub.
3. Import the `jashan19092007/learn-aii-tutor` repository.
4. Select the appropriate Vercel project or account.

### Step 2: Configure the Application

Use the following settings:

| Setting | Configuration |
|---|---|
| Project | LearnFlow AI |
| Framework Preset | TanStack Start |
| Root Directory | `./` |
| Hosting | Vercel |
| Source Control | GitHub |

Keep the framework's default build settings unless a deployment error requires adjustment.

### Step 3: Configure API Credentials

Add the required environment variables securely through Vercel.

Both transcript retrieval and AI Tutor functionality depend on valid API credentials and service availability.

### Step 4: Deploy

1. Click **Deploy** or **Create Project**.
2. Wait for the deployment process to finish.
3. Check the build logs for errors.
4. Confirm that Vercel reports a successful production deployment.
5. Open the production URL.

**Production Application:** https://learnflow-ai-one.vercel.app/

### Step 5: Verify the Application

Open the deployed website and:

1. Enter a valid educational YouTube video URL.
2. Confirm that the embedded video loads.
3. Play and pause the lecture.
4. Verify that the transcript is retrieved.
5. Check that the Knowledge Horizon updates with the playback position.
6. Ask the AI Tutor a question.
7. Verify that Gemini returns an explanation.
8. Confirm that lecture citations are relevant and clickable.
9. Test the application on mobile and desktop.

## Continuous Deployment

Vercel connects to the GitHub repository for deployment.

The typical update workflow is:

1. Modify the application source code.
2. Commit and push changes to the connected GitHub repository.
3. Vercel automatically starts a new deployment.
4. Review the deployment result.
5. Verify that the latest version is functioning correctly.

Unlike the previous hosting workflow, updating the Vercel production application does not require manually publishing through Lovable.

## Local Development

### Clone the Repository

```bash
git clone https://github.com/jashan19092007/learn-aii-tutor.git
cd learn-aii-tutor
```

### Install Dependencies

```bash
npm install
```

### Configure Local Environment

Create a local `.env` file containing:

```env
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_TRANSCRIPT_DEV_API_KEY=your_transcript_api_key
```

Do not commit this file to GitHub.

### Start the Development Server

```bash
npm run dev
```

Open the local address shown in the terminal.

## System Components

### Frontend

Built using React, TypeScript, TanStack Start, and Tailwind CSS.

Responsible for:

- Landing page and learning workspace
- YouTube lecture player
- AI Tutor chat interface
- Transcript and Knowledge Horizon visualization
- Learning material management

### Backend

Implemented using server-side functions.

Responsible for:

- Transcript retrieval and import
- Preparing timestamp-aware lecture context
- Processing student questions
- Communicating with the Gemini API
- Returning AI responses and source citations

### External Services

**Google Gemini API**

Generates AI-assisted explanations and responses using the context supplied by the application.

**YouTubeTranscript.dev**

Provides timestamped lecture captions when retrieval is supported and the API request succeeds.

**Vercel**

Hosts the deployed application and executes supported server-side functionality.

## Troubleshooting

| Issue | Suggested Solution |
|---|---|
| Website does not load | Check Vercel deployment status and build logs |
| Video does not play | Verify the YouTube URL and embedding permissions |
| Transcript retrieval fails | Check transcript API key, caption availability, and quota |
| AI Tutor does not respond | Check Gemini API key, model availability, and function logs |
| Gemini request fails | Review API errors, quota limits, and model configuration |
| GitHub changes do not appear | Check whether the latest Vercel deployment succeeded |
| Environment variables are not applied | Verify variable names and redeploy |
| Timestamp citations do not work | Check transcript availability and video seeking functionality |

## Deployment Verification Checklist

Complete these checks on the production website before submission.

- [ ] Production website opens publicly
- [ ] Landing page and navigation work
- [ ] YouTube video loads and plays
- [ ] Transcript retrieval succeeds
- [ ] Knowledge Horizon updates correctly
- [ ] Gemini AI Tutor generates a response
- [ ] Lecture citations are relevant and clickable
- [ ] Supported material uploads work
- [ ] Mobile layout is usable
- [ ] API credentials are stored securely
- [ ] Latest GitHub changes are deployed
- [ ] Documentation links are accessible

## Current Project Status

LearnFlow AI has a Vercel production domain and a public GitHub source repository.

The application includes a YouTube learning workspace, timestamp-aware transcript retrieval, Knowledge Horizon visualization, and a Gemini-powered AI Tutor implementation.

Successful domain configuration does not independently confirm that every backend feature is operational. Transcript retrieval, Gemini responses, and citation navigation should be tested on the Vercel production deployment.

For detailed evaluation information, see [Testing and Evaluation Report](docs/TESTING_REPORT.md).

## Project Links

**Live Application:** https://learnflow-ai-one.vercel.app/

**Source Code:** https://github.com/jashan19092007/learn-aii-tutor

**README:** https://github.com/jashan19092007/learn-aii-tutor/blob/main/README.md

**API Documentation:** https://github.com/jashan19092007/learn-aii-tutor/blob/main/API_DOCUMENTATION.md

**Architecture Diagram:** https://github.com/jashan19092007/learn-aii-tutor/blob/main/docs/architecture.png

---

*LearnFlow AI — Watch. Pause. Ask. Understand. Continue.*
