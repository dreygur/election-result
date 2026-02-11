import Link from "next/link";
import { Users, Vote, Building2, MapPin } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { SeatDonut } from "@/components/charts/seat-donut";
import { AllianceDonut } from "@/components/charts/alliance-donut";
import { PartyBarChart } from "@/components/charts/party-bar-chart";
import { VoteShareBarChart } from "@/components/charts/vote-share-bar-chart";
import { SeatsVsVotesChart } from "@/components/charts/seats-vs-votes-chart";
import { TurnoutGauge } from "@/components/charts/turnout-gauge";
import { BallotBoxIllustration } from "@/components/illustrations/ballot-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { formatNumber, formatPercent } from "@/lib/utils";
import { getPartyColor } from "@/lib/party-colors";
import type { AllianceResult } from "@/lib/queries/alliances";

type Stats = {
  totalConstituencies: number;
  totalVoters: number;
  totalVotesCast: number;
  totalRejected: number;
  totalCandidates: number;
  totalParties: number;
  totalCenters: number;
};

type PartySeats = {
  id: number;
  name_en: string | null;
  name_bn: string;
  slug: string;
  short_name: string | null;
  seats: number;
  totalVotes: number;
};

export function HomeView({
  stats,
  seatsByParty,
  allianceResults,
}: {
  stats: Stats;
  seatsByParty: PartySeats[];
  allianceResults: AllianceResult[];
}) {
  const totalSeats = seatsByParty.reduce((s, p) => s + Number(p.seats), 0);
  const turnout = stats.totalVoters > 0
    ? (stats.totalVotesCast / stats.totalVoters) * 100
    : 0;

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#006A4E]/15 bg-gradient-to-br from-[#006A4E]/8 via-white to-[#F42A41]/5 p-5 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,106,78,0.07),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-[#F42A41]/5 blur-3xl" />
        <BallotBoxIllustration className="absolute -right-4 -bottom-4 hidden h-48 w-48 opacity-40 sm:block md:h-56 md:w-56 md:opacity-50" />
        <div className="relative space-y-3">
          <Badge variant="outline" className="border-[#006A4E]/30 text-[#006A4E]">
            13th National Parliament
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Bangladesh Election Results
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-muted-foreground">
            Comprehensive results including all constituencies, candidates, parties,
            and polling station data from the 13th National Parliament Election.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Constituencies"
          value={stats.totalConstituencies}
          icon={Building2}
          accentColor="#006A4E"
        />
        <StatsCard
          label="Voter Turnout"
          value={formatPercent(stats.totalVotesCast, stats.totalVoters)}
          description={`${formatNumber(stats.totalVotesCast)} of ${formatNumber(stats.totalVoters)} voters`}
          icon={Vote}
          accentColor="#F42A41"
        />
        <StatsCard
          label="Candidates"
          value={stats.totalCandidates}
          icon={Users}
          accentColor="#D4A017"
        />
        <StatsCard
          label="Polling Stations"
          value={stats.totalCenters}
          icon={MapPin}
          accentColor="#006A4E"
        />
      </div>

      {/* Alliance Results */}
      {allianceResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results by Alliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {allianceResults.map((a) => {
                const seatShare = totalSeats > 0 ? (a.seats / totalSeats) * 100 : 0;
                const voteShare = stats.totalVotesCast > 0
                  ? (a.totalVotes / stats.totalVotesCast) * 100
                  : 0;
                const href = a.slug === "others" ? "/parties" : `/alliances/${a.slug}`;
                return (
                  <Link
                    key={a.slug}
                    href={href}
                    className="rounded-xl border border-border/50 p-3.5 sm:p-4 transition-all hover:border-border hover:shadow-md"
                    style={{ borderLeftColor: a.color, borderLeftWidth: 3 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{a.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {a.parties} {a.parties === 1 ? "party" : "parties"} &middot; {a.totalCandidates} candidates
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: a.color }}>
                          {a.seats}
                        </p>
                        <p className="text-[10px] text-muted-foreground">seats</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {/* Seat bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-8 shrink-0">Seats</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${seatShare}%`, backgroundColor: a.color }}
                          />
                        </div>
                        <span className="text-[10px] tabular-nums font-medium w-10 text-right shrink-0">
                          {seatShare > 0 ? `${seatShare.toFixed(1)}%` : "—"}
                        </span>
                      </div>

                      {/* Vote bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-8 shrink-0">Votes</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all opacity-70"
                            style={{ width: `${voteShare}%`, backgroundColor: a.color }}
                          />
                        </div>
                        <span className="text-[10px] tabular-nums font-medium w-10 text-right shrink-0">
                          {voteShare > 0 ? `${voteShare.toFixed(1)}%` : "—"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seats by Alliance — full width */}
      {allianceResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Seats by Alliance</CardTitle>
              <span className="text-sm text-muted-foreground">{totalSeats} seats</span>
            </div>
          </CardHeader>
          <CardContent>
            <AllianceDonut
              data={allianceResults.map((a) => ({
                name: a.shortName,
                seats: a.seats,
                color: a.color,
              }))}
            />
          </CardContent>
        </Card>
      )}

      {/* Seats by Party Donut */}
      {totalSeats > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Seats by Party</CardTitle>
              <span className="text-sm text-muted-foreground">{totalSeats} seats</span>
            </div>
          </CardHeader>
          <CardContent>
            <SeatDonut
              data={seatsByParty.map((p) => ({
                name: p.short_name || p.name_en || p.name_bn,
                slug: p.slug,
                seats: Number(p.seats),
              }))}
            />
          </CardContent>
        </Card>
      )}

      {/* Gauges Row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Voter Turnout</CardTitle>
          </CardHeader>
          <CardContent>
            <TurnoutGauge percentage={turnout} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rejected Ballots</CardTitle>
          </CardHeader>
          <CardContent>
            <TurnoutGauge
              percentage={stats.totalVotesCast > 0 ? (stats.totalRejected / stats.totalVotesCast) * 100 : 0}
              label="Rejected Votes"
            />
            <p className="text-center text-xs text-muted-foreground -mt-4">
              {formatNumber(stats.totalRejected)} of {formatNumber(stats.totalVotesCast)} votes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seats vs Votes Comparison */}
      {seatsByParty.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Seats vs Votes Share</CardTitle>
              <span className="text-sm text-muted-foreground">Top parties</span>
            </div>
          </CardHeader>
          <CardContent>
            <SeatsVsVotesChart
              data={seatsByParty.map((p) => ({
                name: p.short_name || p.name_en || p.name_bn,
                slug: p.slug,
                seatShare: totalSeats > 0 ? (Number(p.seats) / totalSeats) * 100 : 0,
                voteShare: stats.totalVotesCast > 0 ? (Number(p.totalVotes) / stats.totalVotesCast) * 100 : 0,
              }))}
            />
          </CardContent>
        </Card>
      )}

      {/* Bar Charts Row */}
      {seatsByParty.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Seats by Party</CardTitle>
                <span className="text-sm text-muted-foreground">Top 10</span>
              </div>
            </CardHeader>
            <CardContent>
              <PartyBarChart
                data={seatsByParty.map((p) => ({
                  name: p.short_name || p.name_en || p.name_bn,
                  slug: p.slug,
                  seats: Number(p.seats),
                }))}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Votes by Party</CardTitle>
                <span className="text-sm text-muted-foreground">Top 10</span>
              </div>
            </CardHeader>
            <CardContent>
              <VoteShareBarChart
                data={seatsByParty
                  .slice()
                  .sort((a, b) => Number(b.totalVotes) - Number(a.totalVotes))
                  .map((p) => ({
                    name: p.short_name || p.name_en || p.name_bn,
                    slug: p.slug,
                    votes: Number(p.totalVotes),
                  }))}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Party Results Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Results by Party</CardTitle>
            <Link
              href="/parties"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {seatsByParty.length === 0 ? (
            <EmptyState message="No party results available yet" />
          ) : (<>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead className="text-right">Seats Won</TableHead>
                  <TableHead className="text-right">Total Votes</TableHead>
                  <TableHead className="w-36">Vote Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seatsByParty.map((p, i) => {
                  const share = stats.totalVotesCast > 0
                    ? (Number(p.totalVotes) / stats.totalVotesCast) * 100
                    : 0;
                  const color = getPartyColor(p.slug);
                  return (
                    <TableRow key={p.id} className="group">
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <Link
                          href={`/parties/${p.slug}`}
                          className="font-medium group-hover:text-primary transition-colors"
                        >
                          {p.name_en || p.name_bn}
                          {p.short_name && (
                            <span className="ml-1.5 text-muted-foreground font-normal">
                              {p.short_name}
                            </span>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold tabular-nums">{p.seats}</span>
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
          </div>

          {/* Mobile */}
          <div className="space-y-3 md:hidden">
            {seatsByParty.map((p, i) => {
              const share = stats.totalVotesCast > 0
                ? (Number(p.totalVotes) / stats.totalVotesCast) * 100
                : 0;
              const color = getPartyColor(p.slug);
              return (
                <Link key={p.id} href={`/parties/${p.slug}`} className="block">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: color }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{p.name_en || p.name_bn}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatNumber(p.totalVotes)} votes ({share > 0 ? `${share.toFixed(1)}%` : "—"})
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold tabular-nums">{p.seats}</p>
                      <p className="text-xs text-muted-foreground">seats</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          </>)}
        </CardContent>
      </Card>
    </div>
  );
}
