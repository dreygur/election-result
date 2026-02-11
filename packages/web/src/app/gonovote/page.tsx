import type { Metadata } from "next";
import { getNationalReferendumStats, getReferendumByConstituency } from "@/lib/queries/referendum";
import { GonovoteView } from "@/views/gonovote-view";

export const metadata: Metadata = {
  title: "Gonovote — Constitutional Referendum",
  description: "Results of the 2026 Bangladesh constitutional referendum (গণভোট) on the July Charter reforms.",
};

export default async function GonovotePage() {
  const [stats, constituencies] = await Promise.all([
    getNationalReferendumStats(),
    getReferendumByConstituency(),
  ]);

  return <GonovoteView stats={stats} constituencies={constituencies} />;
}
