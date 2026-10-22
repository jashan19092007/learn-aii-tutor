# LearnFlow AI | Deployment Guide

> Technical deployment, environment configuration, and verification guide
> 
## Live Application

**Production URL:** [https://learn-aii-tutor.lovable.app/](https://learn-aii-tutor.lovable.app/)

**GitHub Repository:** [https://github.com/jashan19092007/learn-aii-tutor](https://github.com/jashan19092007/learn-aii-tutor)

The prototype is hosted through Lovable. The repository contains the application source code. Publishing and GitHub synchronization are separate operations.

## Prerequisites

- Access to the LearnFlow AI Lovable project
- Access to its connected GitHub repository
- A working YouTubeTranscript.dev API key
- An AI-provider API key with available quota (Gemini migration pending verification)

## Environment Configuration

Configure the following server-side secrets through Lovable's secure secret-management interface:

| Secret                           | Purpose                                     |
| -------------------------------- | ------------------------------------------- |
| `YOUTUBE_TRANSCRIPT_DEV_API_KEY` | Retrieve timestamped YouTube captions       |
| `GEMINI_API_KEY`                 | Gemini AI Tutor integration, if implemented |

Never expose API keys in frontend code or commit them to GitHub.

## Deployment Process

1. Open the LearnFlow AI project in Lovable.
2. Verify the application build and environment secrets.
3. Click **Publish / Update** to deploy the latest version.
4. Visit [https://learn-aii-tutor.lovable.app/](https://learn-aii-tutor.lovable.app/).
5. Enter an educational YouTube video URL.
6. Verify that video playback and transcript retrieval work.
7. Ask the AI Tutor a question and verify its response.
8. Confirm that the latest source code is synchronized with GitHub.

## Local Development

Clone the GitHub repository:

```bash
git clone https://github.com/jashan19092007/learn-aii-tutor.git
cd learn-aii-tutor
npm install
npm run dev
```

The frontend can be run locally using the project's development scripts. Backend features may require additional configuration and API credentials.

## Troubleshooting

| Issue                                | Suggested Solution                                          |
| ------------------------------------ | ----------------------------------------------------------- |
| Video not loading                    | Verify YouTube URL and embedding permissions                |
| Transcript unavailable               | Check API availability, captions, and rate limits           |
| AI Tutor not responding              | Verify Gemini API key, model availability, and backend logs |
| HTTP 402 error                       | Check whether the application still uses Lovable AI Gateway |
| GitHub updated but website unchanged | Republish the latest application version                    |

## Deployment Verification Checklist

- [ ] Website opens publicly
- [ ] YouTube video playback works
- [ ] Transcript retrieval works
- [ ] AI Tutor responds successfully
- [ ] Timestamp references are accurate
- [ ] API credentials are securely stored
- [ ] GitHub repository contains the latest source code

## Current Project Status

LearnFlow AI has a published web application and a public GitHub repository.

The application includes YouTube video integration, transcript retrieval, and an AI-assisted learning interface.

The AI Tutor previously encountered runtime credit limitations. The Gemini API migration requires successful testing before the tutor can be considered fully operational.

**Live Application:** [https://learn-aii-tutor.lovable.app/](https://learn-aii-tutor.lovable.app/)

**Source Code:** [https://github.com/jashan19092007/learn-aii-tutor](https://github.com/jashan19092007/learn-aii-tutor)
