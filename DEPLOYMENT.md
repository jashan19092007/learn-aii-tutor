# LearnFlow AI | Deployment Guide

> Hackathon submission · Deployment and verification notes

## Live application

**Production URL:** `ADD_YOUR_PUBLISHED_LOVABLE_URL`

The prototype is hosted through Lovable. The repository contains the application source; publishing and GitHub synchronization are separate operations.

## Prerequisites

- Access to the LearnFlow AI Lovable project
- Access to its connected GitHub repository
- A working YouTubeTranscript.dev API key
- An AI-provider API key with available quota (the Gemini migration is **pending verification**)

## Environment configuration

Set these **server-side secrets** using the project's supported secret-management interface:

| Secret | Purpose | Notes |
|---|---|---|
| `YOUTUBE_TRANSCRIPT_DEV_API_KEY` | Fetch timestamped YouTube captions | Never commit |
| `GEMINI_API_KEY` | Intended Gemini tutor integration | Only required if migration is implemented and verified |

Never store actual API keys in the repository or in client-side environment variables. Verify the exact secret names against the deployed server functions.

## Publish workflow

1. Open the LearnFlow AI project in Lovable.
2. Verify the current build and server-side secrets.
3. Publish / update the deployment using Lovable's publish control.
4. Open the **published URL in a private browser window**.
5. Paste a YouTube lecture URL and check video playback and transcript retrieval.
6. Ask a transcript-grounded question; confirm the tutor returns an answer, not an AI quota/authentication error.
7. Confirm the connected GitHub repository has the latest source commit. GitHub sync does **not** itself prove the live deployment was updated.

## Local development (verify against package.json)

```bash
git clone https://github.com/jashan19092007/learn-aii-tutor.git
cd learn-aii-tutor
npm install
npm run dev
```

The local frontend may run without server-side tutor functionality unless backend services and secrets are separately configured. Follow the actual scripts in `package.json` if different.

## Troubleshooting

| Symptom | Check |
|---|---|
| Video does not load | Valid URL, embed restrictions, browser console |
| Transcript unavailable | Captions availability, API rate limit, backend logs |
| Tutor does not answer | Gemini key, model access, free-tier quota, backend logs |
| `402 Payment Required` from Lovable AI Gateway | Legacy AI Gateway still used or its credits are exhausted |
| GitHub updated but website unchanged | Publish the latest project version and retest |

## Deployment verification

- [ ] Published link opens without a login
- [ ] Video playback works
- [ ] Transcript retrieval works
- [ ] Tutor answers a real question (currently needs re-test)
- [ ] Timestamp citations checked against video (needs re-test)
- [ ] No credentials committed to GitHub
- [ ] Source and deployment represent the same build

**Current status:** The user reported a working published site and GitHub source repository. AI Tutor runtime failed after Lovable Gateway credits were exhausted; Gemini integration is being debugged. Re-test before declaring the deployed application fully functional.
