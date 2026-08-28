import React from "react";

const HELM_BY_CLASS: Record<string, string> = {
  Warrior: "#5c5a54",
  Mage: "#2f4260",
  Rogue: "#3a4530",
};

export function HeroPortrait({ className }: { className?: string | null }) {
  const helm = (className && HELM_BY_CLASS[className]) || "#4a3a24";

  return (
    <svg className="portrait" viewBox="0 0 104 124" role="img" aria-label="Hero portrait">
      <defs>
        <linearGradient id="hp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3c28" />
          <stop offset="1" stopColor="#161009" />
        </linearGradient>
        <linearGradient id="hp-face" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#6d5537" />
          <stop offset="0.5" stopColor="#3d2f1e" />
          <stop offset="1" stopColor="#1a130b" />
        </linearGradient>
        <linearGradient id="hp-cloak" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#4a3826" />
          <stop offset="1" stopColor="#120c06" />
        </linearGradient>
        <linearGradient id="hp-helm" x1="0" y1="0" x2="1" y2="0.7">
          <stop offset="0" stopColor={helm} />
          <stop offset="1" stopColor="#100c07" />
        </linearGradient>
      </defs>

      <rect width="104" height="124" fill="url(#hp-bg)" />
      <ellipse cx="52" cy="118" rx="54" ry="34" fill="#0f0a05" opacity="0.55" />
      <path d="M4 124c3-28 18-41 48-44 30 3 45 16 48 44z" fill="url(#hp-cloak)" />
      <path d="M52 80c-16 2-27 10-33 21 10-4 20-6 33-6s23 2 33 6c-6-11-17-19-33-21z" fill="#2b2015" />
      <path d="M52 24c14 0 24 11 24 29 0 19-11 33-24 33s-24-14-24-33c0-18 10-29 24-29z" fill="url(#hp-face)" />
      <path d="M34 52c4-3 9-3 13 0-4 4-10 4-13 0zM57 52c4-3 9-3 13 0-4 4-10 4-13 0z" fill="#120c06" />
      <path d="M46 70c4 2 8 2 12 0" stroke="#241809" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M28 42c0-19 11-30 24-30s24 11 24 30c0 4-1 7-2 9 0-13-3-21-8-26-7 7-28 7-34 1-3 5-5 13-4 25-1-2-2-5-2-9z" fill="url(#hp-helm)" />
      <path d="M26 40C26 19 38 8 52 8s26 11 26 32c2-25-11-36-26-36S24 15 26 40z" fill="#0d0904" />
      <path d="M28 41h48" stroke="#b08a2e" strokeWidth="1.5" opacity="0.65" />
      <path d="M52 41v10" stroke="#b08a2e" strokeWidth="1.2" opacity="0.45" />
    </svg>
  );
}
