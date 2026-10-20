# Learn Aii Tutor

Build LearnFlow, an AI-powered interactive learning assistant.

Create a professional, responsive web application where students can paste a YouTube lecture URL, watch the lecture, pause at any timestamp, and ask an AI tutor questions about the material covered so far.

The main workspace should contain:

A video player with playback controls and current timestamp.

An AI chat panel for asking contextual questions.

A study-material panel supporting PDF, PPT/PPTX, DOC/DOCX, TXT, and code files.

Source citations linking answers to actual video timestamps or document pages.

Quick actions for simplifying concepts, giving examples, summarizing lessons, comparing concepts, and generating quizzes.

Use React, TypeScript, and Tailwind CSS. Use a clean, modern educational SaaS design.

Important: This must become a functional application, not a static UI prototype. Plan for Supabase authentication, database, storage, and server-side AI integrations.

The most important requirement is timestamp-aware retrieval. If a student asks a question at 18:42, transcript evidence from after 18:42 must not be used. Uploaded study materials can provide additional evidence, clearly identified as separate sources. Never fabricate citations or AI answers.

First build the main application structure and identify the backend integrations required. Do not build the optional mock interview feature yet.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://learn-aii-tutor.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8529ffed-70a4-406d-a504-b2a25db3df46).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
