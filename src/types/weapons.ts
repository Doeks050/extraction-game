export type WeaponAttachmentSlotId =
  | "optic"
  | "muzzle"
  | "barrel"
  | "magazine"
  | "grip"
  | "stock"
  | "handguard"
  | "light_laser";

export type WeaponAttachmentSlot = {
  id: WeaponAttachmentSlotId;
  label: string;
  equippedItemId?: string;
};
