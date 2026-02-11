import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getConstituencyBySlug,
  getConstituencyCandidates,
  getConstituencyCenters,
  getAllConstituencySlugs,
} from "@/lib/queries/constituencies";
import { ConstituencyLive } from "@/components/live/constituency-live";

export async function generateStaticParams() {
  const slugs = await getAllConstituencySlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getConstituencyBySlug(slug);
  if (!c) return {};
  return { title: c.name_en };
}

export default async function ConstituencyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const constituency = await getConstituencyBySlug(slug);
  if (!constituency) notFound();

  const [candidates, centersResult] = await Promise.all([
    getConstituencyCandidates(constituency.id),
    getConstituencyCenters(constituency.id, { page, pageSize: 20 }),
  ]);

  const isPaginated = !Array.isArray(centersResult);
  const centers = isPaginated ? centersResult.data : centersResult;
  const centersPagination = isPaginated
    ? { page: centersResult.page, pageSize: centersResult.pageSize, totalPages: centersResult.totalPages, total: centersResult.total }
    : undefined;

  return (
    <ConstituencyLive
      constituency={constituency}
      candidates={candidates}
      centers={centers}
      centersPagination={centersPagination}
    />
  );
}
