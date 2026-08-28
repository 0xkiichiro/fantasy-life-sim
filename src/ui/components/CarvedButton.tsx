import React from "react";

export function CarvedButton({
  children,
  onClick,
  disabled,
  className = "",
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button className={`cta ${className}`} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}
