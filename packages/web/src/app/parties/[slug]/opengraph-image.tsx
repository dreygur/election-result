import { ImageResponse } from "next/og";
import { getPartyBySlug } from "@/lib/queries/parties";

export const runtime = "nodejs";
export const alt = "Party Results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const party = await getPartyBySlug(slug);
  if (!party) return new Response("Not found", { status: 404 });

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
          Political Party
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {party.name_en || party.name_bn}
        </div>
        <div style={{ fontSize: 24, marginTop: 16, opacity: 0.85 }}>
          13th Bangladesh Parliament Election
        </div>
      </div>
    ),
    { ...size }
  );
}
