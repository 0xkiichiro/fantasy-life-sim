import React from "react";
import { Frame } from "./Frame";
import { CarvedButton } from "./CarvedButton";
import { HeroPortrait } from "./HeroPortrait";
import { StatBar } from "./StatBar";
import { COLORS } from "../theme";
import type { Character } from "../../engine/shared/objects/Character";

export function CharacterPreview({
  character,
  onReroll,
  onBegin,
  onBack,
}: {
  character: Character;
  onReroll: () => void;
  onBegin: () => void;
  onBack: () => void;
}) {
  const bonds = Array.from(character.relationships.values()).filter((bond) => bond.id !== "love");
  const parents = bonds.filter((bond) => bond.id === "mother" || bond.id === "father");
  const siblings = bonds.filter((bond) => bond.id.startsWith("sibling-"));

  return (
    <div className="app preview-screen">
      <div className="preview-head">
        <div className="caps title-kicker">The Life You Have Been Dealt</div>
        <h1 className="hero-name">{character.name}</h1>
      </div>

      <Frame>
        <div className="preview-body">
          <div className="portrait-frame preview-portrait">
            <span className="rivet tl" />
            <span className="rivet tr" />
            <span className="rivet bl" />
            <span className="rivet br" />
            <HeroPortrait className={character.className} />
          </div>

          <div className="preview-stats">
            <div className="panel-title caps">Born With</div>
            <StatBar label="Strength" value={character.stats.strength} color={COLORS.oxblood} />
            <StatBar label="Dexterity" value={character.stats.dexterity} color={COLORS.moss} />
            <StatBar label="Intelligence" value={character.stats.intelligence} color={COLORS.steel} />
            <StatBar label="Charisma" value={character.stats.charisma} color={COLORS.gold} />
            <div className="preview-purse">
              <span className="caps preview-purse-label">Family Purse</span>
              <span className="preview-purse-value">{character.gold}</span>
              <span className="preview-purse-unit">gold</span>
            </div>
          </div>
        </div>

        <div className="preview-bonds">
          <div className="panel-title caps">Your Household</div>
          <p className="preview-family">{character.familyDescription}</p>
          <div className="preview-bond-row">
            {parents.map((bond) => (
              <span className="preview-bond" key={bond.id}>
                {bond.label}
              </span>
            ))}
            {siblings.map((bond) => (
              <span className="preview-bond sibling" key={bond.id}>
                {bond.label}
              </span>
            ))}
            {parents.length === 0 && <span className="preview-bond absent">No living parents</span>}
          </div>
        </div>
      </Frame>

      <p className="note">
        Your class is not chosen at birth. That comes at sixteen, and what you become
        depends on the years before it.
      </p>

      <div className="menu-actions">
        <CarvedButton className="secondary" onClick={onBack}>
          Back
        </CarvedButton>
        <CarvedButton className="secondary" onClick={onReroll}>
          Reroll
        </CarvedButton>
        <CarvedButton onClick={onBegin}>Begin This Life</CarvedButton>
      </div>
    </div>
  );
}
