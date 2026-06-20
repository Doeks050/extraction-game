import type { WeaponAttachmentSlot, WeaponAttachmentSlotId } from "../../types/weapons";

export const weaponAttachmentSlotDefinitions: Record<WeaponAttachmentSlotId, WeaponAttachmentSlot> = {
  optic: { id: "optic", label: "Optic" },
  muzzle: { id: "muzzle", label: "Muzzle" },
  barrel: { id: "barrel", label: "Barrel" },
  magazine: { id: "magazine", label: "Magazine" },
  grip: { id: "grip", label: "Grip" },
  stock: { id: "stock", label: "Stock" },
  handguard: { id: "handguard", label: "Handguard" },
  light_laser: { id: "light_laser", label: "Light / Laser" },
  bipod: { id: "bipod", label: "Bipod" },
};

export const defaultWeaponAttachmentSlots: WeaponAttachmentSlot[] = [
  weaponAttachmentSlotDefinitions.optic,
  weaponAttachmentSlotDefinitions.muzzle,
  weaponAttachmentSlotDefinitions.barrel,
  weaponAttachmentSlotDefinitions.magazine,
  weaponAttachmentSlotDefinitions.grip,
  weaponAttachmentSlotDefinitions.stock,
  weaponAttachmentSlotDefinitions.handguard,
  weaponAttachmentSlotDefinitions.light_laser,
];

export function getWeaponAttachmentSlotsByIds(slotIds: WeaponAttachmentSlotId[]) {
  return slotIds.map((slotId) => weaponAttachmentSlotDefinitions[slotId]);
}
