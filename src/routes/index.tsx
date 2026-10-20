import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock, FileText, PlayCircle, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { parseYouTubeId } from "@/lib/youtube";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearnFlow — Ask questions at any moment of a lecture" },
      { name: "description", content: "Paste a YouTube lecture, pause anywhere, and get cited answers from an AI tutor that only uses what you've watched." },
      { property: "og:title", content: "LearnFlow — AI tutor for video lectures" },
      { property: "og:description", content: "Timestamp-aware answers with real citations from the lecture and your notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SAMPLE = "https://youtu.be/uKECGJBaOmY";

const features = [
  { icon: Clock, title: "Timestamp-aware", body: "Ask at 18:42 and the tutor only uses what was said up to 18:42 — never spoilers from later." },
  { icon: Quote, title: "Real citations", body: "Every claim links to a lecture moment or a page in your materials. Click to jump there." },
  { icon: FileText, title: "Your materials", body: "Add PDFs, slides, docs, notes and code as clearly separate sources." },
];

function Index() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const go = (value: string) => {
    const id = parseYouTubeId(value);
    if (!id) return setError("That doesn't look like a YouTube link.");
    navigate({ to: "/learn", search: { v: id } });
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    go(url);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-40 -right-32 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      </div>

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <Button variant="ghost" size="sm" onClick={() => go(SAMPLE)} className="gap-1.5">
          <PlayCircle className="h-4 w-4" /> Live demo
        </Button>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 pb-24 pt-12 text-center md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Grounded AI lecture copilot
        </span>

        <h1 className="mx-auto mt-7 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-7xl">
          Pause the lecture.
          <br />
          <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Ask what you missed.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          Paste any YouTube lecture. LearnFlow answers using only what you've watched so far — with clickable citations to the exact second and page.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card/90 p-2 shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--primary)_40%,transparent)] ring-1 ring-primary/10 backdrop-blur sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 pl-3">
            <PlayCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(null); }}
              placeholder="https://www.youtube.com/watch?v=…"
              className="h-12 border-0 bg-transparent px-1 text-base shadow-none focus-visible:ring-0"
              aria-label="YouTube lecture URL"
            />
          </div>
          <Button type="submit" variant="hero" className="group h-12 gap-2 px-6 text-base">
            Start learning <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </form>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <button
          type="button"
          onClick={() => go(SAMPLE)}
          className="mt-4 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          No link handy? Try a sample calculus lecture →
        </button>

        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card/90 p-5 text-left shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--foreground)_35%,transparent)] backdrop-blur">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-primary" /> Paused at 04:55
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Evidence up to 04:55 only
            </span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              Why is u = x and not eˣ here?
            </div>
            <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm text-foreground">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> LearnFlow tutor</p>
              <p className="mt-1.5">Choosing u = x makes du/dx = 1, so the second integral becomes simply ∫eˣ dx. That's the ILATE rule the lecturer used.</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-cite-video px-2 py-0.5 text-xs font-medium text-cite-video-foreground">▶ 04:12</span>
                <span className="rounded-md bg-cite-doc px-2 py-0.5 text-xs font-medium text-cite-doc-foreground">notes.pdf · p.3</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 text-left md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card/80 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
