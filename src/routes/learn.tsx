import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { VideoPlayer, type VideoPlayerHandle } from "@/components/learn/VideoPlayer";
import { ChatPanel, type ChatMessage } from "@/components/learn/ChatPanel";
import { MaterialsPanel, kindOf, type Material } from "@/components/learn/MaterialsPanel";
import { buildEvidence, chunkText, type DocumentChunk, type Evidence, type TranscriptSegment } from "@/lib/retrieval";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { askTutor } from "@/lib/tutor.functions";
import { TranscriptPanel } from "@/components/learn/TranscriptPanel";

export const Route = createFileRoute("/learn")({
  validateSearch: z.object({ v: z.string().regex(/^[\w-]{11}$/) }),
  head: () => ({
    meta: [
      { title: "Lecture workspace — LearnFlow" },
      { name: "description", content: "Watch, pause and ask your AI tutor about the lecture so far." },
      { property: "og:title", content: "Lecture workspace — LearnFlow" },
      { property: "og:description", content: "Timestamp-aware AI tutoring with cited sources." },
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
  const onTranscript = useCallback((segments: TranscriptSegment[]) => {
    setTranscript(segments);
    setMessages([]);
  }, []);

  const onFiles = async (files: FileList) => {
    for (const f of Array.from(files)) {
      const kind = kindOf(f.name);
      if (!kind) { toast.error(`${f.name}: unsupported file type`); continue; }
      const id = uid();
      if (kind === "text" || kind === "code") {
        const c = chunkText(id, f.name, await f.text());
        setChunks((x) => [...x, ...c]);
        setMaterials((x) => [...x, { id, name: f.name, kind, size: f.size, status: "ready", pages: c.length }]);
      } else {
        setMaterials((x) => [...x, { id, name: f.name, kind, size: f.size, status: "needs-processing", pages: 0 }]);
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
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-10)
      .map((m) => ({ role: m.role as "user" | "assistant", text: m.text, askedAt: m.askedAt }));
    setMessages((m) => [...m, { id: uid(), role: "user", text, askedAt }]);
    setPending(true);
    try {
      const res = await ask({ data: { question: text, askedAt, transcript, chunks, history } });
      setMessages((m) => [
        ...m,
        res.ok
          ? { id: uid(), role: "assistant", text: res.answer, citations: res.citations, askedAt }
          : { id: uid(), role: "notice", text: res.error },
      ]);
    } catch {
      setMessages((m) => [...m, { id: uid(), role: "notice", text: "Couldn't reach the tutor. Check your connection and try again." }]);
    } finally {
      setPending(false);
    }
  };

  const onCite = (e: Evidence) => {
    if (e.kind === "video") { player.current?.pause(); player.current?.seek(e.start); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3">
          <Button asChild size="icon" variant="ghost" aria-label="Back">
            <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <Logo />
        </div>
      </header>
      <main className="mx-auto grid max-w-[1500px] gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          <VideoPlayer ref={player} videoId={v} onTime={onTime} />
          <TranscriptPanel videoId={v} transcript={transcript} currentTime={time} onTranscript={onTranscript} />
          <MaterialsPanel
            materials={materials}
            onFiles={onFiles}
            onRemove={(id) => {
              setMaterials((x) => x.filter((m) => m.id !== id));
              setChunks((x) => x.filter((c) => c.materialId !== id));
            }}
          />
        </div>
        <div className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-88px)]">
          <ChatPanel messages={messages} currentTime={time} onAsk={onAsk} onCite={onCite} pending={pending} />
        </div>
      </main>
    </div>
  );
}
