import { NextRequest, NextResponse } from "next/server";
import { getPartyBySlug, getPartyCandidates } from "@/lib/queries/parties";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") || "1"));

  const party = await getPartyBySlug(slug);
  if (!party) return NextResponse.json(null, { status: 404 });

  const result = await getPartyCandidates(party.id, { page, pageSize: 20 });
  if (Array.isArray(result)) {
    return NextResponse.json({ data: result, page: 1, pageSize: result.length, total: result.length, totalPages: 1 });
  }
  return NextResponse.json(result);
}
