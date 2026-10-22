# Sample Dataset | LearnFlow AI

This folder describes the timestamped-transcript input used by the lecture tutor.

## Included files

- `sample_transcript.json`: **illustrative schema example**, not an extracted YouTube transcript. Do not present it as real test data.

## How to create a genuine sample dataset

1. Open the same educational YouTube lecture used in the demo.
2. Retrieve its captions through LearnFlow AI / YouTubeTranscript.dev.
3. Export a short excerpt with exact text, start/end timestamps, video ID, and source URL.
4. Replace the illustrative JSON with the **actual extracted segments** and update `data_origin` to `youtube_captions`.
5. Check caption reuse rights and include attribution to the original video.

## Data dictionary

| Field | Meaning |
|---|---|
| `video_id` | YouTube video identifier |
| `source_url` | Original lecture URL |
| `data_origin` | Where transcript came from |
| `segments[].start_seconds` | Start time in seconds |
| `segments[].end_seconds` | End time in seconds |
| `segments[].text` | Caption text |

No private student information is required for this dataset.
