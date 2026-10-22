
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Check,
  FileText,
  Loader2,
  RefreshCw,
  Upload,
  Clock3,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getVideoTranscript,
  importVideoTranscript,
} from "@/lib/transcript.functions";
import {
  eligibleTranscript,
  type TranscriptSegment,
} from "@/lib/retrieval";
import { formatTime } from "@/lib/youtube";

type TranscriptPanelProps = {
  videoId: string;
  transcript: TranscriptSegment[];
  currentTime: number;
  onTranscript: (segments: TranscriptSegment[]) => void;
};

export function TranscriptPanel({
  videoId,
  transcript,
  currentTime,
  onTranscript,
}: TranscriptPanelProps) {
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

  const available = eligibleTranscript(transcript, currentTime);
  const progress = transcript.length
    ? Math.round((available.length / transcript.length) * 100)
    : 0;

  const load = async () => {
    const id = ++requestId.current;
    setBusy(true);
    setError("");

    try {
      const result = await retrieve({ data: { videoId } });

      if (id !== requestId.current) return;

      if (result.ok) {
        onTranscript(result.segments);
        setSource(result.source);
        setWarning(result.warning ?? "");
        setShowImport(false);
      } else {
        setError(result.error);
        setShowImport(true);
      }
    } catch {
      if (id === requestId.current) {
        setError(
          "Couldn't reach caption retrieval. Retry or import a timestamped transcript."
        );
        setShowImport(true);
      }
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  };

  useEffect(() => {
    onTranscript([]);
    setText("");
    setSource("");
    setWarning("");
    void load();

    return () => {
      requestId.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const importText = async (raw: string, name: string) => {
    if (!raw.trim()) {
      setError("Paste a timestamped transcript first.");
      return;
    }

    const id = ++requestId.current;
    setBusy(true);
    setError("");

    try {
      const result = await ingest({
        data: { videoId, text: raw },
      });

      if (id !== requestId.current) return;

      if (result.ok) {
        onTranscript(result.segments);
        setSource(name);
        setWarning(result.warning ?? "");
        setShowImport(false);
        setText("");
      } else {
        setError(result.error);
      }
    } catch {
      if (id === requestId.current) {
        setError(
          "The transcript could not be imported. Check its format and try again."
        );
      }
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  };

  const upload = async (selected: File) => {
    if (selected.size > 1000000) {
      setError("Use a transcript smaller than 1 MB.");
      return;
    }

    if (!/\.(srt|vtt|txt)$/i.test(selected.name)) {
      setError("Choose an SRT, VTT, or timestamped TXT file.");
      return;
    }

    try {
      await importText(await selected.text(), selected.name);
    } catch {
      setError("The selected transcript file could not be read.");
    }
  };

  return (
    <section
      className="panel overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      aria-label="Lecture transcript"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Lecture Transcript
            </h3>
            <p className="text-xs text-muted-foreground">
              Timestamp-aware lecture context
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl"
            aria-label="Retry caption retrieval"
            title="Refresh transcript"
            disabled={busy}
            onClick={() => void load()}
          >
            <RefreshCw
              className={`h-4 w-4 ${busy ? "animate-spin" : ""}`}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl"
            disabled={busy}
            onClick={() => setShowImport((value) => !value)}
          >
            <Upload className="h-3.5 w-3.5" />
            Import
            {showImport ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* Loading state */}
        {busy && (
          <div
            className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Processing transcript
              </p>
              <p className="text-xs text-muted-foreground">
                Retrieving lecture captions...
              </p>
            </div>
          </div>
        )}

        {/* Loaded state */}
        {!busy && transcript.length > 0 && (
          <>
            <div
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Transcript ready
                  </p>
                  <p className="max-w-[230px] truncate text-xs text-muted-foreground">
                    {source || "Lecture captions"}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                {transcript.length} captions
              </span>
            </div>

            {/* Caption progress */}
            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Lecture context
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Available lecture captions"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {available.length} of {transcript.length} captions available
                </span>
                <span className="font-semibold text-primary">
                  {progress}%
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your AI Tutor can use the lecture context available
                up to your current playback position.
              </p>
            </div>
          </>
        )}

        {/* Empty state */}
        {!busy && transcript.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-5 text-center">
            <FileText className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No transcript loaded
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Retry retrieval or import a timestamped transcript.
            </p>
          </div>
        )}

        {error && (
          <p
            className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {warning && (
          <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            {warning}
          </p>
        )}

        {/* Import */}
        {showImport && (
          <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Import transcript
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste timestamped captions or upload a transcript file.
              </p>
            </div>

            <Textarea
              aria-label="Timestamped transcript"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                "00:00:12,000 --> 00:00:18,000\nCaption text"
              }
              rows={4}
              disabled={busy}
              className="rounded-xl bg-background"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="rounded-xl"
                disabled={busy || !text.trim()}
                onClick={() =>
                  void importText(text, "Pasted transcript")
                }
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Use transcript
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                disabled={busy}
                onClick={() => file.current?.click()}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload file
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Supports SRT, VTT and timestamped TXT files (max 1 MB).
            </p>

            <input
              ref={file}
              type="file"
              accept=".srt,.vtt,.txt"
              aria-label="Upload timestamped transcript"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) void upload(selected);
                e.target.value = "";
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
