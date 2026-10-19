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
