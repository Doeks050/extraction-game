export type ItemCategory =
  | "weapon"
  | "ammo"
  | "magazine"
  | "attachment"
  | "chest_gear"
  | "helmet"
  | "backpack"
  | "medical"
  | "valuable"
  | "hideout_material"
  | "quest"
  | "key";

export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type ItemStatBlock = {
  damage?: number;
  penetration?: number;
  armorClass?: number;
  capacity?: number;
  healing?: number;
  durability?: number;
  ergonomics?: number;
  recoilControl?: number;
};

export type GameItem = {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  weightKg: number;
  value: number;
  maxStack: number;
  description: string;
  tags: string[];
  image?: string;
  stats?: ItemStatBlock;
};

export type InventorySlot = {
  slotId: string;
  itemId: string;
  quantity: number;
};

export type ItemCategoryDefinition = {
  id: ItemCategory;
  label: string;
  shortLabel: string;
};
