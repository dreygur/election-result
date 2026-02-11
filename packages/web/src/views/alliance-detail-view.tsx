import Link from "next/link";
import Image from "next/image";
import { Trophy, Users, Vote } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { SeatDonut } from "@/components/charts/seat-donut";
import { EmptyState } from "@/components/empty-state";
import { ParliamentIllustration } from "@/components/illustrations/parliament";
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
import type { Alliance } from "@/lib/alliances";
import type { AlliancePartyRow } from "@/lib/queries/alliances";

type WonConstituency = {
  constituencyName: string;
  constituencySlug: string;
  districtName: string;
  winnerName: string;
  votes: number | null;
  partyName: string | null;
  partySlug: string;
  partyShortName: string | null;
};

export function AllianceDetailView({
  alliance,
  parties,
  constituencies,
}: {
  alliance: Alliance;
  parties: AlliancePartyRow[];
  constituencies: WonConstituency[];
}) {
  const totalSeats = parties.reduce((s, p) => s + Number(p.seatsWon), 0);
  const totalVotes = parties.reduce((s, p) => s + Number(p.totalVotes), 0);
  const totalCandidates = parties.reduce((s, p) => s + Number(p.totalCandidates), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#006A4E]/10 bg-gradient-to-r from-[#006A4E]/5 via-white to-[#F42A41]/5 p-6 sm:p-8">
        <ParliamentIllustration className="absolute -right-6 -top-2 hidden h-44 w-44 opacity-50 sm:block" />
        <div className="relative">
          <p className="text-sm text-muted-foreground">
            <Link href="/alliances" className="hover:underline">Alliances</Link>
          </p>
          <h1 className="mt-1 text-3xl font-bold">{alliance.name}</h1>
          <p className="text-muted-foreground">
            {parties.length} member {parties.length === 1 ? "party" : "parties"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Seats Won" value={totalSeats} icon={Trophy} accentColor={alliance.color} />
        <StatsCard label="Total Candidates" value={totalCandidates} icon={Users} accentColor="#006A4E" />
        <StatsCard label="Total Votes" value={totalVotes} icon={Vote} accentColor="#F42A41" />
      </div>

      {/* Seat Distribution Donut */}
      {totalSeats > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Seats by Party</CardTitle>
          </CardHeader>
          <CardContent>
            <SeatDonut
              data={parties.filter((p) => p.seatsWon > 0).map((p) => ({
                name: p.short_name || p.name_en || p.name_bn,
                slug: p.slug,
                seats: Number(p.seatsWon),
              }))}
            />
          </CardContent>
        </Card>
      )}

      {/* Member Parties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Member Parties</CardTitle>
        </CardHeader>
        <CardContent>
          {parties.length === 0 ? (
            <EmptyState message="No party data available" />
          ) : (<>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead className="text-right">Seats Won</TableHead>
                  <TableHead className="text-right">Candidates</TableHead>
                  <TableHead className="text-right">Total Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parties.map((p, i) => {
                  const color = getPartyColor(p.slug);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <Link
                          href={`/parties/${p.slug}`}
                          className="inline-flex items-center gap-2 font-medium hover:underline"
                        >
                          {(p.symbol_url || p.logo_url) && (
                            <Image
                              src={(p.symbol_url || p.logo_url)!}
                              alt=""
                              width={20}
                              height={20}
                              className="h-5 w-5 object-contain"
                            />
                          )}
                          {p.name_en || p.name_bn}
                          {p.short_name && (
                            <span className="text-muted-foreground">({p.short_name})</span>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums">{p.seatsWon}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.totalCandidates}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(p.totalVotes)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="space-y-3 md:hidden">
            {parties.map((p, i) => {
              const color = getPartyColor(p.slug);
              return (
                <Link key={p.id} href={`/parties/${p.slug}`} className="block">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {(p.symbol_url || p.logo_url) && (
                            <Image
                              src={(p.symbol_url || p.logo_url)!}
                              alt=""
                              width={24}
                              height={24}
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <div>
                            <p className="font-medium">
                              <span className="text-muted-foreground">#{i + 1}</span>{" "}
                              {p.name_en || p.name_bn}
                            </p>
                            <p className="text-sm text-muted-foreground">
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
        </CardContent>
      </Card>

      {/* Won Constituencies */}
      {constituencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Constituencies Won ({constituencies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Constituency</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead className="text-right">Votes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {constituencies.map((c, i) => (
                    <TableRow key={c.constituencySlug}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <Link
                          href={`/constituencies/${c.constituencySlug}`}
                          className="font-medium hover:underline"
                        >
                          {c.constituencyName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.districtName}</TableCell>
                      <TableCell>{c.winnerName}</TableCell>
                      <TableCell>
                        {c.partyShortName && (
                          <Badge variant="secondary" className="text-[10px]">{c.partyShortName}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(c.votes)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="space-y-2 md:hidden">
              {constituencies.map((c, i) => (
                <Link
                  key={c.constituencySlug}
                  href={`/constituencies/${c.constituencySlug}`}
                  className="block"
                >
                  <div className="rounded-lg border border-border/50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          <span className="text-muted-foreground">#{i + 1}</span>{" "}
                          {c.constituencyName}
                        </p>
                        <p className="text-xs text-muted-foreground">{c.districtName}</p>
                        <p className="text-xs mt-0.5">{c.winnerName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold tabular-nums">{formatNumber(c.votes)}</p>
                        {c.partyShortName && (
                          <Badge variant="secondary" className="text-[9px] mt-0.5">{c.partyShortName}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
