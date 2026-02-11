"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";

type SearchResult = {
  type: "constituency" | "candidate" | "party" | "district";
  id: number;
  label: string;
  sublabel: string | null;
  href: string;
};

const TYPE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  district: { label: "District", variant: "outline" },
  constituency: { label: "Constituency", variant: "default" },
  party: { label: "Party", variant: "secondary" },
  candidate: { label: "Candidate", variant: "outline" },
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  }, []);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Fetch results
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setResults(data);
        setActiveIndex(-1);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      router.push(results[activeIndex].href);
      close();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Search (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[15vh] w-full max-w-lg -translate-x-1/2 px-4">
        <div className="overflow-hidden rounded-xl border bg-background shadow-2xl">
          {/* Input */}
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search constituencies, candidates, parties..."
              className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="p-1">
                {results.map((r, i) => {
                  const config = TYPE_CONFIG[r.type];
                  return (
                    <Link
                      key={`${r.type}-${r.id}`}
                      href={r.href}
                      onClick={close}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        i === activeIndex ? "bg-accent" : "hover:bg-accent"
                      }`}
                    >
                      <Badge variant={config.variant} className="shrink-0 w-24 justify-center text-xs">
                        {config.label}
                      </Badge>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{r.label}</p>
                        {r.sublabel && (
                          <p className="text-xs text-muted-foreground truncate">{r.sublabel}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {!loading && debouncedQuery.length >= 2 && results.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No results for &ldquo;{debouncedQuery}&rdquo;
              </p>
            )}

            {!loading && debouncedQuery.length < 2 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Start typing to search...
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-3 py-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span><kbd className="rounded border bg-muted px-1 py-0.5 font-mono">↑↓</kbd> Navigate</span>
              <span><kbd className="rounded border bg-muted px-1 py-0.5 font-mono">↵</kbd> Open</span>
            </div>
            <span><kbd className="rounded border bg-muted px-1 py-0.5 font-mono">Ctrl K</kbd> Toggle</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
