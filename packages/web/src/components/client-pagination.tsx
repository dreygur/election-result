"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationInfo } from "@/types/pagination";

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

const btn =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors";
const btnActive = `${btn} bg-primary text-primary-foreground`;
const btnInactive = `${btn} border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer`;
const btnDisabled = `${btn} pointer-events-none text-muted-foreground opacity-50`;

export function ClientPagination<T>({
  initialData,
  initialPagination,
  fetchUrl,
  children,
}: {
  initialData: T[];
  initialPagination?: PaginationInfo;
  fetchUrl: (page: number) => string;
  children: (data: T[], pagination: PaginationInfo | undefined, rowOffset: number) => ReactNode;
}) {
  const [data, setData] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(initialData);
    setPagination(initialPagination);
  }, [initialData, initialPagination]);

  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const rowOffset = pagination ? (pagination.page - 1) * pagination.pageSize : 0;

  const goToPage = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await fetch(fetchUrl(p));
        if (!res.ok) return;
        const json = await res.json();
        setData(json.data);
        setPagination({
          page: json.page,
          pageSize: json.pageSize,
          total: json.total,
          totalPages: json.totalPages,
        });
      } catch {
        // keep current state
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl],
  );

  return (
    <>
      <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : ""}>
        {children(data, pagination, rowOffset)}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1 pt-6">
          {page <= 1 ? (
            <span className={btnDisabled}><ChevronLeft className="h-4 w-4" /></span>
          ) : (
            <button onClick={() => goToPage(page - 1)} className={btnInactive}>
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {getPageNumbers(page, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} className={`${btn} pointer-events-none`}>...</span>
            ) : p === page ? (
              <span key={p} className={btnActive}>{p}</span>
            ) : (
              <button key={p} onClick={() => goToPage(p as number)} className={btnInactive}>
                {p}
              </button>
            ),
          )}
          {page >= totalPages ? (
            <span className={btnDisabled}><ChevronRight className="h-4 w-4" /></span>
          ) : (
            <button onClick={() => goToPage(page + 1)} className={btnInactive}>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </nav>
      )}
    </>
  );
}
