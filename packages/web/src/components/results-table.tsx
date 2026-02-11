import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PartyBadge } from "@/components/party-badge";
import { formatNumber } from "@/lib/utils";
import { getPartyColor } from "@/lib/party-colors";
import { EmptyState } from "@/components/empty-state";

type CandidateRow = {
  id: number;
  name_bn: string;
  name_en: string | null;
  photo_url?: string | null;
  total_votes: number | null;
  is_winner: boolean;
  partyName: string | null;
  partyNameBn: string | null;
  partySlug: string | null;
  partyShortName: string | null;
  symbol_url?: string | null;
};

export function ResultsTable({ candidates }: { candidates: CandidateRow[] }) {
  if (candidates.length === 0) {
    return <EmptyState message="No candidate data available" />;
  }

  const maxVotes = Math.max(...candidates.map((c) => c.total_votes ?? 0), 1);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Party</TableHead>
              <TableHead className="w-48">Votes</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((c, i) => {
              const pct = ((c.total_votes ?? 0) / maxVotes) * 100;
              const color = getPartyColor(c.partySlug);
              return (
                <TableRow
                  key={c.id}
                  className={
                    c.is_winner
                      ? "border-l-2 border-l-success bg-success/5"
                      : ""
                  }
                >
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {c.photo_url && (
                        <Image
                          src={c.photo_url}
                          alt={c.name_bn}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover border border-border/50"
                        />
                      )}
                      <Link href={`/candidates/${c.id}`} className="font-medium hover:underline">
                        {c.name_bn}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {c.symbol_url && (
                        <Image
                          src={c.symbol_url}
                          alt=""
                          width={20}
                          height={20}
                          className="h-5 w-5 object-contain"
                        />
                      )}
                      <PartyBadge
                        name={c.partyName || c.partyNameBn}
                        slug={c.partySlug}
                        shortName={c.partyShortName}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="tabular-nums font-medium">
                        {formatNumber(c.total_votes)}
                      </span>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {c.is_winner && <Badge variant="winner">Winner</Badge>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="space-y-2 md:hidden">
        {candidates.map((c, i) => {
          const pct = ((c.total_votes ?? 0) / maxVotes) * 100;
          const color = getPartyColor(c.partySlug);
          return (
            <div
              key={c.id}
              className={`rounded-lg border p-3 ${
                c.is_winner ? "border-success/30 bg-success/5" : "border-border/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
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
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">#{i + 1}</span>
                        <Link href={`/candidates/${c.id}`} className="text-sm font-medium truncate hover:underline">
                          {c.name_bn}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 ml-9">
                    <PartyBadge
                      name={c.partyName || c.partyNameBn}
                      slug={c.partySlug}
                      shortName={c.partyShortName}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">{formatNumber(c.total_votes)}</p>
                  {c.is_winner && <Badge variant="winner" className="mt-1">Winner</Badge>}
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
