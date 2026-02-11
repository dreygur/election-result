"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ClientPagination } from "@/components/client-pagination";
import { DistrictFilter } from "@/components/district-filter";
import { EmptyState } from "@/components/empty-state";
import { MapDotsIllustration } from "@/components/illustrations/map-dots";
import { formatNumber, formatPercent } from "@/lib/utils";
import { getPartyColor } from "@/lib/party-colors";
import { getAllianceForParty } from "@/lib/alliances";
import type { PaginationInfo } from "@/types/pagination";

type ConstituencyItem = {
  id: number;
  name_en: string;
  name_bn: string;
  slug: string;
  total_voters: number | null;
  total_votes_cast: number | null;
  districtName: string;
  districtSlug: string;
  winnerName: string | null;
  winnerVotes: number | null;
  partyName: string | null;
  partyNameBn: string | null;
  partySlug: string | null;
  partyShortName: string | null;
  partySymbolUrl?: string | null;
};

type District = { name_en: string; slug: string };

export function ConstituenciesView({
  constituencies,
  districts,
  currentDistrict,
  currentParty,
  pagination,
}: {
  constituencies: ConstituencyItem[];
  districts: District[];
  currentDistrict?: string;
  currentParty?: string;
  pagination?: PaginationInfo;
}) {
  const displayCount = pagination ? pagination.total : constituencies.length;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#006A4E]/10 bg-gradient-to-r from-[#006A4E]/5 via-white to-[#D4A017]/5 p-5 sm:p-8">
        <MapDotsIllustration className="absolute -right-6 -top-4 hidden h-44 w-44 opacity-50 sm:block" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Constituencies</h1>
          <p className="text-muted-foreground">
            {displayCount} constituencies
            {currentDistrict && ` in selected district`}
          </p>
        </div>
      </div>

      <DistrictFilter districts={districts} currentDistrict={currentDistrict} />

      <ClientPagination
        initialData={constituencies}
        initialPagination={pagination}
        fetchUrl={(p) => {
          const params = new URLSearchParams();
          params.set("page", String(p));
          if (currentDistrict) params.set("district", currentDistrict);
          if (currentParty) params.set("party", currentParty);
          return `/api/paginate/constituencies?${params}`;
        }}
      >
        {(items) =>
          items.length === 0 ? (
            <EmptyState message="No constituencies found for the selected filters" />
          ) : (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => {
                const color = getPartyColor(c.partySlug);
                const alliance = getAllianceForParty(c.partySlug);
                const turnout = c.total_voters && c.total_votes_cast
                  ? (c.total_votes_cast / c.total_voters) * 100
                  : 0;
                return (
                  <Link key={c.id} href={`/constituencies/${c.slug}`}>
                    <div
                      className="group rounded-xl border border-border/50 bg-card p-3.5 sm:p-4 shadow-sm transition-all hover:border-border hover:shadow-md"
                      style={{ borderLeftColor: color, borderLeftWidth: 3 }}
                    >
                      {/* Header row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                            {c.name_en}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {alliance && (
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0"
                              style={{ borderColor: alliance.color, color: alliance.color }}
                            >
                              {alliance.shortName}
                            </Badge>
                          )}
                          {c.partyShortName && (
                            <Badge variant="secondary" className="text-[10px]">
                              {c.partyShortName}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5">{c.districtName}</p>

                      {/* Winner row */}
                      {c.winnerName && (
                        <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5">
                          {c.partySymbolUrl && (
                            <Image
                              src={c.partySymbolUrl}
                              alt=""
                              width={18}
                              height={18}
                              className="h-[18px] w-[18px] object-contain shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate">{c.winnerName}</p>
                          </div>
                          {c.winnerVotes != null && (
                            <p className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                              {formatNumber(c.winnerVotes)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Turnout bar */}
                      {c.total_voters != null && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${turnout}%`, backgroundColor: color, opacity: 0.7 }}
                            />
                          </div>
                          <span className="text-[10px] font-medium tabular-nums text-muted-foreground w-9 text-right shrink-0">
                            {formatPercent(c.total_votes_cast, c.total_voters)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        }
      </ClientPagination>
    </div>
  );
}
