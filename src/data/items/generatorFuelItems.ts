import type { GameItem } from "../../types/items";

export const generatorFuelItems: GameItem[] = [
  {
    id: "part_fuel_jerrycan",
    name: "Fuel Jerrycan",
    category: "hideout_material",
    rarity: "uncommon",
    weightKg: 10.5,
    value: 6500,
    maxStack: 1,
    gridSize: { width: 2, height: 3 },
    image: "/items/loot/materials/fuel-jerrycan.png",
    description: "A full fuel jerrycan that provides 60 minutes of generator runtime.",
    tags: ["loot", "fuel", "generator", "power"],
  },
];
