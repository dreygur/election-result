"use client";

import Link from "next/link";
import Image from "next/image";
import { ParliamentIllustration } from "@/components/illustrations/parliament";
import { PartyBarChart } from "@/components/charts/party-bar-chart";
import { ClientPagination } from "@/components/client-pagination";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber, imageUrl } from "@/lib/utils";
import { getPartyColor } from "@/lib/party-colors";
import type { PaginationInfo } from "@/types/pagination";

type PartyItem = {
  id: number;
  name_en: string | null;
  name_bn: string;
  slug: string;
  short_name: string | null;
  logo_url: string | null;
  symbol_url: string | null;
  totalCandidates: number;
  totalVotes: number;
  seatsWon: number;
};

export function PartiesView({
  parties,
  totalVotesCast,
  pagination,
  showChart = true,
}: {
  parties: PartyItem[];
  totalVotesCast?: number;
  pagination?: PaginationInfo;
  showChart?: boolean;
}) {
  const total = totalVotesCast ?? parties.reduce((s, p) => s + Number(p.totalVotes), 0);
  const displayCount = pagination ? pagination.total : parties.length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#006A4E]/10 bg-gradient-to-r from-[#006A4E]/5 via-white to-[#F42A41]/5 p-5 sm:p-8">
        <ParliamentIllustration className="absolute -right-6 -top-2 hidden h-44 w-44 opacity-50 sm:block" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold">Parties</h1>
          <p className="mt-1 text-muted-foreground">
            {displayCount} parties participated
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      {showChart && parties.some((p) => p.seatsWon > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Seats by Party</CardTitle>
          </CardHeader>
          <CardContent>
            <PartyBarChart
              data={parties.filter((p) => p.seatsWon > 0).map((p) => ({
                name: p.short_name || p.name_en || p.name_bn,
                slug: p.slug,
                seats: Number(p.seatsWon),
              }))}
            />
          </CardContent>
        </Card>
      )}

      <ClientPagination
        initialData={parties}
        initialPagination={pagination}
        fetchUrl={(p) => `/api/paginate/parties?page=${p}`}
      >
        {(items, _pg, rowOffset) => items.length === 0 ? (
          <EmptyState message="No party data available" />
        ) : (<>
          {/* Desktop */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead className="text-right">Seats Won</TableHead>
                    <TableHead className="text-right">Candidates</TableHead>
                    <TableHead className="text-right">Total Votes</TableHead>
                    <TableHead className="w-32">Vote Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((p, i) => {
                    const share = total > 0 ? (Number(p.totalVotes) / total) * 100 : 0;
                    const color = getPartyColor(p.slug);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{rowOffset + i + 1}</TableCell>
                        <TableCell>
                          <Link
                            href={`/parties/${p.slug}`}
                            className="inline-flex items-center gap-2 font-medium hover:underline"
                          >
                            {(p.symbol_url || p.logo_url) && (
                              <Image
                                src={imageUrl((p.symbol_url || p.logo_url)!)}
                                alt=""
                                width={20}
                                height={20}
                                className="h-5 w-5 object-contain"
                              />
                            )}
                            {p.name_en || p.name_bn}
                            {p.short_name && (
                              <span className="text-muted-foreground">
                                ({p.short_name})
                              </span>
                            )}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {p.seatsWon}
                        </TableCell>
                        <TableCell className="text-right">
                          {p.totalCandidates}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNumber(p.totalVotes)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${share}%`, backgroundColor: color }}
                              />
                            </div>
                            <span className="tabular-nums text-xs text-muted-foreground w-10 text-right">
                              {share > 0 ? `${share.toFixed(1)}%` : "—"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile */}
          <div className="space-y-3 md:hidden">
            {items.map((p, i) => {
              const color = getPartyColor(p.slug);
              return (
                <Link key={p.id} href={`/parties/${p.slug}`} className="block">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {p.logo_url && (
                            <Image
                              src={imageUrl(p.logo_url)}
                              alt=""
                              width={24}
                              height={24}
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <div>
                            <p className="font-medium">
                              <span className="text-muted-foreground">#{rowOffset + i + 1}</span>{" "}
                              {p.name_en || p.name_bn}
                            </p>
                            {p.short_name && (
                              <p className="text-sm text-muted-foreground">{p.short_name}</p>
                            )}
                            <p className="mt-1 text-sm text-muted-foreground">
                              {p.totalCandidates} candidates
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{p.seatsWon} seats</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(p.totalVotes)} votes
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </>)}
      </ClientPagination>
    </div>
  );
}
