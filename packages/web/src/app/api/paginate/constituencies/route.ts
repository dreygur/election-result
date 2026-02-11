import { NextRequest, NextResponse } from "next/server";
import { getConstituencies } from "@/lib/queries/constituencies";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") || "1"));
  const district = sp.get("district") || undefined;
  const party = sp.get("party") || undefined;

  const result = await getConstituencies({ districtSlug: district, partySlug: party, page, pageSize: 24 });
  if (Array.isArray(result)) {
    return NextResponse.json({ data: result, page: 1, pageSize: result.length, total: result.length, totalPages: 1 });
  }
  return NextResponse.json(result);
}
