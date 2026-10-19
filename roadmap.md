# LearnFlow roadmap

- [x] App structure: landing, lecture workspace (player, tutor chat, materials, quick actions, citation chips)
- [x] Timestamp-aware evidence filter + citation validation (tested)
- [ ] Enable Lovable Cloud (auth, database, storage)
- [ ] Auth: email/password + Google; profiles table
- [ ] Tables: lectures, transcript_segments, materials, material_chunks, conversations, messages (RLS per user)
- [ ] Storage bucket for uploaded materials (private)
- [ ] Transcript ingestion server function (YouTube captions → timed segments)
- [ ] Server-side text extraction for PDF / PPTX / DOCX → page chunks
- [ ] Embeddings + retrieval (filter `end <= asked_at` in SQL before ranking)
- [x] AI tutor server function (cites only supplied evidence IDs, refuses when evidence is missing; not streamed)
- [ ] Not now: mock interview feature
