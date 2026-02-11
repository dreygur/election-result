import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCandidateById, getCandidateCenterResults } from "@/lib/queries/candidates";
import { CandidateView } from "@/views/candidate-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const candidate = await getCandidateById(Number(id));
  if (!candidate) return {};
  return { title: candidate.name_bn };
}

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateById(Number(id));
  if (!candidate) notFound();

  const centerResults = await getCandidateCenterResults(candidate.id);

  return <CandidateView candidate={candidate} centerResults={centerResults} />;
}
