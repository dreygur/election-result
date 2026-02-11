import type { Metadata } from "next";
import { getConstituencies } from "@/lib/queries/constituencies";
import { getDistricts } from "@/lib/queries/districts";
import { ConstituenciesView } from "@/views/constituencies-view";

export const metadata: Metadata = { title: "Constituencies" };

export default async function ConstituenciesPage({
  searchParams,
}: {
  searchParams: Promise<{ district?: string; party?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const [result, districts] = await Promise.all([
    getConstituencies({
      districtSlug: params.district,
      partySlug: params.party,
      page,
      pageSize: 24,
    }),
    getDistricts(),
  ]);

  const isPaginated = !Array.isArray(result);
  const constituencies = isPaginated ? result.data : result;
  const pagination = isPaginated
    ? { page: result.page, pageSize: result.pageSize, totalPages: result.totalPages, total: result.total }
    : undefined;

  return (
    <ConstituenciesView
      constituencies={constituencies}
      districts={districts}
      currentDistrict={params.district}
      currentParty={params.party}
      pagination={pagination}
    />
  );
}
