import React, { useMemo, useReducer } from "react";
import { Icon } from "./components/Icon";
import type { IconName } from "./objects/IconName";
import { COLORS, CLASS_COLORS } from "./theme";
import { StatBar } from "./components/StatBar";
import { CarvedButton } from "./components/CarvedButton";
import { Frame } from "./components/Frame";
import { EventCard, DeathCard } from "./components/EventCard";
import { RelationshipPanel } from "./components/RelationshipPanel";
import { HeroPortrait } from "./components/HeroPortrait";
import { gameReducer, freshState, currentOptionsFor } from "../state/gameReducer";
import type { GameState, GameAction } from "../state/gameReducer";
import { loadEventRegistry } from "../content/contentLoader";
import type { EventOption } from "../engine/eventEngine/objects/EventOption";
import "./styles.css";

const CLASS_ICONS: Record<string, IconName> = {
  Warrior: "broadsword",
  Mage: "pointyHat",
  Rogue: "hood",
};

function Gem({ color }: { color: string }) {
  return (
    <span
      className="gem"
      style={{ backgroundImage: `linear-gradient(135deg, ${color}, #000000)`, backgroundColor: color }}
    />
  );
}

export default function App() {
  const registry = useMemo(() => loadEventRegistry(), []);
  const [state, dispatch] = useReducer(
    (s: GameState, a: GameAction) => gameReducer(s, a, registry),
    undefined,
    freshState
  );

  const { character, pools, activeEvent, pendingEvents, log } = state;
  const level = character.level;
  const classIcon: IconName = character.className ? CLASS_ICONS[character.className] : "roundShield";
  const classColor = character.className ? CLASS_COLORS[character.className] : COLORS.gold;

  const eventOptions: EventOption[] = useMemo(
    () => (activeEvent ? currentOptionsFor(activeEvent, character) : []),
    [activeEvent, character]
  );

  return (
    <div className="app">
      <header className="hero">
        <div className="portrait-frame">
          <span className="rivet tl" />
          <span className="rivet tr" />
          <span className="rivet bl" />
          <span className="rivet br" />
          <HeroPortrait className={character.className} />
        </div>
        <div className="hero-meta">
          <div className="caps hero-kicker">A Life, Told in Chapters</div>
          <h1 className="hero-name">{character.name}</h1>
          <div className="hero-line">
            <span>Age {character.age}</span>
            {character.className && (
              <>
                <span style={{ color: COLORS.gold }}>◆</span>
                <span className="class-chip" style={{ backgroundColor: classColor }}>
                  <Icon name={classIcon} size={14} /> {character.className} · Level {level}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {character.alive && (
        <div className="resource-strip">
          <Frame>
            <Gem color={COLORS.gold} />
            <span className="res-val">{character.gold}</span>
            <span className="res-lbl">Gold</span>
          </Frame>
          <Frame>
            <Gem color={COLORS.steel} />
            <span className="res-val">
              {pools.social.current}/{pools.social.max}
            </span>
            <span className="res-lbl">Social</span>
          </Frame>
          <Frame>
            <Gem color={COLORS.moss} />
            <span className="res-val">
              {pools.proficiency.current}/{pools.proficiency.max}
            </span>
            <span className="res-lbl">Prof.</span>
          </Frame>
          <Frame>
            <Gem color={COLORS.amethyst} />
            <span className="res-val">{character.proficiency}</span>
            <span className="res-lbl">Exp</span>
          </Frame>
        </div>
      )}

      <Frame material={!character.alive || activeEvent ? "parchment" : "oak"}>
        {!character.alive ? (
          <DeathCard character={character} level={level} onRestart={() => dispatch({ type: "RESTART" })} />
        ) : activeEvent ? (
          <EventCard
            event={activeEvent}
            options={eventOptions}
            pools={pools}
            pendingCount={pendingEvents.length}
            onChoose={(option) => dispatch({ type: "RESOLVE_OPTION", option })}
            onSkip={() => dispatch({ type: "SKIP_EVENT" })}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "18px 10px" }}>
            <CarvedButton onClick={() => dispatch({ type: "AGE_UP" })}>Age Up ⟶</CarvedButton>
            <p className="note">Turn the page to age {character.age + 1}.</p>
          </div>
        )}
      </Frame>

      {character.alive && (
        <div className="grid">
          <Frame>
            <div className="panel-title caps">Core Stats</div>
            <StatBar label="Strength" value={character.stats.strength} color={COLORS.oxblood} />
            <StatBar label="Dexterity" value={character.stats.dexterity} color={COLORS.moss} />
            <StatBar label="Intelligence" value={character.stats.intelligence} color={COLORS.steel} />
            <StatBar label="Charisma" value={character.stats.charisma} color={COLORS.gold} />
          </Frame>

          <Frame>
            <div className="panel-title caps">Condition</div>
            <StatBar label="Health" value={character.condition.health} color={COLORS.oxblood} />
            <StatBar label="Happiness" value={character.condition.happiness} color={COLORS.gold} />
            <StatBar label="Renown" value={character.condition.renown} color={COLORS.amethyst} />
            {character.items.length > 0 && (
              <div style={{ marginTop: 12, fontSize: 13, color: COLORS.textDim }}>
                {character.items.map((i) => i.name).join(", ")}
              </div>
            )}
          </Frame>
        </div>
      )}

      {character.alive && <RelationshipPanel character={character} />}

      <Frame className="mt">
        <div className="panel-title caps">The Chronicle</div>
        <div className="chronicle">
          {log.map((entry, i) => (
            <div className={`entry ${i === 0 ? "latest" : ""}`} key={i}>
              {entry}
            </div>
          ))}
        </div>
      </Frame>
    </div>
  );
}
