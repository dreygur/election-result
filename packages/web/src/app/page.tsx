import { getOverallStats, getSeatsByParty } from "@/lib/queries/stats";
import { getAllianceResults } from "@/lib/queries/alliances";
import { HomeLive } from "@/components/live/home-live";

export default async function HomePage() {
  const [stats, seatsByParty, allianceResults] = await Promise.all([
    getOverallStats(),
    getSeatsByParty(),
    getAllianceResults(),
  ]);

  return (
    <HomeLive
      stats={stats}
      seatsByParty={seatsByParty}
      allianceResults={allianceResults}
    />
  );
}
