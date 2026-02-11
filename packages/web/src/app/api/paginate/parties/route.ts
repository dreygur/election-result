import { NextRequest, NextResponse } from "next/server";
import { getParties } from "@/lib/queries/parties";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") || "1"));
  const result = await getParties({ page, pageSize: 20 });
  if (Array.isArray(result)) {
    return NextResponse.json({ data: result, page: 1, pageSize: result.length, total: result.length, totalPages: 1 });
  }
  return NextResponse.json(result);
}
