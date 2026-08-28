import React from "react";

function Filigree({ position }: { position: string }) {
  return (
    <svg className={`filigree ${position}`} viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M0.5 16.5V4.5C0.5 2.29 2.29 0.5 4.5 0.5H16.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 12V6C4 4.9 4.9 4 6 4H12" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function Frame({
  children,
  material = "oak",
  className = "",
  style,
}: {
  children: React.ReactNode;
  material?: "oak" | "parchment";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`frame ${className}`} style={style}>
      <span className="rivet tl" />
      <span className="rivet tr" />
      <span className="rivet bl" />
      <span className="rivet br" />
      <Filigree position="tl" />
      <Filigree position="tr" />
      <Filigree position="bl" />
      <Filigree position="br" />
      <div className={`well ${material === "parchment" ? "parch" : ""}`}>{children}</div>
    </div>
  );
}
