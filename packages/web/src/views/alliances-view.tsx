import Link from "next/link";
import { ParliamentIllustration } from "@/components/illustrations/parliament";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { AllianceResult } from "@/lib/queries/alliances";

export function AlliancesView({
  alliances,
  totalSeats,
  totalVotesCast,
}: {
  alliances: AllianceResult[];
  totalSeats: number;
  totalVotesCast: number;
}) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#006A4E]/10 bg-gradient-to-r from-[#006A4E]/5 via-white to-[#F42A41]/5 p-6 sm:p-8">
        <ParliamentIllustration className="absolute -right-6 -top-2 hidden h-44 w-44 opacity-50 sm:block" />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight">Alliances</h1>
          <p className="text-muted-foreground">
            Election results grouped by political alliance
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {alliances.map((a) => {
          const seatShare = totalSeats > 0 ? (a.seats / totalSeats) * 100 : 0;
          const voteShare = totalVotesCast > 0 ? (a.totalVotes / totalVotesCast) * 100 : 0;
          return (
            <Link key={a.slug} href={a.slug === "others" ? "#" : `/alliances/${a.slug}`} className="block">
              <Card className="h-full transition-all hover:shadow-md hover:border-border" style={{ borderTopColor: a.color, borderTopWidth: 3 }}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {a.parties} {a.parties === 1 ? "party" : "parties"} &middot; {a.totalCandidates} candidates
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-3xl font-bold tabular-nums" style={{ color: a.color }}>
                        {a.seats}
                      </p>
                      <p className="text-[10px] text-muted-foreground">seats</p>
                    </div>
                  </div>

                  {/* Seat bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Seat share</span>
                      <span className="tabular-nums font-medium">
                        {seatShare > 0 ? `${seatShare.toFixed(1)}%` : "—"}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${seatShare}%`, backgroundColor: a.color }}
                      />
                    </div>
                  </div>

                  {/* Vote bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Vote share</span>
                      <span className="tabular-nums font-medium">
                        {formatNumber(a.totalVotes)} ({voteShare > 0 ? `${voteShare.toFixed(1)}%` : "—"})
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all opacity-70"
                        style={{ width: `${voteShare}%`, backgroundColor: a.color }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
