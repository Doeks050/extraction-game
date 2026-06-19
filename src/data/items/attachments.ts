import type { GameItem } from "../../types/items";

export const attachments: GameItem[] = [
  {
    id: "att_red_dot",
    name: "Compact Red Dot",
    category: "attachment",
    rarity: "common",
    weightKg: 0.18,
    value: 5200,
    maxStack: 1,
    gridSize: { width: 1, height: 1 },
    description: "Simple close-range optic for faster target acquisition.",
    tags: ["optic", "sight"],
    stats: { ergonomics: 4 },
  },
];
