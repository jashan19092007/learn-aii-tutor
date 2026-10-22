<div align="center">

# LearnFlow AI · API Documentation

### How the lecture becomes usable learning context

**Hackathon technical reference** · Transcript retrieval · Player integration · AI workflow

[Architecture](architecture.md) · [Project README](README.md) · [Source code](https://github.com/jashan19092007/learn-aii-tutor)

</div>

---

## 01 / Overview

LearnFlow AI keeps the video player in the browser while handling transcript-provider credentials on the server. The main external integration is **YouTubeTranscript.dev**, which returns timed captions for a lecture. Those captions are displayed in the learning workspace and can form the evidence for lecture-specific AI assistance.

This document separates **observed/reported prototype behavior** from **AI functionality that should be verified in the source code**. It is intentionally not a claim that every endpoint below is a public API exposed by LearnFlow AI.

### Integration map

| Integration | Why we use it | Where it runs | Status |
|---|---|---|---|
| YouTube player/embed | Show the lecture and expose playback position | Browser | Working in reported prototype |
| YouTubeTranscript.dev | Retrieve captions with timestamps | Server-side function | Working in reported prototype |
| AI generation service | Explain lecture concepts using selected context | Server-side integration (intended) | Model and implementation need verification |
| Manual transcript import | Allow a transcript to be provided when automated retrieval fails | Application UI | Available in reported prototype |

---

## 02 / Transcript retrieval

**Provider:** YouTubeTranscript.dev  
**Method:** `POST`  
**Provider path:** `/api/v2/transcribe`  
**Purpose:** Request timestamped captions for a selected YouTube video.

### Authentication

The server authenticates with a bearer token. The credential is stored as a server-side secret named:

```text
YOUTUBE_TRANSCRIPT_DEV_API_KEY
```

**Never** add the token to frontend code, commit it to GitHub, or expose it in browser network responses.

### Request shape

The application has been described as using `captions_only` to avoid triggering paid speech-to-text fallback. The illustrative request below documents the intended provider call; **confirm the exact JSON field for the video URL/ID in the repository's server function before treating this as a copy-paste API example**.

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

The placeholders above are intentional: they prevent a guessed parameter name from being mistaken for the actual provider contract. For the definitive payload, consult the application's transcript function and the [provider API documentation](https://www.youtubetranscript.dev/api-docs).

### Response data used by LearnFlow

The essential information is **caption text plus time offsets**. This is a *normalized example of data used by the UI*, not a verbatim provider response:

```json
{
  "videoId": "example-video",
  "segments": [
    { "startSeconds": 12.4, "endSeconds": 17.8, "text": "A short sample lecture segment." },
    { "startSeconds": 17.8, "endSeconds": 24.1, "text": "The explanation continues here." }
  ]
}
```

Actual provider response fields and any transformation into the UI's segment structure must be checked against the implementation.

### What happens after retrieval?

1. The learner supplies a YouTube lecture link or video ID.
2. The frontend requests its transcript through the application's backend.
3. The backend calls YouTubeTranscript.dev with the server-side credential.
4. Timestamped segments are returned to the application.
5. The transcript is shown alongside the video; the learner can use manual import if automatic retrieval is unavailable.

---

## 03 / YouTube player integration

The embedded YouTube player is responsible for **video playback**, not caption generation. The application is designed to associate the transcript with the lecture and, where implemented, use the player's current time to determine which transcript passages are eligible for an answer.

| Data | Example | Use |
|---|---|---|
| Video ID | `example-video` | Identify the selected lecture |
| Playback position | `125.5` seconds | Indicate how far the learner has watched |
| Transcript segment start/end | `120.0–128.0` seconds | Associate an explanation with a lecture moment |

**Important distinction:** visually hiding future transcript lines does **not** prevent an AI model from seeing future content. A genuine playback-aware AI workflow must restrict transcript data **before** sending it to the model.

---

## 04 / AI answer workflow — implementation to verify

The planned grounded-answer path is:

```text
Student question + current playback time
                 ↓
Select transcript segments already covered
                 ↓
Find relevant passages within those segments
                 ↓
Send bounded context to the configured AI service
                 ↓
Return an explanation and supporting timestamps
```

**Verification needed before claiming completion:** exact AI provider/model, internal function/endpoint, request and response schema, timestamp filtering logic, and citation formatting. These details should be copied from the actual code rather than guessed.

A useful design rule is to return **“not covered yet”** when the permitted transcript contains insufficient evidence. That is a proposed behavior, not a verified test result.

---

## 05 / Error handling and resilience

| Situation | Expected handling | Evidence/status |
|---|---|---|
| Invalid YouTube link | Show an actionable validation message | Test in deployed app |
| Captions unavailable | Offer manual transcript import | Fallback reported available |
| Provider returns `429` | Respect `Retry-After` where provided; avoid repeated calls | Rate-limit handling reported implemented |
| Duplicate requests for one video | Deduplicate requests and reuse recent results | Short-lived in-memory caching reported |
| Network/server failure | Show error state without exposing secrets | Test in deployed app |
| AI cannot support answer from context | State that evidence is insufficient | Desired behavior; verify |

A short-lived **in-memory cache** can reduce repeated transcript calls, but it is not a persistent database. No persistent database is confirmed for this prototype.

---

## 06 / Security notes

- Keep external provider keys in server-side environment/secrets settings.
- Do not log or display authentication headers.
- Validate incoming video identifiers before making outbound requests.
- Avoid sending unnecessary personal information to external providers.
- Do not expose unrestricted backend endpoints without considering abuse and provider quotas.
- Check the public repository for committed secrets before submission.

---

## 07 / How to verify the integration (judge checklist)

- [ ] Open the deployed application in a private browser window.
- [ ] Load a captioned YouTube lecture.
- [ ] Confirm the transcript appears and timestamps match the video.
- [ ] Load the same lecture again and observe behavior without claiming an unmeasured performance gain.
- [ ] Try an invalid URL and a video without available captions.
- [ ] Confirm that the API key is not present in frontend code or browser responses.
- [ ] If AI Q&A is enabled, test a question about material **later** in the video and record whether the answer is correctly withheld.
- [ ] Record real results in the evaluation document; do not invent success rates.

---

## 08 / Implementation references to fill in

These are the remaining details that should be copied from the synced GitHub source:

| Item | Where to find it | Verified value |
|---|---|---|
| Internal transcript function path | Server/edge functions | `TO VERIFY` |
| Exact transcript provider request body | Transcript function source | `TO VERIFY` |
| Exact provider response mapping | Transcript parsing code | `TO VERIFY` |
| AI provider and model | AI server function/configuration | `TO VERIFY` |
| AI request/response schema | AI server function | `TO VERIFY` |
| Playback timestamp enforcement | Context-building function | `TO VERIFY` |

> **Project note:** This document reflects the current reported LearnFlow AI prototype and deliberately marks unknown implementation details. It should be updated after a final code review, rather than presenting assumptions as finished engineering work.

---

## Runtime AI provider update (verification required)

The project originally routed tutor requests through Lovable AI Gateway, which returned a credit-exhaustion error after the free allowance was used. A migration to **Google Gemini via a server-side `GEMINI_API_KEY`** was requested, but successful live responses have **not yet been confirmed**. Check the current backend source before claiming Gemini is the active provider, and update this section with the actual model, request endpoint, request/response schema, and error handling after verification. Never include secret values in documentation or source control.
