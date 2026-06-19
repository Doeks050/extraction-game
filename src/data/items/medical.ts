import type { GameItem } from "../../types/items";

export const medicalItems: GameItem[] = [
  {
    id: "med_ifak",
    name: "IFAK",
    category: "medical",
    rarity: "uncommon",
    weightKg: 0.45,
    value: 3600,
    maxStack: 3,
    gridSize: { width: 1, height: 1 },
    description: "Compact field medical kit for raid recovery.",
    tags: ["medical", "healing"],
    stats: { healing: 45 },
  },
  {
    id: "med_bandage",
    name: "Bandage",
    category: "medical",
    rarity: "common",
    weightKg: 0.08,
    value: 450,
    maxStack: 5,
    gridSize: { width: 1, height: 1 },
    description: "Stops light bleeding and stabilizes minor wounds.",
    tags: ["medical", "bleed"],
    stats: { healing: 12 },
  },
];
