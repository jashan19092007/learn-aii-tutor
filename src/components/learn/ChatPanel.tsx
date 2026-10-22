
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

// Remove raw citation identifiers and basic Markdown markers.
// Clickable timestamp citations remain separate and unchanged.
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
    end.current?.scrollIntoView({ behavior: "smooth" });
    ta.current?.focus();
  }, [messages.length, pending]);

  const send = (t: string) => {
    if (!t.trim() || pending) return;
    onAsk(t.trim());
    setText("");
  };

  return (
    <div className="panel flex h-full min-h-[520px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-none">
              Tutor
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Uses only the lecture up to the current moment
            </p>
          </div>
        </div>

        <span className="rounded-full bg-cite-video px-2.5 py-1 font-mono text-xs font-semibold text-cite-video-foreground">
          up to {formatTime(currentTime)}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Pause anywhere and ask a question, or try a quick action below.
          </div>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div
              key={m.id}
              className="flex flex-col items-end gap-1"
            >
              <span className="font-mono text-[11px] text-muted-foreground">
                asked at {formatTime(m.askedAt ?? 0)}
              </span>

              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-3.5 py-2 text-sm text-ink-foreground">
                {m.text}
              </div>
            </div>
          ) : m.role === "notice" ? (
            <div
              key={m.id}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground"
            >
              {m.text}
            </div>
          ) : (
            <div
              key={m.id}
              className="space-y-2 text-sm leading-relaxed"
            >
              <p className="whitespace-pre-wrap">
                {cleanTutorAnswer(m.text)}
              </p>

              {!!m.citations?.length && (
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
                          ? "h-auto gap-1 rounded-md bg-cite-video px-2 py-0.5 text-xs font-medium text-cite-video-foreground"
                          : "h-auto gap-1 rounded-md bg-cite-doc px-2 py-0.5 text-xs font-medium text-cite-doc-foreground"
                      }
                    >
                      {c.kind === "video" ? (
                        <>
                          <PlayCircle className="h-3 w-3" />
                          {formatTime(c.start)}
                        </>
                      ) : (
                        <>
                          {c.materialName} · p.{c.page}
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {pending && (
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            role="status"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Tutor is thinking…
          </div>
        )}

        <div ref={end} />
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((a) => (
            <Button
              key={a.id}
              size="sm"
              variant="secondary"
              className="h-7 rounded-full text-xs"
              disabled={pending}
              onClick={() => send(a.prompt)}
            >
              <a.icon className="h-3 w-3" />
              {a.label}
            </Button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
          className="flex items-end gap-2 rounded-xl border border-input bg-background p-2"
        >
          <Textarea
            ref={ta}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(text);
              }
            }}
            placeholder={`Ask about the lecture up to ${formatTime(currentTime)}…`}
            rows={1}
            className="min-h-9 resize-none border-0 shadow-none focus-visible:ring-0"
          />

          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0"
            disabled={!text.trim() || pending}
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
