import React from "react";
import { Icon } from "./Icon";
import { familyTrait } from "../../content/familyTraits";
import type { IconName } from "../objects/IconName";
import type { Relationship } from "../../engine/shared/objects/Relationship";

export function KinRow({ kin, characterAge }: { kin: Relationship; characterAge: number }) {
  const age = kin.ageAt(characterAge);

  return (
    <div className="kin">
      <div className="kin-portrait" />
      <div className="kin-main">
        <span className="kin-name">{kin.name || kin.label}</span>
        <span className="kin-rel">
          {kin.name ? kin.label : ""}
          {age !== null ? `${kin.name ? ", " : ""}age ${age}` : ""}
        </span>
      </div>
      <div className="kin-traits">
        {kin.traits.map((id) => {
          const trait = familyTrait(id);
          if (!trait) return null;
          return (
            <span className="trait" key={id} tabIndex={0}>
              <Icon name={trait.icon as IconName} size={17} />
              <span className="trait-tip">
                <b>{trait.label}</b>
                {trait.description}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
