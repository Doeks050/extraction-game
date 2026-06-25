import type { GameItem } from "../../types/items";

export const STANDARD_FILAMENT_CAPACITY_UNITS = 100;

export const threeDPrinterSupplies: GameItem[] = [
  {
    id: "printer_filament_spool",
    name: "Filament Spool",
    category: "hideout_material",
    rarity: "uncommon",
    weightKg: 1.2,
    value: 5200,
    maxStack: 1,
    gridSize: { width: 2, height: 2 },
    image: "/items/loot/materials/filament-spool.png",
    description: "A full spool of printing filament used by the hideout 3D printer.",
    tags: ["loot", "printer", "filament", "consumable"],
    filamentCapacityUnits: STANDARD_FILAMENT_CAPACITY_UNITS,
  },
];
