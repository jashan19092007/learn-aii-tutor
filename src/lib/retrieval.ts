// Timestamp-aware evidence selection. This is the core safety rule of LearnFlow:
// transcript evidence spoken after the student's pause point must never reach the tutor.

export type TranscriptSegment = { id: string; start: number; end: number; text: string };

export type DocumentChunk = {
  id: string;
  materialId: string;
  materialName: string;
  page: number;
  text: string;
};

export type Evidence =
  | { kind: "video"; id: string; start: number; end: number; text: string }
  | { kind: "document"; id: string; materialName: string; page: number; text: string };

/** Only segments that have fully finished by `cutoffSeconds` are eligible. */
export function eligibleTranscript(segments: TranscriptSegment[], cutoffSeconds: number) {
  if (!Number.isFinite(cutoffSeconds) || cutoffSeconds <= 0) return [];
  return segments.filter((s) => s.end <= cutoffSeconds);
}

export function buildEvidence(
  segments: TranscriptSegment[],
  chunks: DocumentChunk[],
  cutoffSeconds: number,
): Evidence[] {
  const video: Evidence[] = eligibleTranscript(segments, cutoffSeconds).map((s) => ({
    kind: "video",
    id: s.id,
    start: s.start,
    end: s.end,
    text: s.text,
  }));
  const docs: Evidence[] = chunks.map((c) => ({
    kind: "document",
    id: c.id,
    materialName: c.materialName,
    page: c.page,
    text: c.text,
  }));
  return [...video, ...docs];
}

/** Drop any citation the model returns that does not point at real supplied evidence. */
export function validateCitations(citedIds: string[], evidence: Evidence[]) {
  const known = new Map(evidence.map((e) => [e.id, e]));
  return citedIds.filter((id) => known.has(id)).map((id) => known.get(id)!);
}

/** Split plain-text materials into numbered "pages" so citations can reference them. */
export function chunkText(
  materialId: string,
  materialName: string,
  text: string,
  linesPerPage = 40,
): DocumentChunk[] {
  const lines = text.split(/\r?\n/);
  const out: DocumentChunk[] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    const body = lines.slice(i, i + linesPerPage).join("\n").trim();
    if (!body) continue;
    const page = Math.floor(i / linesPerPage) + 1;
    out.push({ id: `${materialId}:p${page}`, materialId, materialName, page, text: body });
  }
  return out;
}
