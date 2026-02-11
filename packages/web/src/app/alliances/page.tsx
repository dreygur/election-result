import type { Metadata } from "next";
import { getAllianceResults } from "@/lib/queries/alliances";
import { getOverallStats } from "@/lib/queries/stats";
import { AlliancesView } from "@/views/alliances-view";

export const metadata: Metadata = { title: "Alliances" };

export default async function AlliancesPage() {
  const [alliances, stats] = await Promise.all([
    getAllianceResults(),
    getOverallStats(),
  ]);

  const totalSeats = alliances.reduce((s, a) => s + a.seats, 0);

  return (
    <AlliancesView
      alliances={alliances}
      totalSeats={totalSeats}
      totalVotesCast={stats.totalVotesCast}
    />
  );
}
