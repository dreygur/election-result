"use client";

const INTERVAL = Number(process.env.NEXT_PUBLIC_LIVE_REFRESH_INTERVAL || 0);

export function LiveRefresh() {
  if (!INTERVAL) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span>Live</span>
    </div>
  );
}
