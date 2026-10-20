# LearnFlow roadmap

- [ ] Connect saved YouTubeTranscript.dev key via existing transcript function and test one real retrieval; no Cloud, database or UI changes.

- [x] App structure: landing, lecture workspace (player, tutor chat, materials, quick actions, citation chips)
- [x] Timestamp-aware evidence filter + citation validation (tested)
- [ ] Enable Lovable Cloud (auth, database, storage)
- [ ] Auth: email/password + Google; profiles table
- [ ] Tables: lectures, transcript_segments, materials, material_chunks, conversations, messages (RLS per user)
- [ ] Storage bucket for uploaded materials (private)
- [x] Implement official authorized YouTube caption retrieval, timestamped paste/upload fallback and clear status (20 tests pass; browser upload, errors, real AI fixture answer and citation seek verified)
- [ ] Retrieve actual captions and test lecture-based answers for uKECGJBaOmY — blocked by missing owner/editor OAuth authorization or authorized transcript file
- [ ] Server-side text extraction for PDF / PPTX / DOCX → page chunks
- [ ] Embeddings + retrieval (filter `end <= asked_at` in SQL before ranking)
- [x] AI tutor server function (cites only supplied evidence IDs, refuses when evidence is missing; not streamed)
- [ ] Not now: mock interview feature
