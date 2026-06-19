import type { GameItem } from "../../types/items";

export const gearItems: GameItem[] = [
  {
    id: "armor_defender_iv",
    name: "Defender IV",
    category: "chest_gear",
    rarity: "rare",
    weightKg: 8.4,
    value: 47200,
    maxStack: 1,
    gridSize: { width: 2, height: 3 },
    description: "Heavy chest gear with strong protection and reduced mobility.",
    tags: ["chest", "armor"],
    stats: { armorClass: 4, durability: 88 },
  },
  {
    id: "helmet_fast_mt",
    name: "FAST MT",
    category: "helmet",
    rarity: "uncommon",
    weightKg: 1.4,
    value: 18400,
    maxStack: 1,
    gridSize: { width: 2, height: 2 },
    description: "Light combat helmet with modular mounting points.",
    tags: ["helmet", "armor"],
    stats: { armorClass: 3, durability: 91 },
  },
];
