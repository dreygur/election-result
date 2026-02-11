import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const constituency = await db
    .selectFrom("constituencies as c")
    .where("c.slug", "=", slug)
    .select([
      "c.total_voters",
      "c.total_votes_cast",
      "c.total_valid_votes",
      "c.total_rejected_votes",
    ])
    .executeTakeFirst();

  if (!constituency) {
    return NextResponse.json(null, { status: 404 });
  }

  const candidates = await db
    .selectFrom("candidates as ca")
    .innerJoin("constituencies as co", "co.id", "ca.constituency_id")
    .where("co.slug", "=", slug)
    .select(["ca.id", "ca.total_votes", "ca.is_winner"])
    .orderBy("ca.total_votes", "desc")
    .execute();

  return NextResponse.json({ constituency, candidates });
}
