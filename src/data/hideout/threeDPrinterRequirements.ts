import type { HideoutItemRequirement } from "./workbenchRequirements";

export const THREE_D_PRINTER_LEVEL_ONE_DURATION_SECONDS = 3600;

export const threeDPrinterLevelOneRequirements: HideoutItemRequirement[] = [
  { itemId: "part_control_unit", quantity: 1 },
  { itemId: "part_printer_assembly", quantity: 1 },
  { itemId: "part_cooling_fan", quantity: 1 },
];
