import type { Metadata } from "next";
import { getParties } from "@/lib/queries/parties";
import { PartiesView } from "@/views/parties-view";

export const metadata: Metadata = { title: "Parties" };

export default async function PartiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const result = await getParties({ page, pageSize: 20 });
  const isPaginated = !Array.isArray(result);
  const parties = isPaginated ? result.data : result;
  const pagination = isPaginated
    ? { page: result.page, pageSize: result.pageSize, totalPages: result.totalPages, total: result.total }
    : undefined;

  return <PartiesView parties={parties} pagination={pagination} showChart={page === 1} />;
}
