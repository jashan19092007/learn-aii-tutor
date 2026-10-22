
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  LockKeyhole,
  MessageCircle,
  Play,
  PlayCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { parseYouTubeId } from "@/lib/youtube";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "LearnFlow AI — Stop watching. Start understanding.",
      },
      {
        name: "description",
        content:
          "Turn YouTube lectures into interactive learning with timestamp-aware AI tutoring and source citations.",
      },
      {
        property: "og:title",
        content: "LearnFlow AI — Your AI Learning Companion",
      },
      {
        property: "og:description",
        content:
          "Watch. Pause. Ask. Understand. Continue.",
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
    title: "Timestamp-aware AI",
    description:
      "Your AI Tutor uses lecture context up to your current playback position.",
    gradient: "from-blue-500/20 to-cyan-500/5",
  },
  {
    icon: Quote,
    number: "02",
    title: "Traceable explanations",
    description:
      "Explore cited lecture moments and revisit the source of an explanation.",
    gradient: "from-violet-500/20 to-purple-500/5",
  },
  {
    icon: FileText,
    number: "03",
    title: "Connected learning",
    description:
      "Bring supported notes and learning resources into one focused workspace.",
    gradient: "from-cyan-500/20 to-indigo-500/5",
  },
];

const steps = [
  {
    number: "01",
    title: "Watch",
    description: "Paste a YouTube lecture and start learning.",
    icon: PlayCircle,
  },
  {
    number: "02",
    title: "Ask",
    description: "Pause anywhere and ask what you want to understand.",
    icon: MessageCircle,
  },
  {
    number: "03",
    title: "Understand",
    description: "Explore an explanation and continue watching.",
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
    navigate({
      to: "/learn",
      search: { v: id },
    });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    go(url);
  };

  // Lightweight scroll-reveal animations.
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      "[data-lf-reveal]"
    );

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    elements.forEach((el) => {
      el.classList.add("lf-reveal-hidden");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lf-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();

      elements.forEach((el) => {
        el.classList.remove(
          "lf-reveal-hidden",
          "lf-reveal-visible"
        );
      });
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b17] text-white">
      {/* Landing-page animations */}
      <style>{`
        @keyframes lfFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes lfGlow {
          0%, 100% { opacity: .45; }
          50% { opacity: .85; }
        }

        @keyframes lfProgress {
          from { width: 0%; }
          to { width: 45%; }
        }

        @keyframes lfAppear {
          from {
            opacity: 0;
            transform: translateY(15px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .lf-float {
          animation: lfFloat 7s ease-in-out infinite;
        }

        .lf-glow {
          animation: lfGlow 5s ease-in-out infinite;
        }

        .lf-progress {
          animation: lfProgress 2s ease-out both;
        }

        .lf-chat-one {
          animation: lfAppear .6s ease-out .5s both;
        }

        .lf-chat-two {
          animation: lfAppear .7s ease-out 1.1s both;
        }

        .lf-reveal-hidden {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity .7s ease,
            transform .7s cubic-bezier(.2,.8,.2,1);
        }

        .lf-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .lf-float,
          .lf-glow,
          .lf-progress,
          .lf-chat-one,
          .lf-chat-two {
            animation: none !important;
            opacity: 1 !important;
          }

          .lf-reveal-hidden {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b17]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-500/25">
              <Sparkles className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              LearnFlow
              <span className="text-violet-400">.</span>
              <span className="ml-1 text-xs font-semibold text-violet-300">
                AI
              </span>
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
          </nav>

          <button
            type="button"
            onClick={() => go(SAMPLE)}
            className="hover-lift inline-flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-400/10 px-4 py-2.5 text-xs font-semibold text-violet-100 transition hover:bg-violet-400/20 sm:text-sm"
          >
            Launch Demo
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {/* Background lighting */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="lf-glow absolute -left-48 top-0 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[130px]" />

          <div className="lf-glow absolute -right-40 top-24 h-[550px] w-[550px] rounded-full bg-violet-600/20 blur-[130px]" />

          <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[120px]" />

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)",
              backgroundSize: "55px 55px",
              maskImage:
                "linear-gradient(to bottom,black,transparent)",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 text-center sm:px-8 sm:pt-28">
          <div className="animate-fade-up mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-xs font-semibold text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            A smarter way to learn
            <ChevronRight className="h-3.5 w-3.5" />
          </div>

          <h1
            className="animate-fade-up mx-auto max-w-5xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "100ms" }}
          >
            Every lecture deserves
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              a better understanding.
            </span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg"
            style={{ animationDelay: "200ms" }}
          >
            Meet the AI Tutor that learns with your lecture.
            Pause, ask, understand, and continue—without
            losing the flow.
          </p>

          {/* URL input */}
          <form
            onSubmit={submit}
            className="animate-fade-up glow-on-hover mx-auto mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl border border-violet-400/20 bg-white/[0.07] p-2 shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <PlayCircle className="h-5 w-5 shrink-0 text-violet-300" />

              <Input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                placeholder="Paste your YouTube lecture link..."
                aria-label="YouTube lecture URL"
                className="h-12 min-w-0 border-0 bg-transparent px-0 text-sm text-white placeholder:text-slate-400 shadow-none focus-visible:ring-0"
              />
            </div>

            <button
              type="submit"
              className="gradient-button group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold"
            >
              Start Learning
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

          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-sm">
            <button
              type="button"
              onClick={() => go(SAMPLE)}
              className="flex items-center gap-2 text-slate-300 transition hover:text-white"
            >
              <Play className="h-4 w-4 text-violet-300" />
              Try a sample lecture
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <span className="flex items-center gap-2 text-xs text-slate-400">
              <Check className="h-4 w-4 text-emerald-400" />
              No account required
            </span>
          </div>

          {/* Product experience */}
          <div
            id="experience"
            data-lf-reveal
            className="relative mx-auto mt-20 max-w-6xl scroll-mt-24"
          >
            <div className="lf-glow pointer-events-none absolute -inset-6 rounded-[36px] bg-gradient-to-r from-blue-500/15 via-violet-500/25 to-cyan-500/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-[#10172b] text-left shadow-2xl shadow-black/50">
              {/* Mock application title bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#151d34] px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>

                  <span className="text-xs font-medium text-slate-300">
                    LearnFlow Learning Studio
                  </span>
                </div>

                <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[10px] font-semibold text-violet-200">
                  Interactive preview
                </span>
              </div>

              <div className="grid lg:grid-cols-[1.4fr_1fr]">
                {/* Lecture preview */}
                <div className="border-b border-white/10 p-4 sm:p-6 lg:border-b-0 lg:border-r">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-400/10 p-2">
                        <PlayCircle className="h-4 w-4 text-blue-300" />
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          Lecture Studio
                        </p>
                        <p className="text-xs text-slate-400">
                          Interactive video learning
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      12:48 / 28:30
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => go(SAMPLE)}
                    className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-[#152957] via-[#192245] to-[#321d57] transition duration-300 hover:border-violet-400/50"
                    aria-label="Open sample lecture"
                  >
                    <div className="lf-float pointer-events-none absolute h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="relative flex flex-col items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:bg-violet-500/20">
                        <Play className="ml-1 h-8 w-8 text-white" />
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">
                          Watch. Pause. Understand.
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          Click to launch the real demo
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Knowledge Horizon preview */}
                  <div className="mt-4 rounded-xl border border-violet-400/15 bg-white/[0.035] p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs font-semibold text-violet-200">
                        <LockKeyhole className="h-3.5 w-3.5" />
                        Knowledge Horizon
                      </span>

                      <span className="text-[11px] text-slate-400">
                        Context boundary: 12:48
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="lf-progress h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
                      <span className="flex items-center gap-1 text-blue-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Available context
                      </span>

                      <span className="flex items-center gap-1 text-slate-400">
                        <LockKeyhole className="h-3 w-3" />
                        Future excluded
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated chat */}
                <div className="flex min-h-[410px] flex-col p-4 sm:p-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
                      <Sparkles className="h-5 w-5 text-violet-300" />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        LearnFlow AI Tutor
                      </p>
                      <p className="text-xs text-slate-400">
                        Your learning companion
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-center gap-5 py-5">
                    <div className="lf-chat-one ml-auto max-w-[90%] rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm leading-6">
                      Can you explain this concept in simpler terms?
                    </div>

                    <div className="lf-chat-two max-w-[95%] rounded-2xl rounded-tl-sm border border-violet-400/15 bg-white/[0.055] p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-violet-300">
                        <Sparkles className="h-4 w-4" />
                        LearnFlow AI
                      </div>

                      <p className="text-xs font-semibold text-blue-300">
                        FROM THE LECTURE
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Let's break down the concept using
                        what you've watched so far.
                      </p>

                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-blue-400/20 bg-blue-400/10 px-2.5 py-1.5 text-xs text-blue-200">
                        <PlayCircle className="h-3.5 w-3.5" />
                        Lecture reference
                      </div>

                      <div className="mt-4 border-t border-white/10 pt-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-300">
                          <Sparkles className="h-3 w-3" />
                          ADDITIONAL EXPLANATION
                        </p>

                        <p className="mt-2 text-xs leading-6 text-slate-400">
                          Gemini can also explain the idea
                          with another example or analogy.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-xs text-slate-400">
                      Ask your next question...
                    </span>
                    <ArrowRight className="h-4 w-4 text-violet-300" />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              Animated illustration of LearnFlow · Open the demo to use the actual product
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-24 border-t border-white/10 bg-[#0a1020] px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div data-lf-reveal className="mb-12 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              Designed for understanding
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              A learning experience
              <br />
              <span className="gradient-text">
                built around you.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              Less switching between tabs. More time
              understanding what matters.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                data-lf-reveal
                key={feature.title}
                className="hover-lift glow-on-hover group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-7"
              >
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${feature.gradient} blur-3xl`}
                />

                <div className="relative">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-violet-400/10 transition-transform duration-300 group-hover:scale-110">
                      <feature.icon className="h-6 w-6 text-violet-300" />
                    </div>

                    <span className="font-mono text-xs text-slate-500">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {feature.description}
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
        className="scroll-mt-24 px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div data-lf-reveal className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              Your new learning flow
            </span>

            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              Three steps. More clarity.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                data-lf-reveal
                key={step.number}
                className="hover-lift glow-on-hover group rounded-2xl border border-white/10 bg-[#10182b] p-7"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="h-6 w-6" />
                  </div>

                  <span className="text-3xl font-bold text-white/10">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-24 sm:px-8">
        <div
          data-lf-reveal
          className="glow-on-hover relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#182451] via-[#151b3c] to-[#28194d] px-6 py-16 text-center sm:py-20"
        >
          <div className="lf-glow pointer-events-none absolute left-1/2 top-0 h-60 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative">
            <div className="lf-float mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <Zap className="h-7 w-7 text-violet-200" />
            </div>

            <h2 className="text-3xl font-bold sm:text-5xl">
              Your next question could
              <br />
              change everything.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Transform your next lecture into a conversation.
            </p>

            <button
              type="button"
              onClick={() => go(SAMPLE)}
              className="hover-lift group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#151b3c] transition hover:bg-violet-100"
            >
              Experience LearnFlow
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-lg font-bold">
              LearnFlow
              <span className="text-violet-400">.</span>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Watch. Pause. Ask. Understand.
            </p>
          </div>

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            Verify AI explanations against cited sources.
          </p>
        </div>
      </footer>
    </div>
  );
}
