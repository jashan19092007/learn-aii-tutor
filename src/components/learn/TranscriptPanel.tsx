import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, FileText, Loader2, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getVideoTranscript, importVideoTranscript } from "@/lib/transcript.functions";
import { eligibleTranscript, type TranscriptSegment } from "@/lib/retrieval";
import { formatTime } from "@/lib/youtube";

export function TranscriptPanel({ videoId, transcript, currentTime, onTranscript }: { videoId: string; transcript: TranscriptSegment[]; currentTime: number; onTranscript: (segments: TranscriptSegment[]) => void }) {
  const retrieve = useServerFn(getVideoTranscript);
  const ingest = useServerFn(importVideoTranscript);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [source, setSource] = useState("");
  const [text, setText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  const load = async () => {
    const id = ++requestId.current;
    setBusy(true); setError("");
    try {
      const result = await retrieve({ data: { videoId } });
      if (id !== requestId.current) return;
      if (result.ok) { onTranscript(result.segments); setSource(result.source); setWarning(result.warning ?? ""); setShowImport(false); }
      else { setError(result.error); setShowImport(true); }
    } catch { if (id === requestId.current) { setError("Couldn't reach caption retrieval. Retry or import a timestamped transcript."); setShowImport(true); } }
    finally { if (id === requestId.current) setBusy(false); }
  };

  useEffect(() => {
    onTranscript([]); setText(""); setSource(""); setWarning("");
    void load();
    return () => { requestId.current++; };
    // The video identity alone triggers automatic retrieval.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const importText = async (raw: string, name: string) => {
    if (!raw.trim()) { setError("Paste a timestamped transcript first."); return; }
    const id = ++requestId.current;
    setBusy(true); setError("");
    try {
      const result = await ingest({ data: { videoId, text: raw } });
      if (id !== requestId.current) return;
      if (result.ok) { onTranscript(result.segments); setSource(name); setWarning(result.warning ?? ""); setShowImport(false); setText(""); }
      else setError(result.error);
    } catch { if (id === requestId.current) setError("The transcript could not be imported. Check its format and try again."); }
    finally { if (id === requestId.current) setBusy(false); }
  };

  const upload = async (selected: File) => {
    if (selected.size > 1000000) { setError("Use a transcript smaller than 1 MB."); return; }
    if (!/\.(srt|vtt|txt)$/i.test(selected.name)) { setError("Choose an SRT, VTT, or timestamped TXT file."); return; }
    try { await importText(await selected.text(), selected.name); }
    catch { setError("The selected transcript file could not be read."); }
  };

  return (
    <section className="panel p-4" aria-label="Lecture transcript">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4" /> Lecture transcript</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Retry caption retrieval" title="Retry caption retrieval" disabled={busy} onClick={() => void load()}><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => setShowImport((s) => !s)}>Import</Button>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground" role="status" aria-live="polite">
        {busy ? <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing transcript…</span> : transcript.length ? <span className="flex items-start gap-2"><Check className="h-3.5 w-3.5 shrink-0" /><span className="break-words">{source} · {transcript.length} captions · {eligibleTranscript(transcript, currentTime).length} available up to {formatTime(currentTime)}</span></span> : "No transcript loaded"}
      </div>
      {error && <p className="mt-2 text-xs text-destructive" role="alert">{error}</p>}
      {warning && <p className="mt-2 text-xs text-muted-foreground">{warning}</p>}
      {showImport && <div className="mt-3 space-y-2">
        <Textarea aria-label="Timestamped transcript" value={text} onChange={(e) => setText(e.target.value)} placeholder={"00:00:12,000 --> 00:00:18,000\nCaption text"} rows={4} disabled={busy} />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={busy || !text.trim()} onClick={() => void importText(text, "Pasted transcript")}>Use transcript</Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => file.current?.click()}><Upload className="h-3.5 w-3.5" /> Upload SRT / VTT / TXT</Button>
        </div>
        <input ref={file} type="file" accept=".srt,.vtt,.txt" aria-label="Upload timestamped transcript" className="hidden" onChange={(e) => { const selected = e.target.files?.[0]; if (selected) void upload(selected); e.target.value = ""; }} />
      </div>}
    </section>
  );
}