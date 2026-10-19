import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, FileText, Quote, Sparkle } from "lucide-react";
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

const features = [
  { icon: Clock, title: "Timestamp-aware", body: "Ask at 18:42 and the tutor only uses what was said up to 18:42." },
  { icon: Quote, title: "Real citations", body: "Every claim links to a lecture moment or a page in your materials." },
  { icon: FileText, title: "Your materials", body: "Add PDFs, slides, docs, notes and code as separate sources." },
];

function Index() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseYouTubeId(url);
    if (!id) return setError("That doesn't look like a YouTube link.");
    navigate({ to: "/learn", search: { v: id } });
  };

  return (
    <div className="min-h-screen bg-background bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center md:pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkle className="h-3.5 w-3.5 text-primary" /> Your lecture, with a tutor beside it
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-foreground md:text-6xl">
          Pause the lecture.
          <br />
          <span className="text-primary">Ask what you missed.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Paste a YouTube lecture and ask questions at any moment. Answers cite the exact timestamps and pages they came from.
        </p>
        <form onSubmit={submit} className="panel mx-auto mt-10 flex max-w-2xl flex-col gap-2 p-2 sm:flex-row">
          <Input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            placeholder="https://www.youtube.com/watch?v=…"
            className="h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            aria-label="YouTube lecture URL"
          />
          <Button type="submit" variant="hero" className="h-12 px-6">Start learning</Button>
        </form>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-20 grid gap-4 text-left md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="panel p-5">
              <f.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
