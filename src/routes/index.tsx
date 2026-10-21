import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, FileText, PlayCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { parseYouTubeId } from "@/lib/youtube";
import learningMesh from "@/assets/learning-mesh.jpg";

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
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img src={learningMesh} alt="" width={1536} height={1024} className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-right opacity-20 md:opacity-100" />
        <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-ink-foreground/15 bg-ink/80 px-6 py-5 md:px-10">
          <Logo />
          <Button variant="ghost" size="sm" onClick={() => go(SAMPLE)} className="gap-2 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground">
            <PlayCircle /> Try a lecture <ArrowUpRight />
          </Button>
        </header>

        <main className="mx-auto max-w-6xl px-6 pb-14 pt-12 md:px-10 md:pb-16 md:pt-14">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Your personal AI study companion
            </p>
            <h1 className="mt-5 font-display text-6xl font-semibold leading-none tracking-normal sm:text-7xl md:text-8xl">LearnFlow<span className="text-accent">.</span></h1>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-medium leading-tight tracking-normal sm:text-4xl">
              Less rewinding.<br /><span className="text-accent">More understanding.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-foreground/70 sm:text-base">
              Turn a YouTube lecture into a conversation. Pause, ask a question, and find your way forward.
            </p>

            <form onSubmit={submit} className="mt-7 flex max-w-xl flex-col gap-2 rounded-lg bg-card p-2 shadow-panel sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-2 pl-2 text-foreground">
                <PlayCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                <Input value={url} onChange={(e) => { setUrl(e.target.value); setError(null); }} placeholder="Paste a YouTube lecture link" className="h-11 min-w-0 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0" aria-label="YouTube lecture URL" />
              </div>
              <Button type="submit" variant="default" className="group h-11 gap-2 px-5">
                Start learning <ArrowRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Button>
            </form>
            {error && <p role="alert" className="mt-3 rounded-md bg-card px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="button" variant="link" onClick={() => go(SAMPLE)} className="mt-2 h-auto px-0 py-2 text-xs text-ink-foreground/70 hover:text-ink-foreground">
              Or explore a sample lecture <ArrowUpRight />
            </Button>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink-foreground/15 pt-5 text-xs text-ink-foreground/65">
            <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-accent" /> In sync with your lecture</span>
            <span className="flex items-center gap-2"><Quote className="h-3.5 w-3.5 text-accent" /> Sources you can trace</span>
            <span className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-accent" /> Your notes, connected</span>
          </div>
        </main>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-normal">Stay curious. Keep your flow.</h2>
          <span className="text-xs text-muted-foreground">A little clarity goes a long way.</span>
        </div>
        <div className="grid gap-7 md:grid-cols-3 md:gap-10">
          {features.map((f, i) => (
            <div key={f.title} className="border-t border-border pt-5">
              <div className="flex items-center justify-between"><f.icon className="h-5 w-5 text-primary" /><span className="font-mono text-xs text-muted-foreground">0{i + 1}</span></div>
              <h3 className="mt-4 font-display text-base font-semibold tracking-normal">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-border px-6 py-5 text-xs text-muted-foreground md:px-10">
        <span>LearnFlow</span><span>Made for the moment it clicks.</span>
      </footer>
    </div>
  );
}
