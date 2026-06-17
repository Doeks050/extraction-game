import type { ItemCategoryDefinition } from "../../types/items";

export const itemCategories: ItemCategoryDefinition[] = [
  { id: "weapon", label: "Weapons", shortLabel: "WPN" },
  { id: "ammo", label: "Ammo", shortLabel: "AMM" },
  { id: "armor", label: "Armor", shortLabel: "ARM" },
  { id: "medical", label: "Medical", shortLabel: "MED" },
  { id: "attachment", label: "Attachments", shortLabel: "ATT" },
  { id: "crafting", label: "Crafting", shortLabel: "CRF" },
  { id: "upgrade_part", label: "Upgrade Parts", shortLabel: "UPG" },
  { id: "valuable", label: "Valuables", shortLabel: "VAL" },
  { id: "key", label: "Keys", shortLabel: "KEY" },
  { id: "seed", label: "Seeds", shortLabel: "SED" },
  { id: "quest", label: "Quest Items", shortLabel: "QST" },
  { id: "food", label: "Food", shortLabel: "FOD" },
];
