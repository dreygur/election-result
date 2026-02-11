import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const centerId = Number(id);

  const center = await db
    .selectFrom("centers")
    .where("id", "=", centerId)
    .select([
      "total_voters",
      "total_votes_cast",
      "valid_votes",
      "rejected_votes",
      "absent_voters",
    ])
    .executeTakeFirst();

  if (!center) {
    return NextResponse.json(null, { status: 404 });
  }

  const results = await db
    .selectFrom("center_results as cr")
    .where("cr.center_id", "=", centerId)
    .select(["cr.candidate_id", "cr.votes"])
    .execute();

  return NextResponse.json({ center, results });
}
