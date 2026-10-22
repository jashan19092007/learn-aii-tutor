
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
      Player: new (el: HTMLElement, opts: unknown) => YTPlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadApi() {
  if (window.YT?.Player) return Promise.resolve();

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
  { videoId: string; onTime: (t: number) => void }
>(function VideoPlayer({ videoId, onTime }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);

  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    seek: (s) => {
      player.current?.seekTo(s, true);
      setTime(s);
      onTime(s);
    },
    pause: () => player.current?.pauseVideo(),
    getTime: () => player.current?.getCurrentTime() ?? time,
  }));

  useEffect(() => {
    let cancelled = false;
    setTime(0);
    setDuration(0);
    setPlaying(false);

    loadApi().then(() => {
      if (cancelled || !host.current || !window.YT) return;

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
            setDuration(e.target.getDuration());
          },
          onStateChange: (e: { data: number }) => {
            setPlaying(
              e.data === window.YT?.PlayerState.PLAYING
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
    ? Math.min(100, Math.max(0, (time / duration) * 100))
    : 0;

  const seek = (seconds: number) => {
    const target = Math.max(
      0,
      duration ? Math.min(duration, seconds) : seconds
    );

    player.current?.seekTo(target, true);
    setTime(target);
    onTime(target);
  };

  return (
    <section className="panel overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Player header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Video className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Lecture Player
            </h2>
            <p className="text-xs text-muted-foreground">
              Watch, pause and learn at your own pace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                playing
                  ? "bg-emerald-500"
                  : "bg-muted-foreground/50"
              }`}
            />
            {playing ? "Playing" : "Paused"}
          </span>
        </div>
      </div>

      {/* YouTube player */}
      <div
        className="relative aspect-video bg-black [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full"
        ref={host}
      />

      {/* Controls */}
      <div className="space-y-4 bg-card px-4 py-4 sm:px-5">
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(time, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-primary"
            aria-label="Seek lecture"
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono tabular-nums">
              {formatTime(time)}
            </span>

            <span className="font-mono tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-xl"
              onClick={() => seek(time - 10)}
              aria-label="Back 10 seconds"
              title="Back 10 seconds"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="default"
              className="h-11 w-11 rounded-xl shadow-sm"
              onClick={() =>
                playing
                  ? player.current?.pauseVideo()
                  : player.current?.playVideo()
              }
              aria-label={playing ? "Pause" : "Play"}
              title={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-xl"
              onClick={() => seek(time + 10)}
              aria-label="Forward 10 seconds"
              title="Forward 10 seconds"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            <span className="font-medium">
              {Math.round(progress)}% watched
            </span>
          </div>
        </div>
      </div>

      {/* Learning guidance */}
      <div className="flex items-start gap-2 border-t border-border bg-primary/5 px-4 py-3 sm:px-5">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">
            LearnFlow tip:
          </span>{" "}
          Pause whenever you need clarity, then ask your AI Tutor
          about the lecture.
        </p>
      </div>
    </section>
  );
});
