
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  VideoPlayer,
  type VideoPlayerHandle,
} from "@/components/learn/VideoPlayer";
import {
  ChatPanel,
  type ChatMessage,
} from "@/components/learn/ChatPanel";
import {
  MaterialsPanel,
  kindOf,
  type Material,
} from "@/components/learn/MaterialsPanel";
import {
  buildEvidence,
  chunkText,
  type DocumentChunk,
  type Evidence,
  type TranscriptSegment,
} from "@/lib/retrieval";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { askTutor } from "@/lib/tutor.functions";
import { TranscriptPanel } from "@/components/learn/TranscriptPanel";

export const Route = createFileRoute("/learn")({
  validateSearch: z.object({
    v: z.string().regex(/^[\w-]{11}$/),
  }),
  head: () => ({
    meta: [
      { title: "Learning Workspace — LearnFlow AI" },
      {
        name: "description",
        content:
          "Watch lectures, pause and ask your AI tutor about what you've learned.",
      },
      {
        property: "og:title",
        content: "Learning Workspace — LearnFlow AI",
      },
      {
        property: "og:description",
        content: "Timestamp-aware AI tutoring with cited sources.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Workspace,
});

const uid = () => Math.random().toString(36).slice(2, 10);

function Workspace() {
  const { v } = Route.useSearch();

  const player = useRef<VideoPlayerHandle>(null);

  const [time, setTime] = useState(0);
  const onTime = useCallback((t: number) => setTime(t), []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);

  const onTranscript = useCallback(
    (segments: TranscriptSegment[]) => {
      setTranscript(segments);
      setMessages([]);
    },
    []
  );

  const onFiles = async (files: FileList) => {
    for (const f of Array.from(files)) {
      const kind = kindOf(f.name);

      if (!kind) {
        toast.error(`${f.name}: unsupported file type`);
        continue;
      }

      const id = uid();

      if (kind === "text" || kind === "code") {
        const c = chunkText(id, f.name, await f.text());

        setChunks((x) => [...x, ...c]);

        setMaterials((x) => [
          ...x,
          {
            id,
            name: f.name,
            kind,
            size: f.size,
            status: "ready",
            pages: c.length,
          },
        ]);
      } else {
        setMaterials((x) => [
          ...x,
          {
            id,
            name: f.name,
            kind,
            size: f.size,
            status: "needs-processing",
            pages: 0,
          },
        ]);
      }
    }
  };

  const ask = useServerFn(askTutor);
  const [pending, setPending] = useState(false);

  const onAsk = async (text: string) => {
    if (pending) return;

    player.current?.pause();

    const askedAt = player.current?.getTime() ?? time;
    setTime(askedAt);

    const history = messages
      .filter(
        (m) => m.role === "user" || m.role === "assistant"
      )
      .slice(-10)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        text: m.text,
        askedAt: m.askedAt,
      }));

    setMessages((m) => [
      ...m,
      {
        id: uid(),
        role: "user",
        text,
        askedAt,
      },
    ]);

    setPending(true);

    try {
      const res = await ask({
        data: {
          question: text,
          askedAt,
          transcript,
          chunks,
          history,
        },
      });

      setMessages((m) => [
        ...m,
        res.ok
          ? {
              id: uid(),
              role: "assistant",
              text: res.answer,
              citations: res.citations,
              askedAt,
            }
          : {
              id: uid(),
              role: "notice",
              text: res.error,
            },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "notice",
          text:
            "Couldn't reach the tutor. Check your connection and try again.",
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const onCite = (e: Evidence) => {
    if (e.kind === "video") {
      player.current?.pause();
      player.current?.seek(e.start);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="rounded-xl"
              aria-label="Back to home"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div className="h-6 w-px bg-border" />

            <Logo />
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Learning Workspace
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 pb-12 pt-6 sm:px-6">
        {/* Workspace introduction */}
        <section className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link
              to="/"
              className="transition-colors hover:text-foreground"
            >
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="text-foreground">
              Learning Workspace
            </span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                AI-powered learning
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Your learning workspace
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Watch your lecture, pause when something is
                unclear, and learn with your AI Tutor.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
              <GraduationCap className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs font-semibold text-foreground">
                  LearnFlow AI
                </p>
                <p className="text-xs text-muted-foreground">
                  Your personal study companion
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning journey */}
        <section
          className="mb-6 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:px-5"
          aria-label="How LearnFlow works"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="mr-2 flex items-center gap-2 text-xs font-semibold text-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              Learning flow
            </span>

            {[
              "Watch",
              "Pause",
              "Ask",
              "Understand",
              "Continue",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3"
              >
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                )}

                <span
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Workspace columns */}
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:gap-6">
          {/* Left: learning content */}
          <div className="min-w-0 space-y-5">
            <VideoPlayer
              ref={player}
              videoId={v}
              onTime={onTime}
            />

            <TranscriptPanel
              videoId={v}
              transcript={transcript}
              currentTime={time}
              onTranscript={onTranscript}
            />

            <MaterialsPanel
              materials={materials}
              onFiles={onFiles}
              onRemove={(id) => {
                setMaterials((x) =>
                  x.filter((m) => m.id !== id)
                );

                setChunks((x) =>
                  x.filter((c) => c.materialId !== id)
                );
              }}
            />
          </div>

          {/* Right: AI tutor */}
          <aside
            className="min-w-0 lg:sticky lg:top-[88px] lg:h-[calc(100vh-108px)]"
            aria-label="AI Tutor"
          >
            <ChatPanel
              messages={messages}
              currentTime={time}
              onAsk={onAsk}
              onCite={onCite}
              pending={pending}
            />
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Review source citations when studying with AI.
          </p>

          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <PlayCircle className="h-4 w-4" />
            Watch. Pause. Ask. Understand.
          </span>
        </footer>
      </main>
    </div>
  );
}
