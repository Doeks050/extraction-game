import type { HideoutItemRequirement } from "./workbenchRequirements";

export const MINING_RIG_LEVEL_ONE_DURATION_SECONDS = 7200;

export const miningRigLevelOneRequirements: HideoutItemRequirement[] = [
  { itemId: "part_advanced_control_module", quantity: 1 },
  { itemId: "part_reinforced_equipment_rack", quantity: 1 },
  { itemId: "part_power_distribution_unit", quantity: 1 },
  { itemId: "part_thermal_management_unit", quantity: 1 },
];
