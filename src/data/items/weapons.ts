import type { GameItem } from "../../types/items";

export const weapons: GameItem[] = [
  {
    id: "wpn_m4a1",
    name: "M4A1",
    category: "weapon",
    rarity: "uncommon",
    weightKg: 3.1,
    value: 28500,
    maxStack: 1,
    gridSize: { width: 3, height: 1 },
    image: "/items/weapons/m4a1.png",
    description: "Reliable 5.56 rifle platform for mid-range raids.",
    tags: ["rifle", "5.56x45"],
    stats: { damage: 42, ergonomics: 58, recoilControl: 44, durability: 96 },
  },
  {
    id: "wpn_glock19x",
    name: "Glock 19X",
    category: "weapon",
    rarity: "common",
    weightKg: 0.74,
    value: 9200,
    maxStack: 1,
    gridSize: { width: 2, height: 1 },
    description: "Compact sidearm chambered in 9x19mm.",
    tags: ["pistol", "9x19"],
    stats: { damage: 24, ergonomics: 74, recoilControl: 62, durability: 94 },
  },
];
