import React from "react";
import { Frame } from "./Frame";
import { CarvedButton } from "./CarvedButton";
import { Icon } from "./Icon";

export function MainMenu({
  inProgress,
  onResume,
  onNewGame,
  onHowToPlay,
}: {
  inProgress: boolean;
  onResume: () => void;
  onNewGame: () => void;
  onHowToPlay: () => void;
}) {
  return (
    <div className="title-screen">
      <div className="title-block">
        <div className="caps title-kicker">A Fantasy Life Simulator</div>
        <h1 className="title-name">A Life, Told in Chapters</h1>
        <div className="title-rule" />
        <p className="title-tagline">
          One life, one year at a time. You will not have time for everything.
        </p>
      </div>

      <Frame className="menu-frame">
        <div className="menu-stack">
          {inProgress && (
            <CarvedButton className="menu-item" onClick={onResume}>
              Resume
            </CarvedButton>
          )}
          <CarvedButton className={`menu-item ${inProgress ? "secondary" : ""}`} onClick={onNewGame}>
            New Game
          </CarvedButton>
          <CarvedButton className="menu-item secondary" onClick={onHowToPlay}>
            How to Play
          </CarvedButton>
        </div>
      </Frame>

      <p className="title-footer">
        <Icon name="scrollUnfurled" size={14} /> Art by game-icons.net, CC BY 3.0
      </p>
    </div>
  );
}
