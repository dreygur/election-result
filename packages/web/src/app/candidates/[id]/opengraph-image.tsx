import { ImageResponse } from "next/og";
import { getCandidateById } from "@/lib/queries/candidates";

export const runtime = "nodejs";
export const alt = "Candidate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidateById(Number(id));
  if (!candidate) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #006a4e 0%, #004d38 60%, #3a0a0a 100%)",
          color: "white",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.8, marginBottom: 10 }}>
          Candidate
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {candidate.name_bn}
        </div>
        <div style={{ fontSize: 26, marginTop: 16, opacity: 0.85 }}>
          {candidate.constituencyName}
        </div>
      </div>
    ),
    { ...size }
  );
}
