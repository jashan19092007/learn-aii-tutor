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
import { formatTime } from "@/lib/youtube";
import { toast } from "sonner";

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
  // Transcript ingestion requires a server-side integration; until then it stays empty.
  const [transcript] = useState<TranscriptSegment[]>([]);

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

  const onAsk = (text: string) => {
    const askedAt = time;
    player.current?.pause();
    const evidence = buildEvidence(transcript, chunks, askedAt);
    const videoCount = evidence.filter((e) => e.kind === "video").length;
    const docCount = evidence.length - videoCount;
    setMessages((m) => [
      ...m,
      { id: uid(), role: "user", text, askedAt },
      {
        id: uid(),
        role: "notice",
        text:
          `Evidence available up to ${formatTime(askedAt)}: ${videoCount} transcript segment(s), ${docCount} document page(s). ` +
          "The AI tutor isn't connected yet, so no answer was generated.",
      },
    ]);
  };

  const onCite = (e: Evidence) => {
    if (e.kind === "video") player.current?.seek(e.start);
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
          <ChatPanel messages={messages} currentTime={time} onAsk={onAsk} onCite={onCite} />
        </div>
      </main>
    </div>
  );
}
