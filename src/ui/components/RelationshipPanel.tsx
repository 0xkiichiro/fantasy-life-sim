import React from "react";
import { Users } from "lucide-react";
import { COLORS } from "../theme";
import { StatBar } from "./StatBar";
import type { Character } from "../../engine/shared/objects/Character";

export function RelationshipPanel({ character }: { character: Character }) {
  const loveMet = !!character.getFlag("loveMet");
  const married = !!character.getFlag("married");

  return (
    <div style={{ background: "#ffffff44", border: `1px solid ${COLORS.leather}33`, borderRadius: 4, padding: 14, marginTop: 14 }}>
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: COLORS.leather,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Users size={13} /> Relationships
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px 20px" }}>
        <StatBar label="Mother" value={character.relationshipScore("mother")} color={COLORS.moss} />
        <StatBar label="Father" value={character.relationshipScore("father")} color={COLORS.moss} />
        <StatBar label="Friend" value={character.relationshipScore("friend")} color={COLORS.gold} />
        {loveMet && (
          <StatBar
            label={married ? "Spouse" : "Love Interest"}
            value={character.relationshipScore("love")}
            color={COLORS.oxblood}
          />
        )}
      </div>
    </div>
  );
}
