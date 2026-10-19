import type { TranscriptSegment } from "./retrieval";

function seconds(value: string): number {
  const parts = value.replace(",", ".").split(":").map(Number);
  if (parts.length < 2 || parts.length > 3 || parts.some((p) => !Number.isFinite(p) || p < 0)) throw new Error("Invalid timestamp.");
  if ((parts.at(-1) ?? 0) >= 60 || (parts.length === 3 && (parts[1] ?? 0) >= 60)) throw new Error("Invalid timestamp.");
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function clean(text: string) {
  return text.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

/** Parse real cues only. Start-only lines end at the next timestamp, never at an invented duration. */
export function parseTimestampedTranscript(raw: string, videoId: string): { segments: TranscriptSegment[]; warning?: string } {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r/g, "").trim();
  if (!text) throw new Error("The transcript is empty.");
  const stamp = "\\d{1,3}:\\d{2}(?::\\d{2})?(?:[.,]\\d{1,3})?";
  const range = new RegExp(`^(${stamp})\\s*-->\\s*(${stamp})(?:\\s+.*)?$`);
  const startOnly = new RegExp(`^\\[?(${stamp})\\]?\\s*(.*)$`);
  const cues: { start: number; end?: number; lines: string[] }[] = [];
  let current: (typeof cues)[number] | undefined;
  let explicit = false;
  let inMetadata = false;
  const lines = text.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex] ?? "";
    const trimmed = line.trim();
    if (/^(WEBVTT|NOTE|STYLE|REGION)(\s|$)/.test(trimmed)) { inMetadata = true; current = undefined; continue; }
    if (!trimmed) { inMetadata = false; continue; }
    if (inMetadata) continue;
    const timing = trimmed.match(range);
    if (timing?.[1] && timing[2]) {
      explicit = true;
      current = { start: seconds(timing[1]), end: seconds(timing[2]), lines: [] };
      cues.push(current);
      continue;
    }
    if (trimmed.includes("-->")) throw new Error("A caption has an invalid timestamp range.");
    // SRT and VTT cue identifiers immediately precede a range, including non-numeric IDs.
    if (range.test((lines[lineIndex + 1] ?? "").trim())) continue;
    const timingStart = !explicit ? trimmed.match(startOnly) : null;
    if (timingStart?.[1]) {
      current = { start: seconds(timingStart[1]), lines: timingStart[2] ? [timingStart[2]] : [] };
      cues.push(current);
    } else if (current) current.lines.push(trimmed);
    else throw new Error("Use SRT, VTT, or text with a timestamp on each caption (for example 00:12 Caption text).");
  }
  if (!cues.length) throw new Error("No timestamped captions were found.");
  if (cues.length > 5000) throw new Error("This transcript has more than 5,000 captions. Import a shorter section.");
  const segments: TranscriptSegment[] = [];
  let omittedLast = false;
  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    if (!cue) continue;
    if (i > 0 && cue.start < (cues[i - 1]?.start ?? 0)) throw new Error("Caption timestamps must be in chronological order.");
    const end = cue.end ?? cues[i + 1]?.start;
    if (end === undefined) { omittedLast = true; continue; }
    if (end <= cue.start) throw new Error("Each caption must end after it starts.");
    const body = clean(cue.lines.join("\n"));
    if (!body) throw new Error("A timestamped caption has no text.");
    segments.push({ id: `${videoId}:caption:${i}`, start: cue.start, end, text: body });
  }
  if (!segments.length) throw new Error("No complete captions were found. Include start and end times, or at least two timestamped lines.");
  return { segments, ...(omittedLast ? { warning: "The last caption was excluded because its end time is unknown. Import SRT or VTT to include it." } : {}) };
}

export type CaptionFetchResult =
  | { ok: true; segments: TranscriptSegment[]; warning?: string; source: "YouTube captions" }
  | { ok: false; error: string };

/** Official API only: caller-supplied server OAuth authorization must belong to a video editor. */
export async function retrieveAuthorizedCaptions(videoId: string, token: string, request: typeof fetch = fetch): Promise<CaptionFetchResult> {
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const list = await request(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${encodeURIComponent(videoId)}`, { headers, signal: AbortSignal.timeout(20000) });
    if (!list.ok) {
      console.error("YouTube captions list failed", list.status, await list.text());
      return { ok: false, error: list.status === 401 ? "YouTube caption authorization has expired. Reauthorize the video owner's account, or import a transcript." : list.status === 403 ? "YouTube denied caption access. The authorized account must have permission to edit this video. Import an authorized transcript instead." : `YouTube caption retrieval failed (${list.status}). Try again or import a transcript.` };
    }
    const data = await list.json() as { items?: { id?: string; snippet?: { language?: string; status?: string; isDraft?: boolean } }[] };
    const tracks = (data.items ?? []).filter((t) => t.id && t.snippet?.status !== "failed" && !t.snippet?.isDraft);
    const track = tracks.find((t) => t.snippet?.language === "en") ?? tracks[0];
    if (!track?.id) return { ok: false, error: "No downloadable captions were returned for this video. Import a timestamped transcript." };
    const download = await request(`https://www.googleapis.com/youtube/v3/captions/${encodeURIComponent(track.id)}?tfmt=vtt`, { headers, signal: AbortSignal.timeout(20000) });
    if (!download.ok) {
      console.error("YouTube captions download failed", download.status, await download.text());
      return { ok: false, error: download.status === 403 ? "YouTube only permits caption downloads by accounts allowed to edit this video. Import an authorized transcript instead." : `YouTube caption download failed (${download.status}). Try again or import a transcript.` };
    }
    const raw = await download.text();
    if (raw.length > 1000000) return { ok: false, error: "The caption file is too large. Import a shorter transcript section." };
    return { ok: true, ...parseTimestampedTranscript(raw, videoId), source: "YouTube captions" };
  } catch (error) {
    console.error("Caption retrieval failed", error);
    return { ok: false, error: "YouTube captions could not be processed. Retry or import a valid timestamped transcript." };
  }
}