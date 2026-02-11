import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationInfo } from "@/types/pagination";

function buildHref(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>
) {
  const params = new URLSearchParams();
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

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

const base =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors";
const active = `${base} bg-primary text-primary-foreground`;
const inactive = `${base} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
const disabled = `${base} pointer-events-none text-muted-foreground opacity-50`;

export function Pagination({
  pagination,
  basePath,
  searchParams,
}: {
  pagination: PaginationInfo;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 pt-6">
      {page <= 1 ? (
        <span className={disabled}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      ) : (
        <Link href={buildHref(basePath, page - 1, searchParams)} className={inactive}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className={`${base} pointer-events-none`}>
            ...
          </span>
        ) : p === page ? (
          <span key={p} className={active}>
            {p}
          </span>
        ) : (
          <Link key={p} href={buildHref(basePath, p, searchParams)} className={inactive}>
            {p}
          </Link>
        )
      )}

      {page >= totalPages ? (
        <span className={disabled}>
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <Link href={buildHref(basePath, page + 1, searchParams)} className={inactive}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
