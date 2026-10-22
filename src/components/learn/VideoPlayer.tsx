
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Video,
  Clock3,
  Sparkles,
  Loader2,
  CheckCircle2,
  BookOpen,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/youtube";

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allow: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: unknown
      ) => YTPlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadApi() {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    });
  }

  return apiPromise;
}

export type VideoPlayerHandle = {
  seek(s: number): void;
  pause(): void;
  getTime(): number;
};

export const VideoPlayer = forwardRef<
  VideoPlayerHandle,
  {
    videoId: string;
    onTime: (t: number) => void;
  }
>(function VideoPlayer({ videoId, onTime }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);

  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  // Preserve citation seeking and workspace controls.
  useImperativeHandle(ref, () => ({
    seek: (s) => {
      player.current?.seekTo(s, true);
      setTime(s);
      onTime(s);
    },

    pause: () => {
      player.current?.pauseVideo();
    },

    getTime: () =>
      player.current?.getCurrentTime() ?? time,
  }));

  // Preserve YouTube iframe integration.
  useEffect(() => {
    let cancelled = false;

    setTime(0);
    setDuration(0);
    setPlaying(false);
    setReady(false);

    loadApi().then(() => {
      if (
        cancelled ||
        !host.current ||
        !window.YT
      ) {
        return;
      }

      const el = document.createElement("div");
      host.current.appendChild(el);

      player.current = new window.YT.Player(el, {
        videoId,
        width: "100%",
        height: "100%",

        playerVars: {
          rel: 0,
          modestbranding: 1,
        },

        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (cancelled) return;

            setReady(true);
            setDuration(e.target.getDuration());
          },

          onStateChange: (e: { data: number }) => {
            if (cancelled) return;

            setPlaying(
              e.data ===
                window.YT?.PlayerState.PLAYING
            );
          },
        },
      });
    });

    const interval = setInterval(() => {
      const p = player.current;

      if (p?.getCurrentTime) {
        const current = p.getCurrentTime();

        setTime(current);
        onTime(current);

        if (p.getDuration) {
          const total = p.getDuration();

          setDuration((previous) =>
            previous === total ? previous : total
          );
        }
      }
    }, 250);

    return () => {
      cancelled = true;

      clearInterval(interval);

      player.current?.destroy();
      player.current = null;

      if (host.current) {
        host.current.innerHTML = "";
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const progress = duration
    ? Math.min(
        100,
        Math.max(0, (time / duration) * 100)
      )
    : 0;

  const seek = (seconds: number) => {
    const target = Math.max(
      0,
      duration
        ? Math.min(duration, seconds)
        : seconds
    );

    player.current?.seekTo(target, true);

    setTime(target);
    onTime(target);
  };

  const togglePlayback = () => {
    if (!ready) return;

    if (playing) {
      player.current?.pauseVideo();
    } else {
      player.current?.playVideo();
    }
  };

  return (
    <section className="panel group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#10182b] shadow-2xl shadow-black/20">
      {/* Premium player header */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-[#182341] to-[#151b33] px-4 py-4 sm:px-5">
        <div className="pointer-events-none absolute -left-10 top-0 h-24 w-40 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 shadow-lg shadow-blue-900/10">
            <Video className="h-5 w-5 text-blue-300" />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-white">
                Lecture Studio
              </h2>

              <span className="rounded-md bg-violet-400/10 px-1.5 py-0.5 text-[10px] font-bold text-violet-300">
                AI SYNC
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Your interactive learning session
            </p>
          </div>
        </div>

        {/* Playback state */}
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
            playing
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              playing
                ? "bg-emerald-400"
                : ready
                  ? "bg-violet-400"
                  : "bg-slate-500"
            }`}
          />

          {!ready
            ? "Connecting"
            : playing
              ? "Now playing"
              : "Paused"}
        </div>
      </div>

      {/* YouTube player */}
      <div className="relative bg-[#070b17] p-2 sm:p-3">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/30">
          <div
            ref={host}
            className="relative aspect-video bg-black [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full"
          />

          {!ready && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b1020]/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                <Loader2 className="h-6 w-6 animate-spin text-violet-300" />
              </div>

              <p className="text-xs font-medium text-slate-300">
                Preparing your lecture...
              </p>
            </div>
          )}
        </div>

        {/* Player accent */}
        <div className="pointer-events-none absolute inset-x-16 bottom-0 h-8 rounded-full bg-violet-500/10 blur-2xl" />
      </div>

      {/* Controls */}
      <div className="relative space-y-4 border-t border-white/10 bg-[#131c32] px-4 py-4 sm:px-5">
        {/* Timeline heading */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-violet-300" />

            <span className="text-xs font-semibold text-slate-200">
              Lecture Timeline
            </span>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300">
            {Math.round(progress)}% position
          </span>
        </div>

        {/* Seek bar */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(
              time,
              duration || 0
            )}
            disabled={!ready || !duration}
            onChange={(e) =>
              seek(Number(e.target.value))
            }
            style={{
              background: `linear-gradient(
                to right,
                #6478f5 0%,
                #a16af0 ${progress}%,
                rgba(255,255,255,0.12) ${progress}%,
                rgba(255,255,255,0.12) 100%
              )`,
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-50 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(139,92,246,0.5)]"
            aria-label="Seek lecture"
          />

          <div className="flex items-center justify-between font-mono text-xs tabular-nums text-slate-400">
            <span>{formatTime(time)}</span>

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={!ready}
              className="h-10 w-10 rounded-xl border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white"
              onClick={() => seek(time - 10)}
              aria-label="Back 10 seconds"
              title="Back 10 seconds"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="default"
              disabled={!ready}
              className="gradient-button h-12 w-12 rounded-xl shadow-lg shadow-violet-500/20"
              onClick={togglePlayback}
              aria-label={playing ? "Pause" : "Play"}
              title={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="outline"
              disabled={!ready}
              className="h-10 w-10 rounded-xl border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white"
              onClick={() => seek(time + 10)}
              aria-label="Forward 10 seconds"
              title="Forward 10 seconds"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <div className="ml-2 hidden flex-col sm:flex">
              <span className="text-xs font-semibold text-slate-200">
                Playback controls
              </span>

              <span className="mt-0.5 text-[11px] text-slate-500">
                Skip backward or forward
              </span>
            </div>
          </div>

          {/* Current timestamp */}
          <div className="flex items-center gap-3 rounded-xl border border-violet-400/15 bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
              <BookOpen className="h-4 w-4 text-violet-300" />
            </div>

            <div>
              <p className="text-[10px] text-slate-400">
                AI context timestamp
              </p>

              <p className="font-mono text-sm font-bold text-violet-200">
                {formatTime(time)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning guidance */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#10182b] px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <Sparkles className="h-4 w-4 text-violet-300" />
          </div>

          <div>
            <p className="text-xs font-semibold text-white">
              Your next learning moment
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Pause the lecture, ask the AI Tutor,
              then continue with more clarity.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 text-[11px] font-medium text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Timestamp tracking</span>
          <Zap className="h-3 w-3" />
        </div>
      </div>
    </section>
  );
});
