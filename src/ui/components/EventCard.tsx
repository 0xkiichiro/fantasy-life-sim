import React from "react";
import { Icon } from "./Icon";
import { CarvedButton } from "./CarvedButton";
import type { GameEvent } from "../../engine/eventEngine/objects/GameEvent";
import type { EventOption } from "../../engine/eventEngine/objects/EventOption";
import type { Character } from "../../engine/shared/objects/Character";
import type { PoolSet } from "../../engine/shared/objects/ResourcePool";

export function DeathCard({
  character,
  level,
  onRestart,
}: {
  character: Character;
  level: number;
  onRestart: () => void;
}) {
  return (
    <div className="death">
      <Icon name="deathSkull" size={44} className="death-icon" />
      <h2>The story of {character.name} ends here.</h2>
      <p style={{ fontStyle: "italic", maxWidth: 480, margin: "0 auto 8px", color: "#93805e" }}>
        {character.causeOfDeath}
      </p>
      <p style={{ fontSize: 13, color: "#93805e" }}>
        Died at age {character.age} · Level {level} {character.className || "Villager"} · Renown{" "}
        {Math.round(character.condition.renown)} · {character.gold} gold
      </p>
      <div style={{ marginTop: 20 }}>
        <CarvedButton onClick={onRestart}>Begin a New Life</CarvedButton>
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
      <div className="event-kicker">
        <div className="caps" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="scrollUnfurled" size={18} /> An Event Unfolds
        </div>
        {pendingCount > 1 && (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
            {pendingCount} events this year
          </div>
        )}
      </div>
      <p className="event-text">{event.text}</p>
      <div className="rule" />
      {options.map((opt, i) => {
        const ok = affordable(opt);
        return (
          <button key={i} className="opt" disabled={!ok} onClick={() => ok && onChoose(opt)}>
            <span>{opt.label}</span>
            {opt.cost && (
              <span className="cost">
                −{opt.cost.amount} {opt.cost.pool}
              </span>
            )}
          </button>
        );
      })}
      {!anyAffordable && (
        <button className="opt pass" onClick={onSkip}>
          Let it pass — you have nothing left to give it this year
        </button>
      )}
    </div>
  );
}
