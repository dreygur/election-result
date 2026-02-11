"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { formatNumber } from "@/lib/utils";
import type { PaginationInfo } from "@/types/pagination";

type Center = {
  id: number;
  center_number: number;
  name_bn: string;
  total_voters: number | null;
  total_votes_cast: number | null;
};

type PageData = {
  data: Center[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

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

const btnBase =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors";
const btnActive = `${btnBase} bg-primary text-primary-foreground`;
const btnInactive = `${btnBase} border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer`;
const btnDisabled = `${btnBase} pointer-events-none text-muted-foreground opacity-50`;

export function CentersPaginated({
  constituencySlug,
  initialCenters,
  initialPagination,
}: {
  constituencySlug: string;
  initialCenters: Center[];
  initialPagination?: PaginationInfo;
}) {
  const [centers, setCenters] = useState(initialCenters);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);

  const total = pagination ? pagination.total : centers.length;
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const goToPage = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/live/constituency/${constituencySlug}/centers?page=${p}`,
        );
        if (!res.ok) return;
        const data: PageData = await res.json();
        setCenters(data.data);
        setPagination({
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch {
        // keep current state
      } finally {
        setLoading(false);
      }
    },
    [constituencySlug],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Polling Stations ({total})</CardTitle>
      </CardHeader>
      <CardContent>
        {centers.length === 0 ? (
          <EmptyState message="No polling station data available yet" />
        ) : (
          <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : ""}>
            {/* Desktop */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Voters</TableHead>
                    <TableHead className="text-right">Votes Cast</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centers.map((center) => (
                    <TableRow key={center.id}>
                      <TableCell>{center.center_number}</TableCell>
                      <TableCell>
                        <Link
                          href={`/constituencies/${constituencySlug}/centers/${center.id}`}
                          className="hover:underline"
                        >
                          {center.name_bn}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(center.total_voters)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(center.total_votes_cast)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {centers.map((center) => (
                <Link
                  key={center.id}
                  href={`/constituencies/${constituencySlug}/centers/${center.id}`}
                  className="block"
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            <span className="text-muted-foreground">#{center.center_number}</span>{" "}
                            {center.name_bn}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p>{formatNumber(center.total_voters)} voters</p>
                          <p className="text-muted-foreground">
                            {formatNumber(center.total_votes_cast)} cast
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-1 pt-6">
            {page <= 1 ? (
              <span className={btnDisabled}>
                <ChevronLeft className="h-4 w-4" />
              </span>
            ) : (
              <button onClick={() => goToPage(page - 1)} className={btnInactive}>
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {getPageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`e${i}`} className={`${btnBase} pointer-events-none`}>
                  ...
                </span>
              ) : p === page ? (
                <span key={p} className={btnActive}>
                  {p}
                </span>
              ) : (
                <button key={p} onClick={() => goToPage(p as number)} className={btnInactive}>
                  {p}
                </button>
              ),
            )}

            {page >= totalPages ? (
              <span className={btnDisabled}>
                <ChevronRight className="h-4 w-4" />
              </span>
            ) : (
              <button onClick={() => goToPage(page + 1)} className={btnInactive}>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </nav>
        )}
      </CardContent>
    </Card>
  );
}
