import React from "react";
import { ScrollText, Skull } from "lucide-react";
import { COLORS } from "../theme";
import { WaxButton } from "./WaxButton";
import type { GameEvent } from "../../engine/eventEngine/objects/GameEvent";
import type { EventOption } from "../../engine/eventEngine/objects/EventOption";
import type { Character } from "../../engine/shared/objects/Character";
import type { PoolSet } from "../../engine/shared/objects/ResourcePool";

export function DeathCard({ character, level, onRestart }: { character: Character; level: number; onRestart: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Skull size={40} color={COLORS.oxblood} style={{ marginBottom: 10 }} />
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, margin: "0 0 8px" }}>
        The story of {character.name} ends here.
      </h2>
      <p style={{ color: COLORS.leather, fontStyle: "italic", maxWidth: 480, margin: "0 auto 6px" }}>
        {character.causeOfDeath}
      </p>
      <p style={{ fontSize: 13, color: COLORS.leather }}>
        Died at age {character.age} · Level {level} {character.className || "Villager"} · Renown{" "}
        {Math.round(character.condition.renown)} · {character.gold} gold
      </p>
      <div style={{ marginTop: 18 }}>
        <WaxButton onClick={onRestart}>Begin a New Life</WaxButton>
      </div>
    </div>
  );
}

export function EventCard({
  event,
  options,
  pools,
  pendingCount,
  onChoose,
  onSkip,
}: {
  event: GameEvent;
  options: EventOption[];
  pools: PoolSet;
  pendingCount: number;
  onChoose: (option: EventOption) => void;
  onSkip: () => void;
}) {
  const affordable = (opt: EventOption) => !opt.cost || pools.get(opt.cost.pool).canAfford(opt.cost.amount);
  const anyAffordable = options.some(affordable);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: COLORS.leather,
            fontSize: 12,
            fontFamily: "'Cinzel', serif",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <ScrollText size={14} /> An Event Unfolds
        </div>
        {pendingCount > 1 && (
          <div style={{ fontSize: 11, color: COLORS.leather, fontFamily: "'JetBrains Mono', monospace" }}>
            {pendingCount} events this year
          </div>
        )}
      </div>
      <p style={{ fontSize: 17, lineHeight: 1.55, fontStyle: "italic", marginBottom: 18 }}>{event.text}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt, i) => {
          const ok = affordable(opt);
          return (
            <button
              key={i}
              onClick={() => ok && onChoose(opt)}
              disabled={!ok}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 4,
                border: `1px solid ${ok ? COLORS.leather + "88" : "#88888044"}`,
                background: ok ? "#ffffff55" : "#00000008",
                cursor: ok ? "pointer" : "not-allowed",
                fontFamily: "'EB Garamond', serif",
                fontSize: 15,
                color: ok ? COLORS.ink : "#00000055",
              }}
            >
              {opt.label}
              {opt.cost && (
                <span style={{ float: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.leather }}>
                  −{opt.cost.amount} {opt.cost.pool}
                </span>
              )}
            </button>
          );
        })}
        {!anyAffordable && (
          <button
            onClick={onSkip}
            style={{
              textAlign: "left",
              padding: "10px 14px",
              borderRadius: 4,
              border: `1px dashed ${COLORS.leather}88`,
              background: "transparent",
              cursor: "pointer",
              fontFamily: "'EB Garamond', serif",
              fontStyle: "italic",
              fontSize: 14,
              color: COLORS.leather,
            }}
          >
            Let it pass — you have nothing left to give it this year
          </button>
        )}
      </div>
    </div>
  );
}
