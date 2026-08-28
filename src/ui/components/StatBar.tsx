import React from "react";
import { COLORS, clamp } from "../theme";

export function StatBar({
  label,
  value,
  max = 100,
  color,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
}) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: COLORS.ink,
          opacity: 0.8,
        }}
      >
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div
        style={{
          height: 7,
          background: "#00000022",
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${COLORS.leather}55`,
        }}
      >
        <div
          style={{
            width: `${clamp((value / max) * 100)}%`,
            height: "100%",
            background: color,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
