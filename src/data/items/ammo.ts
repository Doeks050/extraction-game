import type { GameItem } from "../../types/items";

export const ammoItems: GameItem[] = [
  {
    id: "ammo_556_m855a1",
    name: "5.56x45 M855A1",
    category: "ammo",
    rarity: "rare",
    weightKg: 0.012,
    value: 140,
    maxStack: 60,
    gridSize: { width: 1, height: 1 },
    description: "High-grade rifle ammunition with strong penetration.",
    tags: ["ammo", "5.56x45"],
    stats: { damage: 44, penetration: 41 },
  },
  {
    id: "ammo_9x19_fmj",
    name: "9x19 FMJ",
    category: "ammo",
    rarity: "common",
    weightKg: 0.008,
    value: 38,
    maxStack: 60,
    gridSize: { width: 1, height: 1 },
    description: "Basic pistol ammunition. Cheap, common and reliable.",
    tags: ["ammo", "9x19"],
    stats: { damage: 25, penetration: 12 },
  },
];
