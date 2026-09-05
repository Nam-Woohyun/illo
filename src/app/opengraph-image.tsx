import {
  ImageResponse,
} from "next/og";

export const alt =
  "ILLO social preview";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType =
  "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection:
            "column",
          justifyContent:
            "space-between",
          padding:
            "72px 84px",
          background:
            "#FFFFFF",
          color:
            "#24312E",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius:
                999,
              background:
                "#147D72",
              marginRight:
                16,
            }}
          />

          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              color:
                "#147D72",
              letterSpacing:
                "0.03em",
            }}
          >
            ILLO
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
          }}
        >
          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing:
                "-0.03em",
              maxWidth: 900,
            }}
          >
            Work information,
            made easier.
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color:
                "#4B5955",
            }}
          >
            HR & Labor Information Guide
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}