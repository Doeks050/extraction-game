import type { CurrentLoadout } from "../../types/loadout";

export const currentLoadout: CurrentLoadout = {
  equipment: [
    {
      id: "primary",
      label: "Primary Weapon",
      itemId: "wpn_m4a1",
      quantity: 1,
    },
    {
      id: "sidearm",
      label: "Side Arm",
      itemId: "wpn_glock17",
      quantity: 1,
    },
    {
      id: "chest_gear",
      label: "Chest Gear",
      itemId: "armor_defender_iv",
      quantity: 1,
    },
    {
      id: "helmet",
      label: "Head Gear",
      itemId: "helmet_fast_mt",
      quantity: 1,
    },
    {
      id: "backpack",
      label: "Backpack",
    },
  ],
  quickSlots: [],
  ammoReserve: [],
};
