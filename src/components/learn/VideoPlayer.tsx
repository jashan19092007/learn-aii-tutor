import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
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
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer; PlayerState: { PLAYING: number } };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

export type VideoPlayerHandle = { seek(s: number): void; pause(): void };

export const VideoPlayer = forwardRef<VideoPlayerHandle, { videoId: string; onTime: (t: number) => void }>(
  function VideoPlayer({ videoId, onTime }, ref) {
    const host = useRef<HTMLDivElement>(null);
    const player = useRef<YTPlayer | null>(null);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playing, setPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
      seek: (s) => player.current?.seekTo(s, true),
      pause: () => player.current?.pauseVideo(),
    }));

    useEffect(() => {
      let cancelled = false;
      loadApi().then(() => {
        if (cancelled || !host.current || !window.YT) return;
        const el = document.createElement("div");
        host.current.appendChild(el);
        player.current = new window.YT.Player(el, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: { rel: 0, modestbranding: 1 },
          events: {
            onReady: (e: { target: YTPlayer }) => setDuration(e.target.getDuration()),
            onStateChange: (e: { data: number }) => setPlaying(e.data === window.YT!.PlayerState.PLAYING),
          },
        });
      });
      const iv = setInterval(() => {
        const p = player.current;
        if (p?.getCurrentTime) {
          const t = p.getCurrentTime();
          setTime(t);
          onTime(t);
          if (!duration && p.getDuration) setDuration(p.getDuration());
        }
      }, 250);
      return () => {
        cancelled = true;
        clearInterval(iv);
        player.current?.destroy();
        player.current = null;
        if (host.current) host.current.innerHTML = "";
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    const p = player.current;
    const pct = duration ? (time / duration) * 100 : 0;

    return (
      <div className="panel overflow-hidden">
        <div className="relative aspect-video bg-ink [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full" ref={host} />
        <div className="space-y-2 p-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={time}
            onChange={(e) => p?.seekTo(Number(e.target.value), true)}
            className="w-full accent-primary"
            aria-label="Seek"
            style={{ backgroundSize: `${pct}% 100%` }}
          />
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => p?.seekTo(Math.max(0, time - 10), true)} aria-label="Back 10 seconds">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="default" onClick={() => (playing ? p?.pauseVideo() : p?.playVideo())} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => p?.seekTo(time + 10, true)} aria-label="Forward 10 seconds">
              <RotateCw className="h-4 w-4" />
            </Button>
            <span className="ml-2 font-mono text-sm tabular-nums">
              <span className="font-semibold text-foreground">{formatTime(time)}</span>
              <span className="text-muted-foreground"> / {formatTime(duration)}</span>
            </span>
          </div>
        </div>
      </div>
    );
  },
);
