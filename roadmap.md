# LearnFlow roadmap

- [x] App structure: landing, lecture workspace (player, tutor chat, materials, quick actions, citation chips)
- [x] Timestamp-aware evidence filter + citation validation (tested)
- [ ] Enable Lovable Cloud (auth, database, storage)
- [ ] Auth: email/password + Google; profiles table
- [ ] Tables: lectures, transcript_segments, materials, material_chunks, conversations, messages (RLS per user)
- [ ] Storage bucket for uploaded materials (private)
- [ ] Retrieve permitted YouTube captions, add timestamped paste/upload fallback and clear status
- [ ] Test transcript → tutor → clickable timestamp using the user's existing video (video URL needed)
- [ ] Server-side text extraction for PDF / PPTX / DOCX → page chunks
- [ ] Embeddings + retrieval (filter `end <= asked_at` in SQL before ranking)
- [x] AI tutor server function (cites only supplied evidence IDs, refuses when evidence is missing; not streamed)
- [ ] Not now: mock interview feature
