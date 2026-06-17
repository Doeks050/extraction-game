import type { MarketTrader } from "../../types/market";

export const marketTraders: MarketTrader[] = [
  {
    id: "equipment_trader",
    name: "Equipment Trader",
    role: "Gear supply",
    status: "available",
    reputationLevel: 1,
    categoryFilters: ["weapon", "ammo", "armor", "attachment"],
    description: "Basic trader slot for weapons, armor, ammo and attachments.",
  },
  {
    id: "medical_trader",
    name: "Medical Trader",
    role: "Raid recovery",
    status: "available",
    reputationLevel: 1,
    categoryFilters: ["medical", "food"],
    description: "Basic trader slot for medical items and consumables.",
  },
  {
    id: "parts_trader",
    name: "Parts Trader",
    role: "Crafting and upgrades",
    status: "available",
    reputationLevel: 1,
    categoryFilters: ["crafting", "upgrade_part", "seed"],
    description: "Basic trader slot for crafting materials and hideout upgrade parts.",
  },
  {
    id: "value_trader",
    name: "Value Trader",
    role: "Sell valuables",
    status: "available",
    reputationLevel: 1,
    categoryFilters: ["valuable", "key", "quest"],
    description: "Basic trader slot for valuables, keys and special item handling.",
  },
];
