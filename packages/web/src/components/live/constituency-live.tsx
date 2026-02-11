"use client";

import { useMemo } from "react";
import { useLiveData } from "@/hooks/use-live-data";
import { ConstituencyDetailView } from "@/views/constituency-detail-view";
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

type LivePayload = {
  constituency: {
    total_voters: number | null;
    total_votes_cast: number | null;
    total_valid_votes: number | null;
    total_rejected_votes: number | null;
  };
  candidates: { id: number; total_votes: number | null; is_winner: boolean }[];
};

export function ConstituencyLive({
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
  const live = useLiveData<LivePayload | null>(
    `/api/live/constituency/${constituency.slug}`,
    null,
  );

  const mergedConstituency = useMemo(() => {
    if (!live) return constituency;
    return { ...constituency, ...live.constituency };
  }, [constituency, live]);

  const mergedCandidates = useMemo(() => {
    if (!live) return candidates;
    const map = new Map(live.candidates.map((c) => [c.id, c]));
    return candidates.map((c) => {
      const fresh = map.get(c.id);
      return fresh ? { ...c, total_votes: fresh.total_votes, is_winner: fresh.is_winner } : c;
    });
  }, [candidates, live]);

  return (
    <ConstituencyDetailView
      constituency={mergedConstituency}
      candidates={mergedCandidates}
      centers={centers}
      centersPagination={centersPagination}
    />
  );
}
