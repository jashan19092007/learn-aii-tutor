# LearnFlow AI | API Documentation

### Technical Architecture, Integrations & AI Learning Workflow

**Live Application:** https://learnflow-ai-one.vercel.app/

**Source Repository:** https://github.com/jashan19092007/learn-aii-tutor

## Technical Resources

- [Architecture Diagram](docs/architecture.png)
- [Project Overview](README.md)
- [Deployment Documentation](DEPLOYMENT.md)
- [Testing and Evaluation](docs/TESTING_REPORT.md)

---

## 01 / System Overview

LearnFlow AI is an interactive learning platform that combines YouTube lecture playback, timestamp-aware transcript retrieval, and Google Gemini-powered educational assistance.

The platform is built using React, TypeScript, TanStack Start, and Tailwind CSS, with deployment through Vercel.

### Core Capabilities

- Embedded YouTube lecture player
- Automatic transcript retrieval where available
- Manual timestamped transcript import
- Timestamp-aware lecture-context filtering
- Knowledge Horizon visualization
- AI-generated explanations and summaries
- Source citations linked to lecture timestamps
- Supported learning material processing
- Secure server-side API communication

### Integration Overview

| Integration | Purpose | Environment |
|---|---|---|
| YouTube IFrame Player API | Lecture playback and timestamp tracking | Browser |
| YouTubeTranscript.dev | Timestamped transcript retrieval | Server |
| Google Gemini API | AI Tutor explanations and question answering | Server |
| TanStack Start | Application routing and server functions | Application |
| Vercel | Hosting and server execution | Cloud |

## 02 / Transcript Retrieval API

**Provider:** YouTubeTranscript.dev

**Documentation:** https://www.youtubetranscript.dev/api-docs

**API Endpoint:** `POST /api/v2/transcribe`

**Authentication:** Bearer token

**Environment Variable:** `YOUTUBE_TRANSCRIPT_DEV_API_KEY`

The application requests available captions using `captions_only` mode.

### Illustrative Request

```http
POST /api/v2/transcribe HTTP/1.1
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

```json
{
  "mode": "captions_only",
  "video": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

The request is illustrative; the exact input field and payload should be checked against the implementation.

### Transcript Processing

1. The user submits a YouTube lecture URL.
2. The application extracts the video ID.
3. A server function requests the transcript.
4. Caption data is converted into timestamped segments.
5. The transcript is made available to the learning workspace.
6. Playback position determines which segments are eligible for AI context.

### Transcript Data Example

```json
{
  "segments": [
    {
      "start": 12.4,
      "end": 17.8,
      "text": "Introduction to the concept."
    },
    {
      "start": 17.8,
      "end": 24.1,
      "text": "The explanation continues."
    }
  ]
}
```

This is illustrative normalized data, not a raw provider response.

### Manual Transcript Import

If automatic retrieval is unavailable, users can import timestamped transcripts using supported formats:

- SRT
- VTT
- Timestamped TXT

Imported transcripts are processed into the same general segment structure.

## 03 / YouTube Player Integration

LearnFlow uses the YouTube IFrame Player API.

### Supported Player Operations

| Operation | Description |
|---|---|
| Play | Resume lecture playback |
| Pause | Stop playback at the current timestamp |
| Seek | Navigate to a specified lecture position |
| Get Current Time | Retrieve the current playback timestamp |
| Get Duration | Retrieve total video duration |

The player synchronizes playback information with the transcript interface and AI Tutor.

### Timestamp-Aware Context

For a question asked at time `T`, the application selects eligible lecture segments based on that timestamp.

Conceptually:

```text
Current playback position: T

Full transcript
       |
       v
Timestamp filtering
       |
       v
Eligible lecture context
       |
       v
AI Tutor request
```

This design is intended to prevent future lecture content from being presented as material already watched.

## 04 / Knowledge Horizon

Knowledge Horizon represents the boundary between accessible lecture content and future content.

### Inputs

- Current playback timestamp
- Available transcript segments
- Transcript timestamps

### Outputs

- Eligible caption count
- Total caption count
- Percentage of transcript context available
- Visual indication of lecture-context coverage

### Example

```text
Lecture duration: 30 minutes
Current playback: 10 minutes

Knowledge Horizon:
Lecture context available up to 10:00
Future transcript content excluded from lecture evidence
```

The feature visualizes transcript eligibility. It is not a guarantee that the AI model will never generate information from its general training knowledge.

## 05 / Google Gemini API Integration

**AI Provider:** Google Gemini

**Environment Variable:** `GEMINI_API_KEY`

**Execution:** Server-side application function

The Gemini API generates educational responses using the question, conversation context, and relevant evidence supplied by LearnFlow.

### AI Tutor Workflow

```text
Student asks a question
         |
         v
Capture playback timestamp
         |
         v
Select eligible transcript segments
         |
         v
Retrieve relevant evidence
         |
         v
Include supported learning materials
         |
         v
Construct AI request
         |
         v
Send request to Gemini
         |
         v
Process AI response
         |
         v
Display answer and citations
```

### Supported Learning Actions

- Explain a concept
- Simplify an explanation
- Generate examples
- Summarize available lecture content
- Compare concepts
- Generate practice questions

### Conversation Context

Recent conversation history can be included in AI requests to support follow-up questions.

The application should continue enforcing the current lecture-context boundary when processing follow-up questions.

## 06 / Lecture Evidence vs. External Knowledge

LearnFlow is designed to distinguish between information derived from the lecture and supplementary AI-generated knowledge.

### From the Lecture

Information supported by eligible transcript segments.

Examples include:

- Definitions stated by the lecturer
- Concepts explained before the current timestamp
- Examples discussed in the available lecture context

### From Your Materials

Information supported by processed, uploaded learning resources.

Only material that has been successfully extracted and made available to the backend can be used as evidence.

### Additional Explanation — Gemini AI

Supplementary information that may not appear in the lecture.

Examples include:

- General background knowledge
- Additional analogies
- Alternative explanations
- Illustrative examples

This distinction is intended to make AI-generated answers more transparent.

**Limitation:** Separating sources through prompts and evidence selection does not guarantee perfect attribution. Generated responses should be verified against their cited sources.

## 07 / Evidence and Citations

LearnFlow associates AI responses with relevant source evidence.

### Video Evidence

A video citation identifies a timestamp within the lecture.

Example:

```json
{
  "kind": "video",
  "id": "example-citation",
  "start": 128
}
```

When the learner clicks a video citation, the player seeks to the referenced timestamp.

### Document Evidence

Document citations may identify processed learning materials and associated page information where available.

The application must distinguish between successfully processed material and uploaded files whose contents are not yet available to the AI.

### Citation Handling

The interface presents clickable citation controls separately from the generated answer text.

Citation quality depends on evidence retrieval, validation, and the correctness of the underlying source data.

## 08 / Application Server Functions

The application uses TanStack Start server functions rather than exposing external API credentials in the browser.

### Transcript Functions

**Implementation:** `src/lib/transcript.functions.ts`

Responsibilities include:

- Requesting transcript information
- Processing retrieval results
- Supporting transcript import
- Returning transcript data or errors

### AI Tutor Function

**Implementation:** `src/lib/tutor.functions.ts`

Responsibilities include:

- Receiving student questions
- Processing transcript and document context
- Calling the Gemini API
- Returning AI-generated responses
- Returning available citation information
- Handling provider errors

### Evidence Retrieval

**Implementation:** `src/lib/retrieval.ts`

Responsibilities include:

- Timestamp-based transcript eligibility
- Text chunking
- Evidence selection
- Supporting source-grounded explanations

These functions are application-internal integrations, not a separately published public REST API.

## 09 / Security

LearnFlow follows a server-side API integration model.

### Security Measures

- Gemini API credentials stored as server-side environment variables
- Transcript API credentials stored as server-side environment variables
- External API requests handled by backend functions
- No intentional exposure of secret credentials in frontend code
- Public repository excludes actual API keys

### Required Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_TRANSCRIPT_DEV_API_KEY=your_transcript_api_key
```

API keys should never be committed to GitHub or included in public documentation.

## 10 / Error Handling

| Scenario | Expected Handling |
|---|---|
| Invalid YouTube URL | Display a validation message |
| Captions unavailable | Offer retry or manual transcript import |
| Transcript API rate limit | Display an appropriate retrieval error |
| Missing Gemini credentials | Return a server-side configuration error |
| Gemini API failure | Display a tutor error message |
| Unsupported document | Notify the user that processing is unavailable |
| Insufficient lecture evidence | Indicate the limitation of available lecture context |

Actual error messages depend on the current implementation.

## 11 / Deployment

**Hosting Platform:** Vercel

**Production URL:** https://learnflow-ai-one.vercel.app/

**Repository:** https://github.com/jashan19092007/learn-aii-tutor

Deployment requires configuring the Gemini and transcript API credentials through Vercel's environment-variable settings.

For detailed setup instructions, see [Deployment Documentation](DEPLOYMENT.md).

## 12 / Testing and Evaluation

The following scenarios should be tested against the deployed production application:

- YouTube video playback
- Automatic transcript retrieval
- Manual transcript import
- Playback timestamp synchronization
- Knowledge Horizon updates
- AI Tutor question answering
- Lecture-derived explanations
- Supplementary Gemini explanations
- Clickable timestamp citations
- API error handling
- Responsive layout

Implementation of a feature does not by itself confirm successful production testing.

See [Testing and Evaluation Report](docs/TESTING_REPORT.md) for recorded verification results.

## 13 / Current Limitations

- Transcript retrieval depends on external API availability and quota.
- Some videos may not have accessible captions.
- AI-generated explanations can contain inaccuracies.
- Source attribution is not guaranteed to be perfect.
- Certain document formats require additional extraction or processing.
- Gemini functionality depends on valid credentials, model availability, and usage limits.
- The AI mock interview extension remains future work unless separately implemented.

## 14 / Future Enhancements

- AI-powered mock interviews
- Speech-to-text fallback
- Improved PDF and presentation extraction
- Adaptive quizzes
- Personalized learning recommendations
- Topic-level weakness analysis
- Learning progress tracking

---

**Project:** LearnFlow AI

**Hackathon:** AHGV BuildVerse 2026

**Problem Statement:** PS-1 — AI-Powered Interactive Learning Assistant with AI Mock Interview Extension

**Live Application:** https://learnflow-ai-one.vercel.app/

**Source Code:** https://github.com/jashan19092007/learn-aii-tutor

*LearnFlow AI — Watch. Pause. Ask. Understand. Continue.*
