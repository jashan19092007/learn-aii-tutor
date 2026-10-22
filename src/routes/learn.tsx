
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  LockKeyhole,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Video,
  Wand2,
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
  chunkText,
  type DocumentChunk,
  type Evidence,
  type TranscriptSegment,
} from "@/lib/retrieval";

import { formatTime } from "@/lib/youtube";
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
          "Watch lectures, pause, ask questions, and learn with timestamp-aware AI tutoring.",
      },
      {
        property: "og:title",
        content: "Learning Workspace — LearnFlow AI",
      },
      {
        property: "og:description",
        content: "Interactive AI tutoring with traceable lecture citations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Workspace,
});

const uid = () => Math.random().toString(36).slice(2, 10);

const journey = [
  { label: "Watch", icon: PlayCircle },
  { label: "Pause", icon: Clock3 },
  { label: "Ask", icon: Wand2 },
  { label: "Understand", icon: GraduationCap },
  { label: "Continue", icon: ArrowRight },
];

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

  /*
   * Knowledge Horizon
   *
   * This visual uses transcript timestamps and the
   * current playback position. It does not change
   * the tutor's existing retrieval logic.
   */

  const hasTranscript = transcript.length > 0;

  const lastTranscriptTime = transcript.reduce(
    (latest, segment) => Math.max(latest, segment.start),
    0
  );

  const availableCaptions = transcript.filter(
    (segment) => segment.start <= time
  ).length;

  const futureCaptions =
    transcript.length - availableCaptions;

  const timelineEnd = Math.max(
    lastTranscriptTime,
    time,
    1
  );

  const progress = hasTranscript
    ? Math.max(
        0,
        Math.min(100, (time / timelineEnd) * 100)
      )
    : 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Background ambience */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[650px] overflow-hidden">
        <div className="absolute -left-40 top-16 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090e1c]/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Back to home"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div className="h-7 w-px bg-white/10" />

            <Logo />
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold text-violet-200">
              Interactive Learning Workspace
            </span>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">
              Context-aware tutor
            </span>
            <span className="sm:hidden">AI Tutor</span>
          </span>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1600px] px-4 pb-12 pt-7 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            to="/"
            className="transition-colors hover:text-foreground"
          >
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5" />

          <span className="text-violet-300">
            Learning Workspace
          </span>
        </div>

        {/* Workspace header */}
        <section className="animate-fade-up mb-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" />

                <span className="text-xs font-semibold text-violet-200">
                  Your AI-powered study environment
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Learn with{" "}
                <span className="gradient-text">
                  complete clarity.
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Watch your lecture, pause when you need help,
                and explore explanations grounded in your learning context.
              </p>
            </div>

            {/* Tutor status */}
            <div className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                <GraduationCap className="h-6 w-6 text-violet-300" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  LearnFlow AI
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Ready to assist
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning journey */}
        <section
          className="mb-6 rounded-2xl border border-white/10 bg-card/70 px-4 py-4 shadow-sm sm:px-5"
          aria-label="Learning journey"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="mr-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-300" />

              <span className="text-xs font-semibold">
                Your learning flow
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {journey.map((step, index) => (
                <div
                  key={step.label}
                  className="flex items-center gap-2"
                >
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                  )}

                  <span
                    className={
                      index === 0
                        ? "inline-flex items-center gap-1.5 rounded-lg border border-violet-400/25 bg-violet-500/15 px-3 py-2 text-xs font-semibold text-violet-200"
                        : "inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground"
                    }
                  >
                    <step.icon className="h-3.5 w-3.5" />
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SIGNATURE FEATURE: KNOWLEDGE HORIZON */}
        <section
          className="glow-on-hover relative mb-7 overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-r from-[#111b36] via-[#171a38] to-[#20183d] p-5 shadow-xl shadow-black/10 sm:p-6"
          aria-label="Knowledge Horizon"
        >
          <div className="pointer-events-none absolute -right-16 -top-24 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
                  <LockKeyhole className="h-5 w-5 text-violet-300" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-white sm:text-lg">
                      Knowledge Horizon
                    </h2>

                    <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-200">
                      LearnFlow Exclusive
                    </span>
                  </div>

                  <p className="mt-1 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">
                    Your lecture-context boundary moves with your
                    playback position. Future transcript content stays
                    outside the tutor's current lecture context.
                  </p>
                </div>
              </div>

              {/* Current boundary */}
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                <Clock3 className="h-4 w-4 text-violet-300" />

                <div>
                  <p className="text-[10px] text-slate-400">
                    Current playback
                  </p>

                  <p className="font-mono text-sm font-bold text-white">
                    {formatTime(time)}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Video className="h-3.5 w-3.5 text-blue-300" />
                  Lecture context timeline
                </span>

                <span className="text-xs text-slate-400">
                  {hasTranscript
                    ? `${availableCaptions} of ${transcript.length} captions in context`
                    : "Waiting for transcript"}
                </span>
              </div>

              <div
                className="relative h-3 overflow-visible rounded-full bg-white/10"
                role="progressbar"
                aria-label="Current playback position within available transcript coverage"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                {/* Available lecture context */}
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-[width] duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />

                {/* Boundary indicator */}
                {hasTranscript && (
                  <div
                    className="pointer-events-none absolute top-1/2 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200 bg-white shadow-[0_0_16px_rgba(167,139,250,0.7)] transition-[left] duration-300"
                    style={{
                      left: `${progress}%`,
                    }}
                  />
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-xs text-blue-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Available lecture context
                </span>

                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  {hasTranscript
                    ? `${futureCaptions} future captions excluded`
                    : "Future content excluded"}
                </span>
              </div>
            </div>

            {/* Explanation row */}
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/10 bg-black/15 px-3 py-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

              <p className="text-xs leading-6 text-slate-300">
                <span className="font-semibold text-white">
                  Why this matters:
                </span>{" "}
                Your AI Tutor can explain concepts from the
                lecture without relying on video content
                you haven't reached yet.
              </p>
            </div>
          </div>
        </section>

        {/* Workspace */}
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:gap-6">
          {/* Video, transcript and materials */}
          <div className="min-w-0 space-y-5">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Video className="h-4 w-4 text-blue-300" />
              </div>

              <div>
                <h2 className="text-sm font-bold">
                  Your learning content
                </h2>

                <p className="text-xs text-muted-foreground">
                  Lecture, transcript and resources
                </p>
              </div>
            </div>

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

          {/* AI Tutor */}
          <aside
            className="min-w-0 lg:sticky lg:top-[88px] lg:h-[calc(100vh-108px)]"
            aria-label="AI Tutor"
          >
            <div className="flex h-full min-h-0 flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold">
                      Your AI companion
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Ask, explore and understand
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold text-violet-200">
                  AI Tutor
                </span>
              </div>

              <div className="min-h-0 flex-1">
                <ChatPanel
                  messages={messages}
                  currentTime={time}
                  onAsk={onAsk}
                  onCite={onCite}
                  pending={pending}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom information */}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-violet-300" />

            <p className="text-xs leading-relaxed text-muted-foreground">
              AI-generated explanations should be
              checked against their cited sources.
            </p>
          </div>

          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-4 w-4 text-violet-300" />
            LearnFlow — Learn at your own pace
          </span>
        </footer>
      </main>
    </div>
  );
}
