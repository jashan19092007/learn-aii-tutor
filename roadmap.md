# LearnFlow roadmap

- [x] Connect saved YouTubeTranscript.dev key via existing transcript function; captions-only, no Cloud/database/UI changes; 22 tests passed.
- [x] Successful real retrieval for uKECGJBaOmY — 193 captions (0.28s–553.76s) via YouTubeTranscript.dev; 429 fixed with Retry-After handling + server-side request dedupe/5-min cache (free plan is 1 req/s).

- [x] App structure: landing, lecture workspace (player, tutor chat, materials, quick actions, citation chips)
- [x] Timestamp-aware evidence filter + citation validation (tested)
- [ ] Enable Lovable Cloud (auth, database, storage)
- [ ] Auth: email/password + Google; profiles table
- [ ] Tables: lectures, transcript_segments, materials, material_chunks, conversations, messages (RLS per user)
- [ ] Storage bucket for uploaded materials (private)
- [x] Implement official authorized YouTube caption retrieval, timestamped paste/upload fallback and clear status (20 tests pass; browser upload, errors, real AI fixture answer and citation seek verified)
- [ ] Test lecture-based answers for uKECGJBaOmY end-to-end in the browser — transcript retrieval now verified; tutor flow with real captions not yet re-tested.
- [ ] Server-side text extraction for PDF / PPTX / DOCX → page chunks
- [ ] Embeddings + retrieval (filter `end <= asked_at` in SQL before ranking)
- [x] AI tutor server function (cites only supplied evidence IDs, refuses when evidence is missing; not streamed)
- [ ] Not now: mock interview feature
