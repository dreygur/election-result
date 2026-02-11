import Link from "next/link";
import Image from "next/image";
import { Vote, Percent, MapPin } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { SeatDonut } from "@/components/charts/seat-donut";
import { EmptyState } from "@/components/empty-state";
import { PersonCardIllustration } from "@/components/illustrations/person-card";
import { Badge } from "@/components/ui/badge";
import { PartyBadge } from "@/components/party-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber, formatPercent, imageUrl } from "@/lib/utils";
import { getPartyColor } from "@/lib/party-colors";

type CandidateDetail = {
  id: number;
  name_bn: string;
  name_en: string | null;
  photo_url: string | null;
  symbol: string | null;
  symbol_url: string | null;
  total_votes: number | null;
  is_winner: boolean;
  constituencyName: string;
  constituencySlug: string;
  constituencyTotalVotes: number | null;
  districtName: string;
  partyName: string | null;
  partyNameBn: string | null;
  partySlug: string | null;
  partyShortName: string | null;
};

type CenterResultRow = {
  centerId: number;
  center_number: number;
  centerName: string;
  total_voters: number | null;
  total_votes_cast: number | null;
  constituency_id: number;
  votes: number;
};

export function CandidateView({
  candidate,
  centerResults,
}: {
  candidate: CandidateDetail;
  centerResults: CenterResultRow[];
}) {
  const c = candidate;
  const color = getPartyColor(c.partySlug);
  const otherVotes = (c.constituencyTotalVotes ?? 0) - (c.total_votes ?? 0);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#006A4E]/10 bg-gradient-to-r from-[#006A4E]/5 via-white to-[#F42A41]/5 p-5 sm:p-8">
        <PersonCardIllustration className="absolute -right-4 -top-2 hidden h-44 w-44 opacity-35 sm:block" />
        <div className="relative">
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/constituencies/${c.constituencySlug}`}
              className="hover:underline"
            >
              {c.constituencyName}
            </Link>{" "}
            / {c.districtName}
          </p>
          <div className="mt-4 flex items-start gap-6">
            {c.photo_url && (
              <Image
                src={imageUrl(c.photo_url)}
                alt={c.name_bn}
                width={160}
                height={200}
                className="rounded-xl border border-border/50 shadow-lg"
              />
            )}
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{c.name_bn}</h1>
                {c.name_en && (
                  <p className="text-lg text-muted-foreground">{c.name_en}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {c.symbol_url && (
                  <Image
                    src={imageUrl(c.symbol_url)}
                    alt={c.symbol || ""}
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                  />
                )}
                <PartyBadge
                  name={c.partyName || c.partyNameBn}
                  slug={c.partySlug}
                  shortName={c.partyShortName}
                />
                {c.is_winner && <Badge variant="winner">Winner</Badge>}
              </div>
              {c.symbol && !c.symbol_url && (
                <p className="text-sm text-muted-foreground">
                  Symbol: {c.symbol}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Total Votes" value={c.total_votes ?? 0} icon={Vote} accentColor="#006A4E" />
        <StatsCard
          label="Vote Share"
          value={formatPercent(c.total_votes, c.constituencyTotalVotes)}
          icon={Percent}
          accentColor="#F42A41"
        />
        <StatsCard label="Constituency" value={c.constituencyName} icon={MapPin} accentColor="#D4A017" />
      </div>

      {/* Vote Share Donut */}
      {(c.total_votes ?? 0) > 0 && (c.constituencyTotalVotes ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vote Share</CardTitle>
          </CardHeader>
          <CardContent>
            <SeatDonut
              data={[
                { name: c.name_bn, slug: c.partySlug || "independent", seats: c.total_votes ?? 0 },
                { name: "Others", slug: "independent", seats: Math.max(0, otherVotes) },
              ]}
            />
          </CardContent>
        </Card>
      )}

      {/* Center-wise Results */}
      <Card>
        <CardHeader>
          <CardTitle>Center-wise Results ({centerResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {centerResults.length === 0 ? (
            <EmptyState message="No center-wise results available" />
          ) : (<>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Polling Station</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                  <TableHead className="text-right">Station Total</TableHead>
                  <TableHead className="w-32">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centerResults.map((cr) => {
                  const share = cr.total_votes_cast && cr.total_votes_cast > 0
                    ? (cr.votes / cr.total_votes_cast) * 100
                    : 0;
                  return (
                    <TableRow key={cr.centerId}>
                      <TableCell className="text-muted-foreground">{cr.center_number}</TableCell>
                      <TableCell>
                        <Link
                          href={`/constituencies/${c.constituencySlug}/centers/${cr.centerId}`}
                          className="font-medium hover:underline"
                        >
                          {cr.centerName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatNumber(cr.votes)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(cr.total_votes_cast)}
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
          <div className="space-y-2 md:hidden">
            {centerResults.map((cr) => {
              const share = cr.total_votes_cast && cr.total_votes_cast > 0
                ? (cr.votes / cr.total_votes_cast) * 100
                : 0;
              return (
                <Link
                  key={cr.centerId}
                  href={`/constituencies/${c.constituencySlug}/centers/${cr.centerId}`}
                  className="block"
                >
                  <div className="rounded-lg border border-border/50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          <span className="text-muted-foreground">#{cr.center_number}</span>{" "}
                          {cr.centerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatNumber(cr.total_votes_cast)} total votes cast
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold tabular-nums">{formatNumber(cr.votes)}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {share > 0 ? `${share.toFixed(1)}%` : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${share}%`, backgroundColor: color }}
                      />
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
