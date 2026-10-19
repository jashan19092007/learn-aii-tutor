# YouTube captions setup

The embedded player cannot supply caption text. YouTube's supported caption download API requires OAuth authorization from an account with permission to edit the video; an API key or a public video link is insufficient.

## No-setup fallback

Import an authorized SRT/VTT caption file or paste timestamped text under **Lecture transcript**. Video owners can export captions from YouTube Studio → Subtitles → Edit → Options → Download subtitles. Public **Show transcript** text can be pasted only where the user has permission to reuse it.

Start-only text uses the next timestamp as the preceding caption's conservative end. The final line is excluded when its end time is unknown. SRT/VTT files preserve actual end times. Imported text is user-supplied, not certified as matching the video by LearnFlow.

## Optional official automatic retrieval

1. Create a Google Cloud project and enable **YouTube Data API v3**.
2. Configure a Google OAuth consent screen and OAuth client. Authorize the owner/editor account with scope `https://www.googleapis.com/auth/youtube.force-ssl` using Google's supported OAuth flow. For a one-off preview test, Google's OAuth Playground can issue the access token after consent.
3. Save the OAuth **access token**, not an API key or client secret, as the server-only secret `YOUTUBE_CAPTIONS_ACCESS_TOKEN` in Lovable. Never paste it into chat or frontend code.
4. Set server-only `YOUTUBE_CAPTIONS_VIDEO_IDS` to a comma-separated list of IDs the owner has explicitly authorized for public caption use. For the requested test video this is `uKECGJBaOmY`, but only approve it with the owner's permission. The public retrieval function refuses all other video IDs to avoid exposing private captions.
5. Click **Retry caption retrieval**. The app uses `captions.list` then `captions.download?tfmt=vtt`. English is preferred when available; otherwise the first available served track is used, without translating it.

Access tokens expire. The current integration shows an authorization error when that happens; it does not implement token renewal or per-user OAuth. Durable automatic access needs an approved OAuth flow with refresh-token storage and renewal. This has not been added because the request excludes unrelated account/service setup. Published applications must be republished after changing secrets.

The official list+download request uses 250 quota units (50+200). This is not a public-transcript API for arbitrary lectures. No scraping, unofficial caption endpoints, proxy services, or downloaded-audio transcription are used.

## Safety

Only completed segments with `end <= askedAt` are passed to the tutor. History from later pause points is excluded after rewinding. Returned citation IDs are checked against the same evidence. Citation clicks pause and seek the existing player to the actual supplied cue start.

## Official references

- https://developers.google.com/youtube/v3/docs/captions/list
- https://developers.google.com/youtube/v3/docs/captions/download
- https://support.google.com/youtube/answer/2734705
- https://developers.google.com/youtube/terms/developer-policies