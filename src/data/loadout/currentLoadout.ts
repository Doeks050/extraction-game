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
      id: "secondary",
      label: "Secondary Weapon",
    },
    {
      id: "sidearm",
      label: "Sidearm",
      itemId: "wpn_glock19x",
      quantity: 1,
    },
    {
      id: "armor",
      label: "Armor",
      itemId: "armor_defender_iv",
      quantity: 1,
    },
    {
      id: "helmet",
      label: "Helmet",
      itemId: "helmet_fast_mt",
      quantity: 1,
    },
    {
      id: "rig",
      label: "Chest Rig",
    },
    {
      id: "backpack",
      label: "Backpack",
    },
  ],
  quickSlots: [
    {
      id: "quick_1",
      label: "Med 1",
      itemId: "med_ifak",
      quantity: 1,
    },
    {
      id: "quick_2",
      label: "Med 2",
      itemId: "med_bandage",
      quantity: 2,
    },
    {
      id: "quick_3",
      label: "Utility",
    },
    {
      id: "quick_4",
      label: "Reserve",
    },
  ],
  ammoReserve: [
    {
      itemId: "ammo_556_m855a1",
      quantity: 60,
    },
    {
      itemId: "ammo_9x19_fmj",
      quantity: 60,
    },
  ],
};
