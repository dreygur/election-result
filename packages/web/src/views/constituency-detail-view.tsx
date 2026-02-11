import Link from "next/link";
import { Users, Vote, BarChart3, XCircle } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { ResultsTable } from "@/components/results-table";
import { VoteBarChart } from "@/components/charts/vote-bar-chart";
import { CentersPaginated } from "@/components/centers-paginated";
import { VoteCountingIllustration } from "@/components/illustrations/vote-counting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { PaginationInfo } from "@/types/pagination";

type Constituency = {
  id: number;
  name_en: string;
  name_bn: string;
  slug: string;
  total_voters: number | null;
  total_votes_cast: number | null;
  total_valid_votes: number | null;
  total_rejected_votes: number | null;
  districtName: string;
  districtSlug: string;
};

type Candidate = {
  id: number;
  name_bn: string;
  name_en: string | null;
  photo_url: string | null;
  symbol: string | null;
  symbol_url: string | null;
  total_votes: number | null;
  is_winner: boolean;
  partyName: string | null;
  partyNameBn: string | null;
  partySlug: string | null;
  partyShortName: string | null;
};

type Center = {
  id: number;
  center_number: number;
  name_bn: string;
  total_voters: number | null;
  total_votes_cast: number | null;
};

export function ConstituencyDetailView({
  constituency,
  candidates,
  centers,
  centersPagination,
}: {
  constituency: Constituency;
  candidates: Candidate[];
  centers: Center[];
  centersPagination?: PaginationInfo;
}) {
  const c = constituency;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#006A4E]/10 bg-gradient-to-r from-[#006A4E]/5 via-white to-[#D4A017]/5 p-5 sm:p-8">
        <VoteCountingIllustration className="absolute -right-4 -top-2 hidden h-44 w-44 opacity-40 sm:block" />
        <div className="relative">
          <p className="text-sm text-muted-foreground">
            <Link href="/constituencies" className="hover:underline">
              Constituencies
            </Link>{" "}
            / {c.districtName}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{c.name_en}</h1>
          <p className="text-muted-foreground">{c.name_bn}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Voters" value={c.total_voters ?? 0} icon={Users} accentColor="#006A4E" />
        <StatsCard label="Votes Cast" value={c.total_votes_cast ?? 0} icon={Vote} accentColor="#D4A017" />
        <StatsCard
          label="Turnout"
          value={formatPercent(c.total_votes_cast, c.total_voters)}
          icon={BarChart3}
          accentColor="#006A4E"
        />
        <StatsCard label="Rejected Votes" value={c.total_rejected_votes ?? 0} icon={XCircle} accentColor="#F42A41" />
      </div>

      {/* Vote Distribution Chart */}
      {candidates.some((cd) => (cd.total_votes ?? 0) > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <VoteBarChart
              data={candidates.map((cd) => ({
                name: cd.name_bn,
                votes: cd.total_votes ?? 0,
                isWinner: cd.is_winner,
                partySlug: cd.partySlug,
              }))}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <ResultsTable candidates={candidates} />
        </CardContent>
      </Card>

      <CentersPaginated
        constituencySlug={c.slug}
        initialCenters={centers}
        initialPagination={centersPagination}
      />
    </div>
  );
}
