
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import {
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCw,
  Upload,
  Clock3,
  Sparkles,
  ChevronDown,
  ChevronUp,
  LockKeyhole,
  AudioLines,
  ShieldCheck,
  Database,
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

  // Existing timestamp-aware retrieval logic.
  const available = eligibleTranscript(
    transcript,
    currentTime
  );

  const progress = transcript.length
    ? Math.round(
        (available.length / transcript.length) * 100
      )
    : 0;

  const futureCount = Math.max(
    0,
    transcript.length - available.length
  );

  const load = async () => {
    const id = ++requestId.current;

    setBusy(true);
    setError("");

    try {
      const result = await retrieve({
        data: { videoId },
      });

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
      if (id === requestId.current) {
        setBusy(false);
      }
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

  const importText = async (
    raw: string,
    name: string
  ) => {
    if (!raw.trim()) {
      setError("Paste a timestamped transcript first.");
      return;
    }

    const id = ++requestId.current;

    setBusy(true);
    setError("");

    try {
      const result = await ingest({
        data: {
          videoId,
          text: raw,
        },
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
      if (id === requestId.current) {
        setBusy(false);
      }
    }
  };

  const upload = async (selected: File) => {
    if (selected.size > 1000000) {
      setError("Use a transcript smaller than 1 MB.");
      return;
    }

    if (!/\.(srt|vtt|txt)$/i.test(selected.name)) {
      setError(
        "Choose an SRT, VTT, or timestamped TXT file."
      );
      return;
    }

    try {
      await importText(
        await selected.text(),
        selected.name
      );
    } catch {
      setError(
        "The selected transcript file could not be read."
      );
    }
  };

  return (
    <section
      className="panel relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#10182b] shadow-xl shadow-black/10"
      aria-label="Lecture transcript"
    >
      {/* Premium header */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-[#182341] to-[#171b35] px-4 py-4 sm:px-5">
        <div className="pointer-events-none absolute -left-10 top-0 h-24 w-40 rounded-full bg-violet-500/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
            <AudioLines className="h-5 w-5 text-violet-300" />
          </div>

          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Context Intelligence
              </h3>

              <span className="rounded-md bg-blue-400/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                AI CONTEXT
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Timestamp-aware transcript processing
            </p>
          </div>
        </div>

        {/* Transcript actions */}
        <div className="relative flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Retry caption retrieval"
            title="Refresh transcript"
            disabled={busy}
            onClick={() => void load()}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                busy ? "animate-spin" : ""
              }`}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-xl border-violet-400/20 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20 hover:text-white"
            disabled={busy}
            onClick={() =>
              setShowImport((value) => !value)
            }
            aria-expanded={showImport}
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

      <div className="space-y-5 p-4 sm:p-5">
        {/* Loading */}
        {busy && (
          <div
            className="relative overflow-hidden rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/10 to-blue-500/5 p-5"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                <Loader2 className="h-6 w-6 animate-spin text-violet-300" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Preparing your learning context
                </p>

                <p className="mt-1 text-xs leading-6 text-slate-400">
                  Retrieving and processing lecture captions...
                </p>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="animate-soft-pulse h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
            </div>
          </div>
        )}

        {/* Transcript ready */}
        {!busy && transcript.length > 0 && (
          <>
            {/* Ready status */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-4"
              role="status"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    Transcript synchronized
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    Source: {source || "Lecture captions"}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
                <Check className="h-3.5 w-3.5" />
                Ready
              </span>
            </div>

            {/* Live intelligence stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-3 flex items-center gap-2 text-slate-400">
                  <Database className="h-3.5 w-3.5" />

                  <span className="text-[11px] font-medium">
                    Total captions
                  </span>
                </div>

                <p className="font-mono text-2xl font-bold text-white">
                  {transcript.length}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Loaded successfully
                </p>
              </div>

              <div className="rounded-xl border border-blue-400/15 bg-blue-400/[0.055] p-4">
                <div className="mb-3 flex items-center gap-2 text-blue-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />

                  <span className="text-[11px] font-medium">
                    In context
                  </span>
                </div>

                <p className="font-mono text-2xl font-bold text-blue-200">
                  {available.length}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Up to current time
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-violet-400/15 bg-violet-400/[0.055] p-4 sm:col-span-1">
                <div className="mb-3 flex items-center gap-2 text-violet-300">
                  <LockKeyhole className="h-3.5 w-3.5" />

                  <span className="text-[11px] font-medium">
                    Future captions
                  </span>
                </div>

                <p className="font-mono text-2xl font-bold text-violet-200">
                  {futureCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Outside current context
                </p>
              </div>
            </div>

            {/* Context visualization */}
            <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-[#182341] to-[#171b33] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-violet-300" />

                  <div>
                    <p className="text-xs font-semibold text-white">
                      Live context coverage
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Updates as the lecture plays
                    </p>
                  </div>
                </div>

                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs font-semibold text-violet-200">
                  {formatTime(currentTime)}
                </span>
              </div>

              {/* Context progress bar */}
              <div className="mt-5 space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    Available caption coverage
                  </span>

                  <span className="font-mono text-lg font-bold text-white">
                    {progress}%
                  </span>
                </div>

                <div
                  className="h-3 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Available lecture captions"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-[width] duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-blue-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {available.length} available
                  </span>

                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    {futureCount} not yet reached
                  </span>
                </div>
              </div>
            </div>

            {/* Grounded AI explanation */}
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10">
                <Sparkles className="h-4 w-4 text-violet-300" />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  Your AI understands the timeline
                </p>

                <p className="mt-1 text-xs leading-6 text-slate-400">
                  The tutor uses available lecture captions
                  up to your playback position, helping keep
                  its answers focused on what you've reached.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!busy && transcript.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/10">
              <FileText className="h-6 w-6 text-violet-300" />
            </div>

            <h4 className="text-sm font-semibold text-white">
              Waiting for lecture context
            </h4>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-400">
              No transcript is currently loaded.
              Retry automatic retrieval or import a
              timestamped transcript to get started.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs leading-6 text-red-300"
          >
            {error}
          </div>
        )}

        {/* Warning */}
        {warning && (
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-3 text-xs leading-6 text-amber-200">
            {warning}
          </div>
        )}

        {/* Import transcript */}
        {showImport && (
          <div className="space-y-4 overflow-hidden rounded-2xl border border-violet-400/15 bg-[#151d35] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10">
                <Upload className="h-5 w-5 text-violet-300" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  Import a transcript
                </h4>

                <p className="mt-1 text-xs leading-6 text-slate-400">
                  Paste timestamped captions or upload a
                  compatible transcript file.
                </p>
              </div>
            </div>

            <Textarea
              aria-label="Timestamped transcript"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                "00:00:12,000 --> 00:00:18,000\nCaption text"
              }
              rows={5}
              disabled={busy}
              className="min-h-32 rounded-xl border-white/10 bg-[#0b1121] font-mono text-xs text-slate-200 placeholder:text-slate-500 focus-visible:ring-violet-500/30"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="gradient-button h-10 gap-2 rounded-xl px-4"
                disabled={busy || !text.trim()}
                onClick={() =>
                  void importText(
                    text,
                    "Pasted transcript"
                  )
                }
              >
                <Check className="h-3.5 w-3.5" />
                Use transcript
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-10 gap-2 rounded-xl border-white/10 bg-white/5 px-4 text-slate-200 hover:bg-white/10 hover:text-white"
                disabled={busy}
                onClick={() => file.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload file
              </Button>
            </div>

            <div className="flex items-start gap-2 border-t border-white/10 pt-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

              <p className="text-xs leading-6 text-slate-400">
                Supported formats: SRT, VTT, and timestamped TXT.
                Maximum file size: 1 MB.
              </p>
            </div>

            <input
              ref={file}
              type="file"
              accept=".srt,.vtt,.txt"
              aria-label="Upload timestamped transcript"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];

                if (selected) {
                  void upload(selected);
                }

                e.target.value = "";
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
