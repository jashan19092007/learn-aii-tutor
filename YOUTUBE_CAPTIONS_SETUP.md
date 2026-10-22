# LearnFlow AI | YouTube Transcript Setup

**Production application:** https://learnflow-ai-one.vercel.app/

LearnFlow AI retrieves timestamped captions using **YouTubeTranscript.dev** from server-side application functions. The YouTube embedded player supplies playback information, not transcript text.

## 1. Automatic transcript retrieval

**Provider:** [YouTubeTranscript.dev](https://www.youtubetranscript.dev/api-docs)

The integration uses the provider's v2 transcription endpoint with `captions_only` mode to request existing captions. Availability depends on the video, provider, and API quota. Automatic speech-to-text fallback is not part of the documented current workflow.

### Server-side configuration

In Vercel, open the LearnFlow AI project and add the environment variable:

```env
YOUTUBE_TRANSCRIPT_DEV_API_KEY=your_transcript_api_key
```

Configure it for the intended environments and redeploy after adding or changing it. Do not expose API keys in frontend code or commit them to GitHub.

The AI Tutor separately uses:

```env
GEMINI_API_KEY=your_gemini_api_key
```

## 2. Using automatic captions

1. Open the [production application](https://learnflow-ai-one.vercel.app/).
2. Enter a YouTube lecture URL.
3. Load the lecture and request its transcript.
4. Verify that timestamped segments appear.
5. Pause the lecture and ask a question using the available transcript context.

A development retrieval was previously reported for video ID `uKECGJBaOmY`, returning 193 captions. This is not a claim that the same request was retested on the current Vercel deployment.

## 3. Manual fallback

When automatic retrieval is unavailable, import an authorized **SRT**, **VTT**, or supported timestamped **TXT** transcript.

- SRT and VTT can preserve start and end timestamps.
- Start-only timestamped text may have conservative inferred boundaries.
- User-supplied transcripts are not independently certified as matching the video.

Only import or reuse captions where you have the necessary permission.

## 4. Timestamp-aware evidence

The tutor's server-side retrieval logic filters transcript evidence to captions completed by the question's playback timestamp. It also validates returned citation references against supplied evidence.

This restricts which lecture transcript segments are passed to the model; it does not guarantee that a generative model never uses general knowledge. Additional AI explanations should be distinguished from lecture-derived evidence.

## 5. Rate limits and troubleshooting

| Issue | Action |
|---|---|
| Missing transcript | Check caption availability; use manual import if needed |
| Unauthorized request | Verify `YOUTUBE_TRANSCRIPT_DEV_API_KEY` in Vercel |
| HTTP 429 | Observe provider Retry-After; avoid rapid repeated requests |
| Deployment not using new key | Redeploy after environment-variable changes |
| Gemini answer unavailable | Check `GEMINI_API_KEY`, selected model, quota, and server logs |

Development notes report in-flight request deduplication and five-minute caching of successful transcript results. Confirm behavior on the current deployment.

## 6. Related documentation

- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Testing Report](docs/TESTING_REPORT.md)
- [Provider API Reference](https://www.youtubetranscript.dev/api-docs)
