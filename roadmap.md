# LearnFlow AI | Roadmap

**Production URL:** https://learnflow-ai-one.vercel.app/  
**Repository:** https://github.com/jashan19092007/learn-aii-tutor

## Implemented or previously reported in development

- [x] Lecture workspace with YouTube player, transcript, materials, and AI Tutor chat
- [x] Timestamp-aware transcript filtering and citation validation
- [x] YouTubeTranscript.dev captions-only integration
- [x] Development retrieval for video `uKECGJBaOmY` (193 captions)
- [x] Transcript rate-limit handling, request deduplication, and five-minute success cache
- [x] Manual transcript import using supported timestamped formats
- [x] Gemini server-side AI Tutor integration
- [x] Knowledge Horizon context visualization
- [x] Vercel production domain configured
- [x] README, API, and deployment documentation updated for Vercel

## Verification still required on Vercel

- [ ] Confirm public website and lecture navigation
- [ ] Confirm transcript retrieval with a real video
- [ ] Confirm successful Gemini AI Tutor answer
- [ ] Confirm lecture citations seek to correct timestamps
- [ ] Confirm future transcript content is excluded from lecture evidence
- [ ] Confirm Knowledge Horizon tracks playback correctly
- [ ] Confirm manual transcript import
- [ ] Confirm supported learning-material handling
- [ ] Confirm mobile usability
- [ ] Record reproducible results in `docs/TESTING_REPORT.md`

## Future scope

- [ ] AI-powered mock interview extension
- [ ] Speech-to-text fallback for videos without captions
- [ ] Robust server-side PDF/PPTX/DOCX extraction
- [ ] User authentication and profiles
- [ ] Persistent lectures, conversations, and material storage
- [ ] Personalized learning analytics and adaptive quizzes

## Development notes

The repository retains a Lovable connection and may sync commits to its editor. **Vercel is the documented production deployment.** Historical Lovable integration notes in `AGENTS.md` should remain accurate. Avoid rewriting published Git history.
