<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## LearnFlow rules
- Transcript evidence is filtered by `end <= askedAt` via `src/lib/retrieval.ts` (and must be mirrored in SQL) — answers may never use content after the pause point.
- AI citations are validated against the supplied evidence IDs (`validateCitations`) — prevents fabricated sources.
- Study materials are always a separate source kind ("document") from video transcript — keeps citations distinguishable.
- Model calls and document parsing run server-side only — keeps keys and heavy parsing off the client.
- AI tutor calls go through `src/lib/tutor.functions.ts`, which re-runs `buildEvidence` server-side — the client's filtering is never trusted.
- Caption ingestion prefers YouTubeTranscript.dev v2 captions-only via a server-held key; otherwise use official editor-authorized, allowlisted captions or server-parsed imports — avoids audio transcription charges and keeps secrets off the client.
- Conversation history carries its pause point and is filtered server-side when rewinding — prevents later lecture answers from leaking into earlier questions.
