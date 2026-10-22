# LearnFlow AI | API Documentation

### Technical Architecture, Integrations & AI Learning Workflow

**Live Application:** https://learn-aii-tutor.lovable.app/

**Source Repository:** https://github.com/jashan19092007/learn-aii-tutor

**Technical Resources:**

- [Architecture Diagram](docs/architecture.png)
- [Project Overview](README.md)
- [Deployment Documentation](DEPLOYMENT.md)
- [Testing and Evaluation](docs/TESTING_REPORT.md)

---

## 01 / System Overview

LearnFlow AI is an interactive learning platform designed to enhance educational video content through timestamp-aware transcript retrieval and AI-assisted explanations.

The platform integrates YouTube video playback, transcript processing, and an AI-powered learning interface within a unified workspace.

External API credentials are managed through server-side functions to prevent exposure in the client application.

### Core Capabilities

- **Video Integration:** Embedded YouTube lectures with playback controls.
- **Transcript Retrieval:** Timestamped caption extraction through YouTubeTranscript.dev.
- **Context-Aware Learning:** Using lecture transcripts to provide relevant learning context.
- **AI Assistance:** An interface for explanations, summaries, and lecture-related questions.
- **Secure API Communication:** Server-side credential management and external API integration.

### Integration Overview

| Integration | Purpose | Execution Environment | Status |
|---|---|---|---|
| YouTube Embedded Player | Video playback and lecture navigation | Browser | Implemented in prototype |
| YouTubeTranscript.dev | Timestamped transcript retrieval | Server-side function | Implemented in prototype |
| AI Generation Service | Lecture-specific explanations | Server-side integration | Requires final verification |
| Manual Transcript Input | Alternative transcript source | Application interface | Reported available |

---

## 02 / Transcript Retrieval API

### API Provider

**Provider:** YouTubeTranscript.dev

**Documentation:** https://www.youtubetranscript.dev/api-docs

**HTTP Method:** `POST`

**Endpoint:** `/api/v2/transcribe`

**Purpose:** Retrieve timestamped captions from educational YouTube videos.

### Authentication

API requests use bearer-token authentication.

The transcript provider credential should be configured as a server-side secret:

```text
YOUTUBE_TRANSCRIPT_DEV_API_KEY
```

Authentication credentials must never be exposed through frontend source code, browser responses, or public repositories.

### Request Structure

The application has been configured to request available YouTube captions using `captions_only` mode.

The following example illustrates the intended request structure:

```http
POST /api/v2/transcribe HTTP/1.1
Authorization: Bearer <SERVER_SIDE_API_KEY>
Content-Type: application/json
```

```json
{
  "mode": "captions_only",
  "<video-input-field>": "<YouTube video URL or ID>"
}
```

The video input field is intentionally represented as a placeholder. Its exact name must be confirmed against the server-side implementation and provider documentation.

### Normalized Transcript Structure

Transcript information is processed into timestamped segments that can be displayed alongside the video.

Illustrative normalized data:

```json
{
  "videoId": "example-video",
  "segments": [
    {
      "startSeconds": 12.4,
      "endSeconds": 17.8,
      "text": "Introduction to the selected concept."
    },
    {
      "startSeconds": 17.8,
      "endSeconds": 24.1,
      "text": "Explanation of the concept continues."
    }
  ]
}
```

This example represents an application-level data structure, not a verified raw response from the provider.

### Transcript Processing Workflow

1. The learner submits a YouTube video URL.
2. The application identifies the selected video.
3. A backend function requests the corresponding transcript.
4. YouTubeTranscript.dev processes the request and returns available caption information.
5. Transcript segments are normalized for the learning interface.
6. Timestamped captions are displayed alongside the video player.

---

## 03 / YouTube Player Integration

LearnFlow AI uses an embedded YouTube player to deliver educational video content.

The player provides lecture playback functionality, while transcript information is retrieved through a separate API integration.

### Relevant Data

| Parameter | Description |
|---|---|
| Video ID | Unique identifier of the selected YouTube lecture |
| Playback Position | Current video position in seconds |
| Transcript Start Time | Beginning of a caption segment |
| Transcript End Time | Ending of a caption segment |
| Transcript Text | Spoken educational content associated with the timestamp |

### Timestamp-Aware Learning

The intended workflow uses the learner's current playback position to determine which transcript segments are eligible to support an AI-generated answer.

For example, when a learner pauses at 120 seconds, the AI should use only transcript information covered up to that point.

This restriction must be enforced before transcript content is sent to the AI provider. Its implementation requires verification against the deployed backend.

---

## 04 / AI-Assisted Learning Workflow

LearnFlow AI includes an AI Tutor interface designed to help students understand lecture content.

### Intended Processing Flow

```text
Student submits a question
          |
          v
Retrieve current playback timestamp
          |
          v
Select eligible transcript segments
          |
          v
Identify relevant lecture context
          |
          v
Send context and question to AI provider
          |
          v
Generate educational explanation
          |
          v
Display response in learning interface
```

### AI Tutor Capabilities

The interface is designed to support:

- Concept explanations
- Simplified explanations
- Lecture summaries
- Examples and analogies
- Topic-specific questions
- Interactive knowledge checks

### Grounding and Context Control

The intended architecture prioritizes responses supported by the selected lecture's transcript.

Where sufficient evidence is unavailable, the AI should indicate that the requested information has not yet been covered or cannot be established from the available context.

The exact AI provider, model, server function, timestamp-filtering implementation, and citation behavior require final verification.

---

## 05 / AI Provider Integration

The initial implementation used Lovable AI Gateway for AI-generated responses.

Following runtime credit limitations, a migration to Google Gemini was initiated.

### Intended Configuration

**AI Provider:** Google Gemini

**Credential:** `GEMINI_API_KEY`

**Execution Environment:** Server-side function

### Security Requirements

- Store the API key using secure server-side secrets.
- Never expose the API key to the browser.
- Avoid committing credentials to version control.
- Validate requests before invoking the AI provider.
- Handle authentication, quota, and service errors appropriately.

### Implementation Status

The Gemini migration requires verification through successful live requests.

The deployed model identifier, request endpoint, and response schema should be documented after confirmation from the backend implementation.

The presence of an API key alone does not establish that the integration is operational.

---

## 06 / Error Handling and Reliability

The application should handle common integration failures without exposing sensitive implementation details.

| Scenario | Expected Handling |
|---|---|
| Invalid YouTube URL | Display a clear validation message |
| Captions unavailable | Provide an appropriate fallback or error message |
| Transcript API rate limit | Respect retry instructions and avoid unnecessary requests |
| Repeated transcript requests | Reuse recently retrieved transcript data where available |
| AI provider authentication failure | Display an actionable error without exposing credentials |
| AI provider quota exceeded | Report temporary AI service unavailability |
| Network failure | Display a recoverable error state |
| Insufficient lecture context | Avoid unsupported explanations |

### Transcript Caching

Short-lived transcript caching can reduce repeated API requests for the same video.

The prototype has reportedly used a temporary cache for transcript retrieval. Cache duration, storage mechanism, and persistence should be confirmed against the current backend.

---

## 07 / Security Architecture

LearnFlow AI follows a server-side integration approach for external services.

### Security Practices

1. Store API credentials in server-side secrets.
2. Prevent direct exposure of provider authentication tokens.
3. Validate submitted YouTube URLs and video identifiers.
4. Restrict unnecessary transmission of personal information.
5. Handle external API failures safely.
6. Avoid logging sensitive authentication data.
7. Review publicly committed files for accidental credential exposure.

### Environment Variables

| Variable | Purpose |
|---|---|
| `YOUTUBE_TRANSCRIPT_DEV_API_KEY` | Authentication for transcript retrieval |
| `GEMINI_API_KEY` | Authentication for intended Gemini AI integration |

The exact variable names must match those referenced in the deployed server functions.

---

## 08 / Integration Testing

The following checks are recommended for validating the deployed application.

### Video and Transcript Testing

- [ ] Application loads successfully.
- [ ] YouTube lecture playback works.
- [ ] Transcript retrieval succeeds for a supported video.
- [ ] Transcript timestamps correspond to lecture content.
- [ ] Invalid video URLs are handled correctly.
- [ ] Missing captions produce an appropriate response.

### AI Integration Testing

- [ ] AI Tutor accepts a question.
- [ ] AI provider returns a successful response.
- [ ] Responses use the intended lecture context.
- [ ] Playback timestamp restrictions are enforced.
- [ ] Unsupported questions are handled appropriately.
- [ ] Authentication and quota errors are handled safely.

### Security Testing

- [ ] API credentials are absent from frontend source code.
- [ ] Authentication tokens are not exposed in browser responses.
- [ ] Public repository contains no committed secrets.

These are verification tasks, not claims of completed tests.

Detailed results should be recorded in the [Testing and Evaluation Report](docs/TESTING_REPORT.md).

---

## 09 / Deployment and Application Access

### Production Environment

**Hosting Platform:** Lovable

**Frontend Technologies:** React, TypeScript, Tailwind CSS

**Backend Integration:** Server-side functions

**Transcript Provider:** YouTubeTranscript.dev

**AI Provider:** Gemini integration pending verification

### Live Application

https://learn-aii-tutor.lovable.app/

### Source Repository

https://github.com/jashan19092007/learn-aii-tutor

### Deployment Documentation

[View Deployment Guide](DEPLOYMENT.md)

---

## 10 / Technical Verification Notes

The following implementation details should be confirmed against the current repository before being represented as verified:

| Component | Verification Requirement |
|---|---|
| Transcript Function | Exact internal function name and route |
| Transcript Request | Exact provider request parameters |
| Transcript Response | Actual response mapping and normalization |
| AI Provider | Active provider and model identifier |
| AI Function | Actual server-side request and response schema |
| Timestamp Enforcement | Backend filtering of future transcript segments |
| Citation Generation | Timestamp reference implementation |
| Caching | Cache duration and storage behavior |

These details are intentionally distinguished from confirmed functionality to maintain accurate technical documentation.

---

## 11 / Project References

**Application:** [LearnFlow AI](https://learn-aii-tutor.lovable.app/)

**GitHub Repository:** [LearnFlow AI Source Code](https://github.com/jashan19092007/learn-aii-tutor)

**Architecture:** [System Architecture Diagram](docs/architecture.png)

**Project Documentation:** [README](README.md)

**Deployment:** [Deployment Guide](DEPLOYMENT.md)

**Dataset:** [Sample Transcript Dataset](dataset/sample_transcript.json)

**Testing:** [Evaluation and Testing Report](docs/TESTING_REPORT.md)

---

*LearnFlow AI — Interactive, Context-Aware Learning Through Educational Video Content.*
