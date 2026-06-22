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

export type ItemGridSize = {
  width: number;
  height: number;
};

export type ItemStatBlock = {
  damage?: number;
  penetration?: number;
  armorClass?: number;
  capacity?: number;
  healing?: number;
  ergonomics?: number;
  recoilControl?: number;
  accuracy?: number;
  handling?: number;
  fireRate?: number;
  effectiveRange?: number;
};

export type GameItem = {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  weightKg: number;
  value: number;
  maxStack: number;
  gridSize: ItemGridSize;
  description: string;
  tags: string[];
  image?: string;
  stats?: ItemStatBlock;
};

export type InventoryGridPosition = {
  column: number;
  row: number;
};

export type InventorySlot = {
  slotId: string;
  itemId: string;
  quantity: number;
  currentDurability?: number;
  gridPosition?: InventoryGridPosition;
  isRotated?: boolean;
};

export type ItemCategoryDefinition = {
  id: ItemCategory;
  label: string;
  shortLabel: string;
};
