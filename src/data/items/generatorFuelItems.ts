import type { GameItem } from "../../types/items";

export const JERRYCAN_FUEL_CAPACITY_SECONDS = 6 * 60 * 60;

export const generatorFuelItems: GameItem[] = [
  {
    id: "part_fuel_jerrycan",
    name: "Fuel Jerrycan",
    category: "hideout_material",
    rarity: "uncommon",
    weightKg: 10.5,
    value: 6500,
    maxStack: 1,
    gridSize: { width: 2, height: 2 },
    image: "/items/loot/materials/fuel-jerrycan.png",
    description: "A full-size fuel jerrycan that provides up to 6 hours of generator runtime.",
    tags: ["loot", "fuel", "generator", "power"],
    fuelCapacitySeconds: JERRYCAN_FUEL_CAPACITY_SECONDS,
  },
];