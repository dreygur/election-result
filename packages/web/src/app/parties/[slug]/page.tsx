import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartyBySlug, getPartyCandidates, getPartyStats } from "@/lib/queries/parties";
import { PartyDetailView } from "@/views/party-detail-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const party = await getPartyBySlug(slug);
  if (!party) return {};
  return { title: party.name_en || party.name_bn };
}

export default async function PartyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const party = await getPartyBySlug(slug);
  if (!party) notFound();

  const [result, stats] = await Promise.all([
    getPartyCandidates(party.id, { page, pageSize: 20 }),
    getPartyStats(party.id),
  ]);

  const isPaginated = !Array.isArray(result);
  const candidates = isPaginated ? result.data : result;
  const pagination = isPaginated
    ? { page: result.page, pageSize: result.pageSize, totalPages: result.totalPages, total: result.total }
    : undefined;

  return (
    <PartyDetailView
      party={party}
      candidates={candidates}
      stats={stats}
      pagination={pagination}
    />
  );
}
