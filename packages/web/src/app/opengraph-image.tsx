import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export const runtime = "edge";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#f42a41",
            marginBottom: 30,
          }}
        />
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 24,
            marginTop: 20,
            opacity: 0.85,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  );
}
