import type { HideoutItemRequirement } from "./workbenchRequirements";

export const GENERATOR_LEVEL_ONE_DURATION_SECONDS = 30;

export const generatorLevelOneRequirements: HideoutItemRequirement[] = [
  { itemId: "part_electric_motor", quantity: 1 },
  { itemId: "part_electrical_components", quantity: 2 },
  { itemId: "part_mechanical_parts", quantity: 2 },
];
