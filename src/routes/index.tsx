
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  MessageCircle,
  Play,
  PlayCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { parseYouTubeId } from "@/lib/youtube";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "LearnFlow AI — Turn lectures into understanding",
      },
      {
        name: "description",
        content:
          "Watch a YouTube lecture, pause anywhere, and ask your AI tutor questions with timestamped lecture citations.",
      },
      {
        property: "og:title",
        content: "LearnFlow AI — Your AI learning companion",
      },
      {
        property: "og:description",
        content:
          "Watch. Pause. Ask. Understand. Learn with timestamp-aware AI tutoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SAMPLE = "https://youtu.be/uKECGJBaOmY";

const features = [
  {
    icon: Clock3,
    number: "01",
    title: "Context-aware learning",
    body: "Ask a question at any point in a lecture. LearnFlow uses the available lecture context up to your playback position.",
    color: "from-blue-500/20 to-cyan-500/5",
  },
  {
    icon: Quote,
    number: "02",
    title: "Traceable explanations",
    body: "Explore relevant lecture timestamps and jump back to the source whenever you want to revisit a concept.",
    color: "from-violet-500/20 to-fuchsia-500/5",
  },
  {
    icon: FileText,
    number: "03",
    title: "Your learning materials",
    body: "Bring your notes and supported text-based resources into the same workspace for a more connected learning experience.",
    color: "from-cyan-500/20 to-blue-500/5",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste a lecture",
    body: "Start with a YouTube lecture link.",
    icon: PlayCircle,
  },
  {
    number: "02",
    title: "Pause and ask",
    body: "Ask about a concept when you need clarity.",
    icon: MessageCircle,
  },
  {
    number: "03",
    title: "Understand and continue",
    body: "Explore the explanation and return to learning.",
    icon: GraduationCap,
  },
];

function Index() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const go = (value: string) => {
    const id = parseYouTubeId(value);

    if (!id) {
      setError("Please enter a valid YouTube video link.");
      return;
    }

    setError(null);
    navigate({ to: "/learn", search: { v: id } });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    go(url);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b17] text-white">
      {/* Navigation */}
      <header className="relative z-20 border-b border-white/10 bg-[#070b17]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 p-2 shadow-lg shadow-violet-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              LearnFlow
              <span className="text-violet-400">.</span>
              <span className="ml-1 text-xs font-semibold text-violet-300">
                AI
              </span>
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
          </div>

          <button
            type="button"
            onClick={() => go(SAMPLE)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-violet-400/50 hover:bg-white/15 sm:px-4 sm:text-sm"
          >
            Try demo
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[110px]" />
          <div className="absolute right-[-140px] top-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute bottom-[-160px] left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage:
                "linear-gradient(to bottom,black,transparent)",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 text-center sm:px-8 sm:pt-24 lg:pt-28">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-xs font-semibold text-violet-200 shadow-lg shadow-violet-900/10">
            <Sparkles className="h-3.5 w-3.5" />
            Meet your AI-powered learning companion
            <ChevronRight className="h-3.5 w-3.5" />
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
            Stop just watching.
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Start understanding.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Turn passive video lectures into interactive learning.
            Pause at any moment, ask questions, and get AI-powered
            explanations connected to your lecture.
          </p>

          <form
            onSubmit={submit}
            className="mx-auto mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/[0.08] p-2 shadow-2xl shadow-blue-950/50 backdrop-blur-xl sm:flex-row"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <PlayCircle className="h-5 w-5 shrink-0 text-violet-300" />
              <Input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                placeholder="Paste a YouTube lecture link..."
                aria-label="YouTube lecture URL"
                className="h-12 min-w-0 border-0 bg-transparent px-0 text-sm text-white placeholder:text-slate-400 shadow-none focus-visible:ring-0"
              />
            </div>

            <button
              type="submit"
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:from-blue-400 hover:to-violet-500"
            >
              Start learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {error && (
            <p
              role="alert"
              className="mx-auto mt-3 max-w-2xl rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={() => go(SAMPLE)}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              <Play className="h-4 w-4 text-violet-300" />
              Explore a sample lecture
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <span className="hidden h-4 w-px bg-white/20 sm:block" />

            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              No account required to try
            </span>
          </div>

          {/* Product preview */}
          <div
            id="experience"
            className="relative mx-auto mt-20 max-w-6xl scroll-mt-24"
          >
            <div className="pointer-events-none absolute -inset-5 rounded-[32px] bg-gradient-to-r from-blue-500/15 via-violet-500/20 to-cyan-500/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0e1528] text-left shadow-2xl shadow-black/40 sm:rounded-3xl">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 text-xs font-medium text-slate-400">
                    LearnFlow Workspace
                  </span>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                  Product preview
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1.45fr_1fr]">
                {/* Preview video */}
                <div className="border-b border-white/10 p-4 sm:p-6 lg:border-b-0 lg:border-r">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-500/15 p-2">
                        <PlayCircle className="h-4 w-4 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Lecture Player
                        </p>
                        <p className="text-xs text-slate-400">
                          Learn at your own pace
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                      12:48 / 28:30
                    </span>
                  </div>

                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#15234a] via-[#131a38] to-[#261746]">
                    <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl" />

                    <div className="relative flex flex-col items-center gap-4 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur">
                        <Play className="ml-1 h-7 w-7 text-white" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Your lecture, reimagined
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Watch · Pause · Understand
                        </p>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div className="h-full w-[45%] bg-gradient-to-r from-blue-400 to-violet-400" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                      Timestamp-aware
                    </span>
                    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                      Lecture context
                    </span>
                    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                      Source citations
                    </span>
                  </div>
                </div>

                {/* Preview tutor */}
                <div className="flex flex-col p-4 sm:p-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
                      <Sparkles className="h-5 w-5 text-violet-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        AI Tutor
                      </p>
                      <p className="text-xs text-slate-400">
                        Context-aware assistance
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-center gap-4 py-6">
                    <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm text-white">
                      Can you explain this concept simply?
                    </div>

                    <div className="max-w-[95%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-violet-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        LearnFlow AI
                      </div>
                      <p className="text-sm leading-6 text-slate-300">
                        Absolutely. Let's break it down into
                        simpler steps and connect it to what
                        you've just watched.
                      </p>

                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-violet-400/20 bg-violet-400/10 px-2.5 py-1.5 text-xs text-violet-200">
                        <PlayCircle className="h-3.5 w-3.5" />
                        12:48 · Lecture reference
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-xs text-slate-500">
                      Ask your next question...
                    </span>
                    <ArrowRight className="h-4 w-4 text-violet-300" />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              Illustrative product preview · Open a lecture to try the real workspace
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-24 border-t border-white/10 bg-[#0a1020] px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              Why LearnFlow
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Everything you need to
              <br />
              <span className="text-slate-400">
                learn with clarity.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400">
              Built to make learning more interactive,
              more focused, and easier to revisit.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06] sm:p-7"
              >
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${feature.color} blur-3xl`}
                />

                <div className="relative">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                      <feature.icon className="h-6 w-6 text-violet-300" />
                    </div>
                    <span className="font-mono text-xs text-slate-500">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {feature.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-white/10 px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              Simple by design
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Three steps to better learning.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              No complicated setup. Just bring a lecture
              and start learning.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-[#10182b] p-7"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <step.icon className="h-6 w-6" />
                  </div>

                  <span className="text-3xl font-bold text-white/10">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-20 pt-5 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#182451] via-[#151b3c] to-[#28194d] px-6 py-14 text-center sm:px-10 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Zap className="h-7 w-7 text-violet-200" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to learn differently?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Your next breakthrough might be one question away.
              Turn your next lecture into an interactive experience.
            </p>

            <button
              type="button"
              onClick={() => go(SAMPLE)}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#151b3c] transition hover:bg-violet-100"
            >
              Experience LearnFlow
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              LearnFlow<span className="text-violet-400">.</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Learn smarter. Stay curious.
            </p>
          </div>

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            AI-generated explanations should be verified against sources.
          </p>
        </div>
      </footer>
    </div>
  );
}
