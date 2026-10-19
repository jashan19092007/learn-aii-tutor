import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parseTimestampedTranscript, retrieveAuthorizedCaptions, type CaptionFetchResult } from "./transcript.server";

const VideoId = z.string().regex(/^[\w-]{11}$/);

export const getVideoTranscript = createServerFn({ method: "POST" })
  .inputValidator((input: { videoId: string }) => z.object({ videoId: VideoId }).parse(input))
  .handler(async ({ data }): Promise<CaptionFetchResult> => {
    const token = process.env['YOUTUBE_CAPTIONS_ACCESS_TOKEN'];
    if (!token) return { ok: false, error: "Automatic captions require authorization from an account allowed to edit this YouTube video. Paste or upload an authorized timestamped transcript below." };
    // This public function may expose only videos the owner explicitly approved for public use.
    const approvedVideos = (process.env['YOUTUBE_CAPTIONS_VIDEO_IDS'] ?? "").split(",").map((id) => id.trim());
    if (!approvedVideos.includes(data.videoId)) return { ok: false, error: "This video has not been approved for automatic caption access. Import an authorized timestamped transcript instead." };
    return retrieveAuthorizedCaptions(data.videoId, token);
  });

export const importVideoTranscript = createServerFn({ method: "POST" })
  .inputValidator((input: { videoId: string; text: string }) => z.object({ videoId: VideoId, text: z.string().min(1).max(1000000) }).parse(input))
  .handler(async ({ data }) => {
    try { return { ok: true as const, ...parseTimestampedTranscript(data.text, data.videoId) }; }
    catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : "The transcript could not be processed." }; }
  });