import Link from "next/link";
import { StatsCard } from "@/components/stats-card";
import { PollingStationIllustration } from "@/components/illustrations/polling-station";
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
import { PartyBadge } from "@/components/party-badge";
import { formatNumber } from "@/lib/utils";

type Center = {
  id: number;
  center_number: number;
  name_bn: string;
  total_voters: number | null;
  total_votes_cast: number | null;
  valid_votes: number | null;
  rejected_votes: number | null;
  absent_voters: number | null;
  result_sheet_url: string | null;
  constituencyName: string;
  constituencySlug: string;
};

type CenterResultRow = {
  candidateId: number;
  name_bn: string;
  name_en: string | null;
  votes: number;
  is_winner: boolean;
  partyNameBn: string | null;
  partyShortName: string | null;
  partySlug: string | null;
};

export function CenterDetailView({
  center,
  results,
}: {
  center: Center;
  results: CenterResultRow[];
}) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#006A4E]/10 bg-gradient-to-r from-[#F42A41]/5 via-white to-[#006A4E]/5 p-5 sm:p-8">
        <PollingStationIllustration className="absolute -right-4 -top-2 hidden h-44 w-44 opacity-40 sm:block" />
        <div className="relative">
          <p className="text-sm text-muted-foreground">
            <Link href="/constituencies" className="hover:underline">
              Constituencies
            </Link>{" "}
            /{" "}
            <Link
              href={`/constituencies/${center.constituencySlug}`}
              className="hover:underline"
            >
              {center.constituencyName}
            </Link>{" "}
            / Center #{center.center_number}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{center.name_bn}</h1>
          <p className="text-muted-foreground">
            Polling Station #{center.center_number}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Voters" value={center.total_voters ?? 0} accentColor="#006A4E" />
        <StatsCard label="Valid Votes" value={center.valid_votes ?? 0} accentColor="#2563EB" />
        <StatsCard label="Rejected Votes" value={center.rejected_votes ?? 0} accentColor="#F42A41" />
        <StatsCard label="Absent Voters" value={center.absent_voters ?? 0} accentColor="#D97706" />
      </div>

      {center.result_sheet_url && (
        <a
          href={center.result_sheet_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          Download Result Sheet (PDF)
        </a>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <EmptyState message="No results available for this polling station" />
          ) : (<>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow key={r.candidateId}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/candidates/${r.candidateId}`}
                        className="hover:underline"
                      >
                        {r.name_bn}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <PartyBadge
                        name={r.partyNameBn}
                        slug={r.partySlug}
                        shortName={r.partyShortName}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(r.votes)}
                    </TableCell>
                    <TableCell>
                      {r.is_winner && <Badge variant="winner">Winner</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="space-y-3 md:hidden">
            {results.map((r, i) => (
              <Card key={r.candidateId} className={r.is_winner ? "border-green-600" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        <span className="text-muted-foreground">#{i + 1}</span>{" "}
                        <Link
                          href={`/candidates/${r.candidateId}`}
                          className="hover:underline"
                        >
                          {r.name_bn}
                        </Link>
                      </p>
                      <div className="mt-1">
                        <PartyBadge
                          name={r.partyNameBn}
                          slug={r.partySlug}
                          shortName={r.partyShortName}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatNumber(r.votes)}</p>
                      {r.is_winner && <Badge variant="winner">Winner</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </>)}
        </CardContent>
      </Card>
    </div>
  );
}
