import React, { useMemo, useReducer } from "react";
import { Sword, Sparkles, Footprints, Shield, Coins } from "lucide-react";
import { COLORS } from "./theme";
import { StatBar } from "./components/StatBar";
import { WaxButton } from "./components/WaxButton";
import { EventCard, DeathCard } from "./components/EventCard";
import { RelationshipPanel } from "./components/RelationshipPanel";
import { gameReducer, freshState, currentOptionsFor } from "../state/gameReducer";
import { loadEventRegistry } from "../content/contentLoader";
import type { EventOption } from "../engine/eventEngine/objects/EventOption";

const CLASS_ICONS = { Warrior: Sword, Mage: Sparkles, Rogue: Footprints } as const;
const CLASS_COLORS = { Warrior: COLORS.oxblood, Mage: COLORS.moss, Rogue: COLORS.leather } as const;

export default function App() {
  const registry = useMemo(() => loadEventRegistry(), []);
  const [state, dispatch] = useReducer((s, a) => gameReducer(s, a, registry), undefined, freshState);

  const { character, pools, activeEvent, pendingEvents, log, gameOver } = state;
  const level = character.level;
  const ClassIcon = character.className ? CLASS_ICONS[character.className] : Shield;
  const classColor = character.className ? CLASS_COLORS[character.className] : COLORS.leather;

  const eventOptions: EventOption[] = useMemo(
    () => (activeEvent ? currentOptionsFor(activeEvent, character) : []),
    [activeEvent, character]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse at top, ${COLORS.parchmentDark}, ${COLORS.parchment})`,
        fontFamily: "'EB Garamond', 'Georgia', serif",
        color: COLORS.ink,
        padding: "24px 16px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap');
      `}</style>

      <div style={{ width: "100%", maxWidth: 780 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: "0.35em", color: COLORS.leather, textTransform: "uppercase" }}>
            A Life, Told in Chapters
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 30, fontWeight: 700, margin: "4px 0 0" }}>{character.name}</h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center", marginTop: 4, color: COLORS.leather, fontSize: 14 }}>
            <span>Age {character.age}</span>
            {character.className && (
              <>
                <span>·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: classColor }}>
                  <ClassIcon size={14} /> {character.className}, Level {level}
                </span>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            background: COLORS.parchment,
            border: `1px solid ${COLORS.leather}66`,
            borderRadius: 4,
            boxShadow: "0 4px 24px #00000022, inset 0 0 60px #00000008",
            padding: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -1,
              left: 0,
              right: 0,
              height: 4,
              background: `repeating-linear-gradient(90deg, ${COLORS.leather}33 0 8px, transparent 8px 16px)`,
            }}
          />

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
            <div style={{ textAlign: "center", padding: "20px 10px" }}>
              <WaxButton onClick={() => dispatch({ type: "AGE_UP" })} style={{ fontSize: 15, padding: "13px 28px" }}>
                Age Up →
              </WaxButton>
              <p style={{ fontSize: 12, color: COLORS.leather, marginTop: 10 }}>Turn the page to age {character.age + 1}.</p>
            </div>
          )}
        </div>

        {character.alive && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
            <div style={{ background: "#ffffff44", border: `1px solid ${COLORS.leather}33`, borderRadius: 4, padding: 14 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.leather, marginBottom: 8 }}>
                Core Stats
              </div>
              <StatBar label="Strength" value={character.stats.strength} color={COLORS.oxblood} />
              <StatBar label="Dexterity" value={character.stats.dexterity} color={COLORS.moss} />
              <StatBar label="Intelligence" value={character.stats.intelligence} color="#3B5A7A" />
              <StatBar label="Charisma" value={character.stats.charisma} color={COLORS.gold} />
            </div>
            <div style={{ background: "#ffffff44", border: `1px solid ${COLORS.leather}33`, borderRadius: 4, padding: 14 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.leather, marginBottom: 8 }}>
                Condition
              </div>
              <StatBar label="Health" value={character.condition.health} color={COLORS.oxblood} />
              <StatBar label="Happiness" value={character.condition.happiness} color={COLORS.gold} />
              <StatBar label="Renown" value={character.condition.renown} color={COLORS.moss} />
            </div>

            <div style={{ background: "#ffffff44", border: `1px solid ${COLORS.leather}33`, borderRadius: 4, padding: 14 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.leather, marginBottom: 8 }}>
                Resources
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 6 }}>
                <Coins size={14} color={COLORS.gold} /> {character.gold} gold
              </div>
              <div style={{ fontSize: 13, color: COLORS.leather }}>
                Proficiency: {character.proficiency} (Lvl {level})
              </div>
              {character.items.length > 0 && (
                <div style={{ fontSize: 12, marginTop: 6, color: COLORS.leather }}>
                  Items: {character.items.map((i) => i.name).join(", ")}
                </div>
              )}
            </div>

            <div style={{ background: "#ffffff44", border: `1px solid ${COLORS.leather}33`, borderRadius: 4, padding: 14 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.leather, marginBottom: 8 }}>
                Action Pools <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(this year)</span>
              </div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                Social: {pools.social.current}/{pools.social.max}
              </div>
              <div style={{ fontSize: 13 }}>
                Proficiency: {pools.proficiency.current}/{pools.proficiency.max}
              </div>
            </div>
          </div>
        )}

        {character.alive && <RelationshipPanel character={character} />}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.leather, marginBottom: 6 }}>
            The Chronicle
          </div>
          <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
            {log.map((entry, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  color: i === 0 ? COLORS.ink : COLORS.leather,
                  lineHeight: 1.4,
                  borderLeft: `2px solid ${COLORS.leather}44`,
                  paddingLeft: 8,
                }}
              >
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
