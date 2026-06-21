export type WeaponClassId =
  | "assault_rifle"
  | "smg"
  | "pistol"
  | "sniper"
  | "machine_gun";

export type WeaponAttachmentSlotId =
  | "optic"
  | "muzzle"
  | "barrel"
  | "magazine"
  | "grip"
  | "stock"
  | "handguard"
  | "light_laser"
  | "bipod";

export type WeaponAttachmentSlot = {
  id: WeaponAttachmentSlotId;
  label: string;
  equippedItemId?: string;
};

export type WeaponClassConfig = {
  id: WeaponClassId;
  label: string;
  visualGridSize: {
    width: number;
    height: number;
  };
  attachmentSlotIds: WeaponAttachmentSlotId[];
};
