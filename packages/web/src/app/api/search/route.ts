import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/queries/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = await search(q);
  return NextResponse.json(results);
}
