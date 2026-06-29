import type { GameItem } from "../../types/items";

export const questItems: GameItem[] = [
  {
    id: "key_warehouse_2a",
    name: "Warehouse 2A Key",
    category: "key",
    rarity: "rare",
    weightKg: 0.01,
    value: 15600,
    maxStack: 1,
    gridSize: { width: 1, height: 1 },
    image: "/items/loot/keys/warehouse-2a-key.svg",
    description: "Unlocks a restricted warehouse loot room.",
    tags: ["key", "warehouse"],
  },
  {
    id: "quest_radio_unit",
    name: "Broken Radio Unit",
    category: "quest",
    rarity: "uncommon",
    weightKg: 1.1,
    value: 0,
    maxStack: 1,
    gridSize: { width: 2, height: 1 },
    description: "Task item requested by the Quartermaster.",
    tags: ["quest", "radio"],
  },
];
