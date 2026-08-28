import React from "react";
import { Icon } from "./Icon";
import { COLORS } from "../theme";
import { StatBar } from "./StatBar";
import { Frame } from "./Frame";
import type { Character } from "../../engine/shared/objects/Character";

export function RelationshipPanel({ character }: { character: Character }) {
  const loveMet = !!character.getFlag("loveMet");
  const married = !!character.getFlag("married");

  const bonds: Array<{ label: string; id: string; color: string }> = [
    { label: "Mother", id: "mother", color: COLORS.moss },
    { label: "Father", id: "father", color: COLORS.moss },
    { label: "Friend", id: "friend", color: COLORS.gold },
  ];

  if (loveMet) {
    bonds.push({
      label: married ? "Spouse" : "Love Interest",
      id: "love",
      color: COLORS.oxblood,
    });
  }

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
              <StatBar label={bond.label} value={character.relationshipScore(bond.id)} color={bond.color} />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
