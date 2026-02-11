import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCenterById, getCenterResults } from "@/lib/queries/centers";
import { CenterLive } from "@/components/live/center-live";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; centerId: string }>;
}): Promise<Metadata> {
  const { centerId } = await params;
  const center = await getCenterById(Number(centerId));
  if (!center) return {};
  return {
    title: `Center #${center.center_number} — ${center.constituencyName}`,
    description: `Polling center #${center.center_number} results in ${center.constituencyName}.`,
  };
}

export default async function CenterPage({
  params,
}: {
  params: Promise<{ slug: string; centerId: string }>;
}) {
  const { centerId } = await params;
  const center = await getCenterById(Number(centerId));
  if (!center) notFound();

  const results = await getCenterResults(center.id);

  return <CenterLive center={center} results={results} />;
}
