"use client";

import { useMemo } from "react";
import { useLiveData } from "@/hooks/use-live-data";
import { CenterDetailView } from "@/views/center-detail-view";

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

type LivePayload = {
  center: {
    total_voters: number | null;
    total_votes_cast: number | null;
    valid_votes: number | null;
    rejected_votes: number | null;
    absent_voters: number | null;
  };
  results: { candidate_id: number; votes: number }[];
};

export function CenterLive({
  center,
  results,
}: {
  center: Center;
  results: CenterResultRow[];
}) {
  const live = useLiveData<LivePayload | null>(
    `/api/live/center/${center.id}`,
    null,
  );

  const mergedCenter = useMemo(() => {
    if (!live) return center;
    return { ...center, ...live.center };
  }, [center, live]);

  const mergedResults = useMemo(() => {
    if (!live) return results;
    const voteMap = new Map(live.results.map((r) => [r.candidate_id, r.votes]));
    return results.map((r) => ({
      ...r,
      votes: voteMap.get(r.candidateId) ?? r.votes,
    }));
  }, [results, live]);

  return <CenterDetailView center={mergedCenter} results={mergedResults} />;
}
