import React from "react";
import { COLORS } from "../theme";

export function WaxButton({
  children,
  onClick,
  disabled,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 13,
        letterSpacing: "0.03em",
        padding: "10px 18px",
        borderRadius: 6,
        border: `1px solid ${disabled ? "#88888055" : COLORS.oxblood}`,
        background: disabled ? "#00000010" : COLORS.oxblood,
        color: disabled ? "#00000055" : COLORS.parchment,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 2px 0 #5e241c",
        transition: "transform 0.1s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
