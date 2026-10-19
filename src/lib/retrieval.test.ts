import { describe, expect, it } from "vitest";
import { buildEvidence, eligibleTranscript, validateCitations, type TranscriptSegment } from "./retrieval";

const at = (m: number, s: number) => m * 60 + s;
const segs: TranscriptSegment[] = [
  { id: "a", start: at(18, 0), end: at(18, 30), text: "before" },
  { id: "b", start: at(18, 30), end: at(18, 50), text: "straddles 18:42" },
  { id: "c", start: at(18, 43), end: at(19, 0), text: "after" },
];

describe("timestamp-aware retrieval", () => {
  it("at 18:42 excludes transcript spoken after 18:42", () => {
    const ids = eligibleTranscript(segs, at(18, 42)).map((s) => s.id);
    expect(ids).toEqual(["a"]);
  });

  it("excludes a segment that is still in progress at the pause point", () => {
    expect(eligibleTranscript(segs, at(18, 42)).some((s) => s.id === "b")).toBe(false);
  });

  it("returns no transcript evidence at 0:00", () => {
    expect(eligibleTranscript(segs, 0)).toEqual([]);
  });

  it("keeps study materials as separate document sources", () => {
    const ev = buildEvidence(segs, [{ id: "d:p1", materialId: "d", materialName: "notes.txt", page: 1, text: "x" }], at(18, 42));
    expect(ev.map((e) => e.kind)).toEqual(["video", "document"]);
  });

  it("drops citations that do not match supplied evidence", () => {
    const ev = buildEvidence(segs, [], at(18, 42));
    expect(validateCitations(["a", "c", "made-up"], ev).map((e) => e.id)).toEqual(["a"]);
  });
});
