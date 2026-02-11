"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptySearchIllustration } from "@/components/illustrations/empty-search";
import { SearchPromptIllustration } from "@/components/illustrations/search-prompt";
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

export function SearchView({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Find constituencies, candidates, parties, and districts
        </p>
      </div>

      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          placeholder="Type to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          autoFocus
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-1">
          {results.map((r) => {
            const config = TYPE_CONFIG[r.type];
            return (
              <Link
                key={`${r.type}-${r.id}`}
                href={r.href}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
              >
                <Badge variant={config.variant} className="shrink-0 w-24 justify-center">
                  {config.label}
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.label}</p>
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
        <div className="flex flex-col items-center py-10">
          <EmptySearchIllustration className="h-36 w-36" />
          <p className="mt-2 text-muted-foreground">No results found for &ldquo;{debouncedQuery}&rdquo;</p>
        </div>
      )}

      {!debouncedQuery && (
        <div className="flex flex-col items-center py-10">
          <SearchPromptIllustration className="h-32 w-32" />
          <p className="mt-2 text-sm text-muted-foreground">
            Search by constituency name, candidate name, party, or district
          </p>
        </div>
      )}
    </div>
  );
}
