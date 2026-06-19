import type { GameItem } from "../../types/items";

export const magazines: GameItem[] = [
  {
    id: "mag_ar_30",
    name: "AR 30-Round Magazine",
    category: "magazine",
    rarity: "common",
    weightKg: 0.12,
    value: 1800,
    maxStack: 1,
    gridSize: { width: 1, height: 1 },
    description: "Empty 30-round rifle magazine. Loading logic comes later.",
    tags: ["magazine", "5.56x45", "empty"],
    stats: { capacity: 30 },
  },
  {
    id: "mag_glock_17",
    name: "Glock 17-Round Magazine",
    category: "magazine",
    rarity: "common",
    weightKg: 0.08,
    value: 950,
    maxStack: 1,
    gridSize: { width: 1, height: 1 },
    description: "Empty pistol magazine. Loading logic comes later.",
    tags: ["magazine", "9x19", "empty"],
    stats: { capacity: 17 },
  },
];
