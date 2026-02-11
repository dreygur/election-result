"use client";

import { useLiveData } from "@/hooks/use-live-data";
import { HomeView } from "@/views/home-view";
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

type HomeData = {
  stats: Stats;
  seatsByParty: PartySeats[];
  allianceResults: AllianceResult[];
};

export function HomeLive({
  stats,
  seatsByParty,
  allianceResults,
}: HomeData) {
  const live = useLiveData<HomeData>("/api/live/home", {
    stats,
    seatsByParty,
    allianceResults,
  });

  return (
    <HomeView
      stats={live.stats}
      seatsByParty={live.seatsByParty}
      allianceResults={live.allianceResults}
    />
  );
}
