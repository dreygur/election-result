"use client";

import { useState, useEffect, useRef } from "react";

const INTERVAL = Number(process.env.NEXT_PUBLIC_LIVE_REFRESH_INTERVAL || 0);

/**
 * Polls an API endpoint and returns fresh data.
 * Falls back to `initialData` until the first successful fetch.
 * Does nothing if NEXT_PUBLIC_LIVE_REFRESH_INTERVAL is 0.
 */
export function useLiveData<T>(url: string, initialData: T): T {
  const [data, setData] = useState<T>(initialData);
  const urlRef = useRef(url);
  urlRef.current = url;

  useEffect(() => {
    if (!INTERVAL) return;

    let cancelled = false;

    const poll = () => {
      fetch(urlRef.current)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!cancelled && d != null) setData(d);
        })
        .catch(() => {});
    };

    const id = setInterval(poll, INTERVAL * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return data;
}
