import { ImageResponse } from "next/og";

export const alt = "GSO — Upload & share files and links";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card for every route that doesn't override its own image. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a12",
          color: "#e8e8e8",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#c0c0c0",
          }}
        >
          GSO
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 86,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Drop a file. Share a link.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 36,
            color: "#a0a0a0",
          }}
        >
          Fast, no-account file &amp; link sharing — www.wksl.site
        </div>
      </div>
    ),
    { ...size },
  );
}
