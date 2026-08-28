import React from "react";
import { Icon } from "./Icon";
import { COLORS } from "../theme";
import { StatBar } from "./StatBar";
import { Frame } from "./Frame";
import type { Character } from "../../engine/shared/objects/Character";

const BOND_COLORS: Record<string, string> = {
  mother: COLORS.moss,
  father: COLORS.moss,
  friend: COLORS.gold,
  love: COLORS.oxblood,
};

function bondColor(id: string): string {
  if (BOND_COLORS[id]) return BOND_COLORS[id];
  if (id.startsWith("sibling-")) return COLORS.steel;
  return COLORS.gold;
}

export function RelationshipPanel({ character }: { character: Character }) {
  const loveMet = !!character.getFlag("loveMet");
  const married = !!character.getFlag("married");

  const bonds = Array.from(character.relationships.values()).filter(
    (bond) => bond.id !== "love" || loveMet
  );

  if (bonds.length === 0) return null;

  return (
    <Frame className="mt">
      <div className="panel-title caps">
        <Icon name="threeFriends" size={18} /> Bonds
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0 20px" }}>
        {bonds.map((bond) => (
          <div className="rel" key={bond.id}>
            <div className="rel-portrait" />
            <div className="rel-body">
              <StatBar
                label={bond.id === "love" && married ? "Spouse" : bond.label}
                value={bond.score}
                color={bondColor(bond.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
