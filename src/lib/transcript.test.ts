import { describe, expect, it, vi } from "vitest";
import { parseTimestampedTranscript, retrieveAuthorizedCaptions } from "./transcript.server";
import { eligibleTranscript, validateCitations, buildEvidence } from "./retrieval";

const srt = "1\n00:18:00,000 --> 00:18:30,000\nbefore\n\n2\n00:18:30,000 --> 00:18:50,000\nstraddles\n\n3\n00:18:43,000 --> 00:19:00,000\nafter";
describe("timestamped caption ingestion", () => {
  it("parses actual SRT ranges and excludes unfinished and future captions at 18:42", () => {
    const { segments } = parseTimestampedTranscript(srt, "uKECGJBaOmY");
    expect(segments[0]).toEqual({ id: "uKECGJBaOmY:caption:0", start: 1080, end: 1110, text: "before" });
    expect(eligibleTranscript(segments, 1122).map((s) => s.text)).toEqual(["before"]);
    expect(eligibleTranscript(segments, 1110).map((s) => s.text)).toEqual(["before"]);
  });
  it("parses VTT settings without caption markup", () => {
    expect(parseTimestampedTranscript("WEBVTT\n\n00:01.500 --> 00:04.000 align:start\n<v Teacher>Hello &amp; welcome</v>", "uKECGJBaOmY").segments[0]).toMatchObject({ start: 1.5, end: 4, text: "Hello & welcome" });
  });
  it("uses next timestamp as a conservative end and excludes unknown final end", () => {
    const parsed = parseTimestampedTranscript("0:00\nfirst\n0:12 second\n0:25 last", "uKECGJBaOmY");
    expect(parsed.segments.map((s) => [s.start, s.end, s.text])).toEqual([[0, 12, "first"], [12, 25, "second"]]);
    expect(parsed.warning).toBeTruthy();
  });
  it.each(["untimed text", "00:12 --> 00:10\nbackwards", "0:70 text\n1:30 next", "1:00 first\n0:30 second", "0:12 only"])('rejects unusable timing: %s', (text) => {
    expect(() => parseTimestampedTranscript(text, "uKECGJBaOmY")).toThrow();
  });
  it("returns only supplied eligible video citations", () => {
    const { segments } = parseTimestampedTranscript(srt, "uKECGJBaOmY");
    const evidence = buildEvidence(segments, [], 1122);
    expect(validateCitations(["uKECGJBaOmY:caption:0", "uKECGJBaOmY:caption:2", "fake"], evidence)).toEqual([evidence[0]]);
  });
  it("uses only the official caption list and download APIs", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ items: [{ id: "track", snippet: { language: "hi", status: "serving" } }] })).mockResolvedValueOnce(new Response(srt));
    const result = await retrieveAuthorizedCaptions("uKECGJBaOmY", "test-only-token", request);
    expect(request.mock.calls[0]?.[0]).toBe("https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=uKECGJBaOmY");
    expect(request.mock.calls[1]?.[0]).toBe("https://www.googleapis.com/youtube/v3/captions/track?tfmt=vtt");
    expect(result.ok && result.segments.length).toBe(3);
  });
  it("does not attempt alternate scraping when permission is denied", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response("insufficientPermissions", { status: 403 }));
    const result = await retrieveAuthorizedCaptions("uKECGJBaOmY", "test-only-token", request);
    expect(result.ok).toBe(false);
    expect(request).toHaveBeenCalledTimes(1);
  });
});