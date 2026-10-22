# LearnFlow AI | Testing & Evaluation Report

**Project:** LearnFlow AI  
**Scope:** Hackathon prototype  
**Report type:** Honest functional checklist; not a fabricated benchmark  
**Last documented issue:** AI Tutor unable to answer after runtime credits were exhausted

## Testing objectives

Verify the core learning workflow: open a lecture, retrieve timed captions, ask a question, and receive a relevant answer with evidence. Evaluate behavior at different playback timestamps and under provider failures.

## Functional test matrix

| ID | Test | Procedure | Recorded outcome | Next action |
|---|---|---|---|---|
| T01 | Public deployment | Open published URL in incognito | User reports live site works; independently recheck | Add URL and date |
| T02 | YouTube playback | Load a supported educational video | Previously reported working | Record chosen video ID |
| T03 | Automatic transcript | Load captioned video; view transcript | Previously reported working; one earlier test returned 193 captions | Re-run with demo video |
| T04 | Tutor response | Ask a question answered in transcript | **Fail / blocked:** AI quota exhausted, then Gemini migration unresolved | Fix and retest |
| T05 | Citation accuracy | Compare returned timestamp with source segment | Not yet verified | Test after T04 passes |
| T06 | Future-content restriction | Pause early; ask about later concept | Not yet verified | Test after T04 passes |
| T07 | Manual transcript import | Import a short transcript | Feature previously reported; not retested | Confirm in live build |
| T08 | Missing captions | Try video with no captions | Not yet verified | Check user-facing fallback |
| T09 | Provider rate limit | Observe or simulate 429 response | Retry/cache behavior reported earlier; not retested | Verify logs |
| T10 | Mobile usability | Open on phone or responsive viewport | Not yet verified | Capture screenshot |

**Do not mark untested cases as Passed.** Replace outcomes only after running the tests.

## Known issue and root-cause investigation

The original tutor used Lovable AI Gateway. The workspace's free runtime allowance was exhausted, and the application displayed an AI-credit error. A switch to Gemini was initiated, but the user subsequently reported that the tutor still did not answer. The exact Gemini failure cause is **not established**. Inspect backend logs for HTTP status, authentication, model ID, response parsing, and quota before updating this report.

## Minimal evaluation protocol

1. Select one educational YouTube video and record its URL and title.
2. Load the transcript; note retrieval success, number of segments, and elapsed time if measured.
3. Ask **three** factual questions answerable from the transcript.
4. For each, mark answer **Supported / Partially supported / Unsupported**, quoting the relevant transcript timestamp.
5. Test **two** future-content questions at early playback positions.
6. Record errors, request status codes, and latency **only if actually measured**.

### Results table — fill after testing

| Question | Video position | Transcript evidence | Tutor answer summary | Grounded? | Citation correct? |
|---|---|---|---|---|---|
| Q1 | TBD | TBD | TBD | Not tested | Not tested |
| Q2 | TBD | TBD | TBD | Not tested | Not tested |
| Q3 | TBD | TBD | TBD | Not tested | Not tested |

## Metrics

- **Transcript success rate:** not measured
- **Answer grounding accuracy:** not measured
- **Timestamp citation accuracy:** not measured
- **Future-content leakage rate:** not measured
- **Median response time:** not measured

These metrics are deliberately unreported until actual evaluation data is collected.

## Current conclusion

The lecture interface and transcript retrieval were demonstrated during development. The AI Tutor is currently blocked by an unresolved provider integration issue. Full end-to-end evaluation must be repeated after the fix, and the report should be updated with actual results before final submission.
