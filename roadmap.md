# LearnFlow roadmap

- [x] Connect saved YouTubeTranscript.dev key via existing transcript function; captions-only, no Cloud/database/UI changes; 22 tests passed.
- [ ] Successful real retrieval for uKECGJBaOmY — tested through the URL form, but provider returned HTTP 429; blocked by provider rate limit, manual fallback verified visible.

- [x] App structure: landing, lecture workspace (player, tutor chat, materials, quick actions, citation chips)
- [x] Timestamp-aware evidence filter + citation validation (tested)
- [ ] Enable Lovable Cloud (auth, database, storage)
- [ ] Auth: email/password + Google; profiles table
- [ ] Tables: lectures, transcript_segments, materials, material_chunks, conversations, messages (RLS per user)
- [ ] Storage bucket for uploaded materials (private)
- [x] Implement official authorized YouTube caption retrieval, timestamped paste/upload fallback and clear status (20 tests pass; browser upload, errors, real AI fixture answer and citation seek verified)
- [ ] Test lecture-based answers for uKECGJBaOmY — blocked by provider HTTP 429 preventing actual transcript retrieval.
- [ ] Server-side text extraction for PDF / PPTX / DOCX → page chunks
- [ ] Embeddings + retrieval (filter `end <= asked_at` in SQL before ranking)
- [x] AI tutor server function (cites only supplied evidence IDs, refuses when evidence is missing; not streamed)
- [ ] Not now: mock interview feature
