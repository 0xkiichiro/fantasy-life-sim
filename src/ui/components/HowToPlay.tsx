import React from "react";
import { Frame } from "./Frame";
import { CarvedButton } from "./CarvedButton";

const SECTIONS = [
  {
    heading: "You age one year at a time",
    body: "Each year brings a handful of events. Some are quiet flavour, some ask you to choose. Childhood happens to you; from sixteen onward, you choose a class and the world starts asking real questions.",
  },
  {
    heading: "You cannot afford everything",
    body: "Every year grants a small pool of Social and Proficiency points, and the year will always offer you more events than you can pay for. This is the heart of the game, not a bug. Letting something go is a move, not a failure.",
  },
  {
    heading: "Neglect has consequences",
    body: "Relationships with your mother, father, friend and love interest each carry a score. Spend time on them and they open new paths: a mentorship, a dowry, a family secret. Ignore them long enough and the story notices.",
  },
  {
    heading: "Risk is real",
    body: "Dangerous choices roll dice. Better stats tilt the odds but never guarantee the outcome, and some rolls can end the life outright. Play safe and you will still die eventually, of old age.",
  },
];

export function HowToPlay({ onBack }: { onBack: () => void }) {
  return (
    <div className="app">
      <Frame material="parchment">
        <h2 className="help-title">How to Play</h2>
        <div className="help-rule" />
        {SECTIONS.map((section) => (
          <div className="help-section" key={section.heading}>
            <h3 className="help-heading">{section.heading}</h3>
            <p className="help-body">{section.body}</p>
          </div>
        ))}
      </Frame>
      <div className="menu-actions">
        <CarvedButton className="secondary" onClick={onBack}>
          Back
        </CarvedButton>
      </div>
    </div>
  );
}
