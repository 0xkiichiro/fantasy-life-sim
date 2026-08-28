import React from "react";
import { clamp } from "../theme";

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
    <div className="stat">
      <div className="stat-row">
        <span>{label}</span>
        <b>{Math.round(value)}</b>
      </div>
      <div className="track">
        <div
          className="fill"
          style={{
            width: `${clamp((value / max) * 100)}%`,
            backgroundColor: color,
            backgroundImage:
              "linear-gradient(180deg, rgba(255,246,221,0.45), rgba(255,246,221,0.05) 45%, rgba(0,0,0,0.5))",
          }}
        />
      </div>
    </div>
  );
}
