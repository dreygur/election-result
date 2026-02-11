import Link from "next/link";
import { CheckCircle, XCircle, FileCheck, FileX } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { ReferendumDonut } from "@/components/charts/referendum-donut";
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
import { formatNumber } from "@/lib/utils";

type Stats = {
  totalYes: number;
  totalNo: number;
  totalValid: number;
  totalRejected: number;
};

type ConstituencyRow = {
  id: number;
  name_en: string;
  slug: string;
  district: string;
  yes: number;
  no: number;
  valid: number;
  rejected: number;
  yesPercent: number;
};

export function GonovoteView({
  stats,
  constituencies,
}: {
  stats: Stats;
  constituencies: ConstituencyRow[];
}) {
  const totalYesNo = stats.totalYes + stats.totalNo;
  const nationalYesPercent = totalYesNo > 0 ? (stats.totalYes / totalYesNo) * 100 : 0;

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 via-white to-pink-50/50 p-5 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.07),transparent_50%)]" />
        <div className="relative space-y-3">
          <Badge variant="outline" className="border-pink-300 text-pink-700">
            Constitutional Referendum
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Gonovote (গণভোট)
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-muted-foreground">
            Results of the 2026 constitutional referendum on the July Charter reforms,
            held alongside the 13th National Parliament Election on a pink ballot.
          </p>
          {totalYesNo > 0 && (
            <p className="text-sm font-medium text-pink-700">
              National result: {nationalYesPercent.toFixed(1)}% Yes
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Yes Votes"
          value={stats.totalYes}
          icon={CheckCircle}
          accentColor="#16a34a"
        />
        <StatsCard
          label="No Votes"
          value={stats.totalNo}
          icon={XCircle}
          accentColor="#dc2626"
        />
        <StatsCard
          label="Valid Votes"
          value={stats.totalValid}
          icon={FileCheck}
          accentColor="#2563eb"
        />
        <StatsCard
          label="Rejected Votes"
          value={stats.totalRejected}
          icon={FileX}
          accentColor="#d97706"
        />
      </div>

      {/* Donut Chart */}
      {(stats.totalYes > 0 || stats.totalNo > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Yes vs No</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferendumDonut yes={stats.totalYes} no={stats.totalNo} />
          </CardContent>
        </Card>
      )}

      {/* Constituency Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Results by Constituency</CardTitle>
        </CardHeader>
        <CardContent>
          {constituencies.length === 0 ? (
            <EmptyState message="No referendum results available yet" />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Constituency</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead className="text-right">Yes</TableHead>
                      <TableHead className="text-right">No</TableHead>
                      <TableHead className="w-40">Yes %</TableHead>
                      <TableHead className="text-right">Rejected</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {constituencies.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell>
                          <Link
                            href={`/constituencies/${c.slug}`}
                            className="font-medium group-hover:text-primary transition-colors"
                          >
                            {c.name_en}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{c.district}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatNumber(c.yes)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatNumber(c.no)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${c.yesPercent}%`,
                                  backgroundColor: c.yesPercent >= 50 ? "#16a34a" : "#dc2626",
                                }}
                              />
                            </div>
                            <span className="tabular-nums text-xs text-muted-foreground w-12 text-right">
                              {c.yesPercent > 0 ? `${c.yesPercent.toFixed(1)}%` : "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatNumber(c.rejected)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {constituencies.map((c) => (
                  <Link key={c.id} href={`/constituencies/${c.slug}`} className="block">
                    <div className="rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{c.name_en}</p>
                          <p className="text-xs text-muted-foreground">{c.district}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p
                            className="text-lg font-semibold tabular-nums"
                            style={{ color: c.yesPercent >= 50 ? "#16a34a" : "#dc2626" }}
                          >
                            {c.yesPercent > 0 ? `${c.yesPercent.toFixed(1)}%` : "—"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">yes</p>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <span>Yes: {formatNumber(c.yes)}</span>
                        <span>No: {formatNumber(c.no)}</span>
                        <span>Rej: {formatNumber(c.rejected)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
