export type LoadoutSlotId =
  | "primary"
  | "secondary"
  | "sidearm"
  | "armor"
  | "helmet"
  | "rig"
  | "backpack";

export type QuickSlotId = "quick_1" | "quick_2" | "quick_3" | "quick_4";

export type LoadoutSlot = {
  id: LoadoutSlotId;
  label: string;
  itemId?: string;
  quantity?: number;
};

export type QuickSlot = {
  id: QuickSlotId;
  label: string;
  itemId?: string;
  quantity?: number;
};

export type CurrentLoadout = {
  equipment: LoadoutSlot[];
  quickSlots: QuickSlot[];
  ammoReserve: {
    itemId: string;
    quantity: number;
  }[];
};

export type LoadoutStatSummary = {
  weightKg: number;
  protection: number;
  mobility: number;
  ergonomics: number;
  readinessScore: number;
  hasWeapon: boolean;
  hasArmor: boolean;
  hasMedical: boolean;
  hasAmmo: boolean;
};
