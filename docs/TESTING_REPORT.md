# LearnFlow AI | Testing & Evaluation Report

**Project:** LearnFlow AI  
**Production URL:** https://learnflow-ai-one.vercel.app/  
**Repository:** https://github.com/jashan19092007/learn-aii-tutor  
**Scope:** Functional verification and evaluation  
**Status:** Production end-to-end checks pending independent confirmation

## 1. Evaluation objectives

Evaluate YouTube playback, timestamped transcript retrieval, playback-aware evidence filtering, Gemini AI Tutor responses, source citation accuracy, error handling, and mobile usability.

## 2. Functional verification matrix

| ID | Test | Available evidence | Production status |
|---|---|---|---|
| T01 | Public deployment | Vercel domain configured | Browser verification pending |
| T02 | YouTube playback | Previously reported functional in development | Retest on Vercel |
| T03 | Transcript retrieval | Real retrieval reported for video `uKECGJBaOmY`: 193 captions | Retest on Vercel |
| T04 | Gemini AI Tutor | Gemini server-side integration implemented | Successful Vercel response not independently confirmed |
| T05 | Timestamp citation navigation | Citation handling implemented and previously tested in development | Retest on Vercel |
| T06 | Future-content restriction | Server-side timestamp filtering implemented | Production adversarial test pending |
| T07 | Manual transcript import | SRT/VTT/TXT import available in application | Retest on Vercel |
| T08 | Missing captions | Fallback import path documented | Error-path test pending |
| T09 | Rate limiting | Retry-After handling, deduplication, five-minute cache previously reported | Production test pending |
| T10 | Responsive design | Responsive UI implemented | Device testing pending |
| T11 | Knowledge Horizon | Playback-aware context visualization implemented | Live synchronization test pending |
| T12 | Learning materials | Upload and processing paths vary by file type | Format-specific tests pending |

**Interpretation:** “Implemented” and “previously reported” are not equivalent to a recorded production test pass. No production success rate or accuracy percentage is claimed.

## 3. Test procedure

1. Open https://learnflow-ai-one.vercel.app/ in a fresh browser session.
2. Load an educational YouTube video with captions; record its URL and video ID.
3. Confirm playback, pause, seeking, and transcript timestamps.
4. Pause early and ask a question answered only later in the lecture. Confirm future transcript content is not cited as watched evidence.
5. Ask three questions answerable from captions already watched. Compare each answer and timestamp citation with the actual transcript.
6. Ask for an additional explanation and confirm it is distinguished from lecture-sourced evidence.
7. Click citations and verify that the player seeks to the referenced timestamp.
8. Test manual transcript import and a video without available captions.
9. Repeat key checks on mobile and inspect Vercel function logs for failures.

## 4. Recorded development observations

- YouTubeTranscript.dev retrieval was previously reported successful for `uKECGJBaOmY`, returning **193 captions**.
- Rate-limit handling with Retry-After, request deduplication, and five-minute successful-result caching were previously reported.
- The application includes server-side evidence filtering and citation validation.
- The original AI integration encountered Lovable AI Gateway credit limitations. The implementation was subsequently migrated toward Google Gemini.
- A Gemini server function is present, but a successful end-to-end answer on the Vercel production deployment has not been independently confirmed for this report.

These are development observations, not newly executed tests.

## 5. Question-level evaluation

| Case | Playback position | Expected behavior | Recorded result |
|---|---|---|---|
| Q1: Already-covered definition | To be recorded | Answer using eligible captions | Pending |
| Q2: Future lecture topic | Before topic begins | Do not attribute later captions to watched lecture | Pending |
| Q3: Supplementary explanation | To be recorded | Label external Gemini explanation separately | Pending |

## 6. Quantitative metrics

| Metric | Result |
|---|---|
| Production transcript retrieval success rate | Not measured |
| Production Gemini response success rate | Not measured |
| Answer grounding accuracy | Not measured |
| Citation accuracy | Not measured |
| Future-content leakage rate | Not measured |
| Median response latency | Not measured |

Numerical performance claims require repeatable recorded test runs.

## 7. Known limitations

- Transcript availability depends on external API access, captions, and quota.
- Gemini calls depend on valid credentials, a supported model, and available quota.
- Model-generated explanations and citations require factual verification.
- Some document formats may not be fully processed.
- The mock interview extension is future scope, not a verified deliverable.

## 8. Submission verification checklist

- [ ] Public Vercel page loads
- [ ] YouTube video plays
- [ ] Captions load from the server
- [ ] Knowledge Horizon updates with playback
- [ ] Gemini produces a successful answer
- [ ] Timestamp citations seek correctly
- [ ] Future-content question does not cite later transcript
- [ ] Supported transcript import works
- [ ] Mobile layout is usable
- [ ] All documentation links open

## References

- [Live Application](https://learnflow-ai-one.vercel.app/)
- [Repository](https://github.com/jashan19092007/learn-aii-tutor)
- [Project README](../README.md)
- [API Documentation](../API_DOCUMENTATION.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Architecture Diagram](architecture.png)

*This report separates recorded development evidence from outstanding production verification.*
