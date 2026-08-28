import type { FamilyTraitTemplate } from "./FamilyTraitTemplate";

export class FamilyTrait {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly weight: number;
  readonly roles: string[];

  private constructor(template: FamilyTraitTemplate) {
    this.id = template.id;
    this.label = template.label;
    this.description = template.description;
    this.icon = template.icon;
    this.weight = template.weight;
    this.roles = template.roles;
  }

  static fromTemplate(template: FamilyTraitTemplate): FamilyTrait {
    return new FamilyTrait(template);
  }
}
