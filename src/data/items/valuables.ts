import type { GameItem } from "../../types/items";

export const valuables: GameItem[] = [
  {
    id: "goods_green_brick",
    name: "Green Brick",
    category: "valuable",
    rarity: "rare",
    weightKg: 1.0,
    value: 45000,
    maxStack: 2,
    gridSize: { width: 1, height: 1 },
    description: "High-risk packaged contraband item for trader delivery runs.",
    tags: ["contraband", "sell-run"],
  },
  {
    id: "val_graphics_card",
    name: "Graphics Card",
    category: "valuable",
    rarity: "epic",
    weightKg: 0.7,
    value: 38500,
    maxStack: 1,
    gridSize: { width: 1, height: 1 },
    description: "Rare electronic valuable with strong market demand.",
    tags: ["valuable", "electronics"],
  },
];
