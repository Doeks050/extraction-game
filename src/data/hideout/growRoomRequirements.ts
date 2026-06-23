import type { HideoutItemRequirement } from "./workbenchRequirements";

export const GROW_ROOM_LEVEL_ONE_DURATION_SECONDS = 30;

export const growRoomLevelOneRequirements: HideoutItemRequirement[] = [
  { itemId: "part_control_unit", quantity: 1 },
  { itemId: "part_grow_light", quantity: 2 },
  { itemId: "part_water_pump", quantity: 1 },
];
