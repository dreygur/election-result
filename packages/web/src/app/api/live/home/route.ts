import { NextResponse } from "next/server";
import { getOverallStats, getSeatsByParty } from "@/lib/queries/stats";
import { getAllianceResults } from "@/lib/queries/alliances";

export const dynamic = "force-dynamic";

export async function GET() {
  const [stats, seatsByParty, allianceResults] = await Promise.all([
    getOverallStats(),
    getSeatsByParty(),
    getAllianceResults(),
  ]);
  return NextResponse.json({ stats, seatsByParty, allianceResults });
}
