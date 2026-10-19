import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-ink-foreground">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 17c3-6 5-6 8 0s5 6 8 0" strokeLinecap="round" />
          <path d="M4 9c3-6 5-6 8 0s5 6 8 0" strokeLinecap="round" opacity=".5" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">LearnFlow</span>
    </Link>
  );
}
