"use client";

import Link from "next/link";
import Image from "next/image";
import { Trophy, Users, Vote } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { SeatDonut } from "@/components/charts/seat-donut";
import { ClientPagination } from "@/components/client-pagination";
import { EmptyState } from "@/components/empty-state";
import { TrophyCupIllustration } from "@/components/illustrations/trophy-cup";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import { getPartyColor } from "@/lib/party-colors";
import { getAllianceForParty } from "@/lib/alliances";
import type { PaginationInfo } from "@/types/pagination";

type Party = {
  id: number;
  name_en: string | null;
  name_bn: string;
  short_name: string | null;
  slug: string;
  logo_url: string | null;
  symbol_url: string | null;
};

type CandidateItem = {
  id: number;
  name_bn: string;
  name_en: string | null;
  photo_url: string | null;
  total_votes: number | null;
  is_winner: boolean;
  constituencyName: string;
  constituencySlug: string;
};

type PartyStats = {
  totalCandidates: number;
  totalVotes: number;
  seatsWon: number;
};

export function PartyDetailView({
  party,
  candidates,
  stats,
  pagination,
}: {
  party: Party;
  candidates: CandidateItem[];
  stats: PartyStats;
  pagination?: PaginationInfo;
}) {
  const color = getPartyColor(party.slug);
  const alliance = getAllianceForParty(party.slug);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#006A4E]/10 bg-gradient-to-r from-[#D4A017]/5 via-white to-[#006A4E]/5 p-5 sm:p-8">
        <TrophyCupIllustration className="absolute -right-2 -top-2 hidden h-44 w-44 opacity-35 sm:block" />
        <div className="relative">
          <p className="text-sm text-muted-foreground">
            <Link href="/parties" className="hover:underline">
              Parties
            </Link>
          </p>
          <div className="mt-2 flex items-center gap-4">
            {(party.symbol_url || party.logo_url) && (
              <Image
                src={(party.symbol_url || party.logo_url)!}
                alt={party.name_en || party.name_bn}
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {party.name_en || party.name_bn}
                {party.short_name && (
                  <span className="ml-2 text-xl text-muted-foreground">
                    ({party.short_name})
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground">{party.name_bn}</p>
              {alliance && (
                <Badge
                  variant="outline"
                  className="mt-1"
                  style={{ borderColor: alliance.color, color: alliance.color }}
                >
                  {alliance.shortName}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Seats Won" value={stats.seatsWon} icon={Trophy} accentColor="#D4A017" />
        <StatsCard label="Total Candidates" value={stats.totalCandidates} icon={Users} accentColor="#006A4E" />
        <StatsCard label="Total Votes" value={stats.totalVotes} icon={Vote} accentColor="#F42A41" />
      </div>

      {/* Won vs Lost Donut */}
      {stats.totalCandidates > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Constituency Results</CardTitle>
          </CardHeader>
          <CardContent>
            <SeatDonut
              data={[
                { name: "Won", slug: party.slug, seats: stats.seatsWon },
                { name: "Lost", slug: "independent", seats: stats.totalCandidates - stats.seatsWon },
              ]}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientPagination
            initialData={candidates}
            initialPagination={pagination}
            fetchUrl={(p) => `/api/paginate/parties/${party.slug}/candidates?page=${p}`}
          >
            {(items, _pg, rowOffset) => items.length === 0 ? (
              <EmptyState message="No candidates found for this party" />
            ) : (<>
              {/* Desktop */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Constituency</TableHead>
                      <TableHead className="text-right">Votes</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((c, i) => (
                      <TableRow
                        key={c.id}
                        className={c.is_winner ? "border-l-2 border-l-success bg-success/5" : ""}
                      >
                        <TableCell>{rowOffset + i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {c.photo_url && (
                              <Image
                                src={c.photo_url}
                                alt={c.name_bn}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover border border-border/50"
                              />
                            )}
                            <Link
                              href={`/candidates/${c.id}`}
                              className="font-medium hover:underline"
                            >
                              {c.name_bn}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/constituencies/${c.constituencySlug}`}
                            className="hover:underline"
                          >
                            {c.constituencyName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNumber(c.total_votes)}
                        </TableCell>
                        <TableCell>
                          {c.is_winner && <Badge variant="winner">Winner</Badge>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile */}
              <div className="space-y-3 md:hidden">
                {items.map((c, i) => (
                  <Card key={c.id} className={c.is_winner ? "border-l-2 border-l-success" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {c.photo_url && (
                            <Image
                              src={c.photo_url}
                              alt={c.name_bn}
                              width={28}
                              height={28}
                              className="h-7 w-7 rounded-full object-cover border border-border/50"
                            />
                          )}
                          <div>
                            <p className="font-medium">
                              <span className="text-muted-foreground">#{rowOffset + i + 1}</span>{" "}
                              <Link href={`/candidates/${c.id}`} className="hover:underline">
                                {c.name_bn}
                              </Link>
                            </p>
                            <Link
                              href={`/constituencies/${c.constituencySlug}`}
                              className="text-sm text-muted-foreground hover:underline"
                            >
                              {c.constituencyName}
                            </Link>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold tabular-nums">{formatNumber(c.total_votes)}</p>
                          {c.is_winner && <Badge variant="winner">Winner</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>)}
          </ClientPagination>
        </CardContent>
      </Card>
    </div>
  );
}
