export type HideoutItemRequirement = {
  itemId: string;
  quantity: number;
};

export const WORKBENCH_LEVEL_ONE_DURATION_SECONDS = 30;

export const workbenchLevelOneRequirements: HideoutItemRequirement[] = [
  { itemId: "part_bolt_pack", quantity: 2 },
  { itemId: "part_screw_pack", quantity: 2 },
  { itemId: "tool_toolbox", quantity: 1 },
  { itemId: "part_duct_tape", quantity: 1 },
];
