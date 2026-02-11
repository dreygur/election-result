import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALLIANCES } from "@/lib/alliances";
import { getAlliancePartyBreakdown, getAllianceConstituencies } from "@/lib/queries/alliances";
import { AllianceDetailView } from "@/views/alliance-detail-view";

export function generateStaticParams() {
  return ALLIANCES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const alliance = ALLIANCES.find((a) => a.slug === slug);
  if (!alliance) return {};
  return { title: alliance.name };
}

export default async function AlliancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alliance = ALLIANCES.find((a) => a.slug === slug);
  if (!alliance) notFound();

  const [parties, constituencies] = await Promise.all([
    getAlliancePartyBreakdown(slug),
    getAllianceConstituencies(slug),
  ]);

  return (
    <AllianceDetailView
      alliance={alliance}
      parties={parties}
      constituencies={constituencies}
    />
  );
}
