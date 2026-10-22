
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  BookOpen,
  GitCompare,
  Lightbulb,
  ListChecks,
  Loader2,
  PlayCircle,
  ScrollText,
  Wand2,
  Sparkles,
  Clock3,
  Bot,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Evidence } from "@/lib/retrieval";
import { formatTime } from "@/lib/youtube";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "notice";
  text: string;
  askedAt?: number;
  citations?: Evidence[];
};

export const QUICK_ACTIONS = [
  {
    id: "simplify",
    label: "Simplify",
    icon: Wand2,
    prompt: "Explain the last concept in simpler terms.",
  },
  {
    id: "example",
    label: "Give example",
    icon: Lightbulb,
    prompt: "Give me a concrete example of what was just covered.",
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: ScrollText,
    prompt: "Summarize the lesson so far.",
  },
  {
    id: "compare",
    label: "Compare",
    icon: GitCompare,
    prompt: "Compare the main concepts covered so far.",
  },
  {
    id: "quiz",
    label: "Quiz me",
    icon: ListChecks,
    prompt: "Generate a short quiz on what we've covered so far.",
  },
] as const;

// Preserve the citation cleanup fix.
// Clickable timestamp citations are rendered separately.
function cleanTutorAnswer(answer: string): string {
  return answer
    .replace(/\[[^\]\n]*:caption:\d+[^\]\n]*\]/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/[ \t]+([.,;:!?])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function ChatPanel({
  messages,
  currentTime,
  onAsk,
  onCite,
  pending = false,
}: {
  messages: ChatMessage[];
  currentTime: number;
  onAsk: (text: string) => void;
  onCite: (e: Evidence) => void;
  pending?: boolean;
}) {
  const [text, setText] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages.length, pending]);

  const send = (value: string) => {
    if (!value.trim() || pending) return;

    onAsk(value.trim());
    setText("");
  };

  return (
    <section className="panel flex h-full min-h-[600px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Tutor header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-card bg-emerald-500" />
          </div>

          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              LearnFlow AI Tutor
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Your lecture-aware study assistant
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1.5 font-mono text-xs font-medium text-primary">
          <Clock3 className="h-3.5 w-3.5" />
          {formatTime(currentTime)}
        </span>
      </div>

      {/* Context indicator */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2.5">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">
          Questions use lecture context up to your current playback time.
        </p>
      </div>

      {/* Chat messages */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-background/40 p-4">
        {messages.length === 0 && (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-3 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              AI learning companion
            </div>

            <h4 className="text-lg font-bold tracking-tight text-foreground">
              Curious about something?
            </h4>

            <p className="mt-2 max-w-[290px] text-sm leading-relaxed text-muted-foreground">
              Pause the lecture and ask a question.
              I'll help you understand the concepts
              and explore relevant timestamps.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                Explain concepts
              </span>
              <span className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                Find examples
              </span>
              <span className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                Test understanding
              </span>
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div
              key={m.id}
              className="flex items-end justify-end gap-2"
            >
              <div className="flex max-w-[88%] flex-col items-end gap-1.5">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {formatTime(m.askedAt ?? 0)}
                </span>

                <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-sm">
                  {m.text}
                </div>
              </div>

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <UserRound className="h-3.5 w-3.5" />
              </div>
            </div>
          ) : m.role === "notice" ? (
            <div
              key={m.id}
              className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground"
              role="status"
            >
              {m.text}
            </div>
          ) : (
            <div
              key={m.id}
              className="flex items-start gap-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    LearnFlow Tutor
                  </span>
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>

                <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">
                    {cleanTutorAnswer(m.text)}
                  </p>
                </div>

                {!!m.citations?.length && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      Sources
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {m.citations.map((c) => (
                        <Button
                          key={c.id}
                          variant="ghost"
                          size="sm"
                          aria-label={
                            c.kind === "video"
                              ? `Jump to ${formatTime(c.start)}`
                              : `${c.materialName}, page ${c.page}`
                          }
                          title={
                            c.kind === "video"
                              ? `Jump to ${formatTime(c.start)}`
                              : `${c.materialName}, page ${c.page}`
                          }
                          onClick={() => onCite(c)}
                          className={
                            c.kind === "video"
                              ? "h-auto min-h-8 gap-1.5 rounded-lg border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                              : "h-auto min-h-8 gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                          }
                        >
                          {c.kind === "video" ? (
                            <>
                              <PlayCircle className="h-3.5 w-3.5" />
                              {formatTime(c.start)}
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-3.5 w-3.5" />
                              {c.materialName} · p.{c.page}
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {pending && (
          <div
            className="flex items-start gap-2.5"
            role="status"
            aria-live="polite"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>

            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Thinking about your question...
            </div>
          </div>
        )}

        <div ref={end} />
      </div>

      {/* Composer */}
      <div className="shrink-0 space-y-3 border-t border-border bg-card p-3 sm:p-4">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((a) => (
            <Button
              key={a.id}
              size="sm"
              variant="secondary"
              className="h-8 gap-1.5 rounded-full border border-border bg-muted/50 px-3 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary"
              disabled={pending}
              onClick={() => send(a.prompt)}
            >
              <a.icon className="h-3.5 w-3.5" />
              {a.label}
            </Button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
          className="flex items-end gap-2 rounded-2xl border border-input bg-background p-2 shadow-sm transition-colors focus-within:border-primary/50"
        >
          <Textarea
            ref={ta}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                send(text);
              }
            }}
            placeholder={`Ask about the lecture up to ${formatTime(currentTime)}...`}
            rows={1}
            className="max-h-32 min-h-10 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            aria-label="Ask your AI Tutor"
          />

          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl"
            disabled={!text.trim() || pending}
            aria-label="Send message"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground">
          AI can make mistakes. Check the cited lecture timestamps.
        </p>
      </div>
    </section>
  );
}
