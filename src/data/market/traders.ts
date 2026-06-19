import type { MarketTrader } from "../../types/market";

export const marketTraders: MarketTrader[] = [
  {
    id: "equipment_trader",
    name: "Equipment Trader",
    role: "Gear supply",
    status: "available",
    reputationLevel: 1,
    categoryFilters: [
      "weapon",
      "ammo",
      "magazine",
      "attachment",
      "chest_gear",
      "helmet",
      "backpack",
    ],
    description: "Basic trader slot for loadout items and attachments.",
  },
  {
    id: "medical_trader",
    name: "Medical Trader",
    role: "Raid recovery",
    status: "available",
    reputationLevel: 1,
    categoryFilters: ["medical"],
    description: "Basic trader slot for medical items.",
  },
  {
    id: "parts_trader",
    name: "Parts Trader",
    role: "Hideout materials",
    status: "available",
    reputationLevel: 1,
    categoryFilters: ["hideout_material"],
    description: "Basic trader slot for hideout materials.",
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
