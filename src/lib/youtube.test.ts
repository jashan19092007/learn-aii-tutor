import { describe, expect, it } from "vitest";
import { formatTime, parseYouTubeId } from "./youtube";

describe("youtube helpers", () => {
  it("parses common URL shapes", () => {
    expect(parseYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("not a url")).toBeNull();
  });
  it("formats 18:42", () => {
    expect(formatTime(18 * 60 + 42)).toBe("18:42");
  });
});
