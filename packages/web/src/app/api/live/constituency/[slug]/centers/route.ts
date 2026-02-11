import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "kysely";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") || "1"));
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const constituency = await db
    .selectFrom("constituencies")
    .where("slug", "=", slug)
    .select("id")
    .executeTakeFirst();

  if (!constituency) {
    return NextResponse.json(null, { status: 404 });
  }

  const [data, countResult] = await Promise.all([
    db
      .selectFrom("centers")
      .where("constituency_id", "=", constituency.id)
      .select(["id", "center_number", "name_bn", "total_voters", "total_votes_cast"])
      .orderBy("center_number")
      .limit(pageSize)
      .offset(offset)
      .execute(),
    db
      .selectFrom("centers")
      .where("constituency_id", "=", constituency.id)
      .select(sql<number>`count(*)`.as("count"))
      .executeTakeFirstOrThrow(),
  ]);

  const total = Number(countResult.count);

  return NextResponse.json({
    data,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}
