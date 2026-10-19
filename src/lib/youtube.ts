export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return valid(u.pathname.slice(1));
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.searchParams.get("v")) return valid(u.searchParams.get("v")!);
      const m = u.pathname.match(/^\/(embed|shorts|live|v)\/([\w-]{11})/);
      if (m) return m[2] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

function valid(id: string) {
  return /^[\w-]{11}$/.test(id) ? id : null;
}

export function formatTime(total: number) {
  const t = Math.max(0, Math.floor(total));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
