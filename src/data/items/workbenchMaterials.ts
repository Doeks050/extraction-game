import type { GameItem } from "../../types/items";

export const workbenchMaterials: GameItem[] = [
  {
    id: "part_rubber_hose",
    name: "Rubber Hose",
    category: "hideout_material",
    rarity: "common",
    weightKg: 0.35,
    value: 1800,
    maxStack: 5,
    gridSize: { width: 1, height: 1 },
    image: "/items/loot/materials/rubber-hose.png",
    description: "A flexible reinforced hose used in pumps, cooling systems and fluid installations.",
    tags: ["loot", "material", "rubber", "water"],
  },
];
