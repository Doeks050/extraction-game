import type { WeaponClassConfig, WeaponClassId } from "../../types/weapons";

export const weaponClassConfigs: Record<WeaponClassId, WeaponClassConfig> = {
  assault_rifle: {
    id: "assault_rifle",
    label: "Assault Rifle",
    visualGridSize: { width: 4, height: 2 },
    attachmentSlotIds: [
      "optic",
      "muzzle",
      "barrel",
      "magazine",
      "grip",
      "stock",
      "handguard",
      "light_laser",
    ],
  },
  smg: {
    id: "smg",
    label: "SMG",
    visualGridSize: { width: 4, height: 2 },
    attachmentSlotIds: [
      "optic",
      "muzzle",
      "barrel",
      "magazine",
      "grip",
      "stock",
      "handguard",
      "light_laser",
    ],
  },
  pistol: {
    id: "pistol",
    label: "Pistol",
    visualGridSize: { width: 2, height: 1 },
    attachmentSlotIds: ["optic", "muzzle", "barrel", "magazine", "grip", "light_laser"],
  },
  sniper: {
    id: "sniper",
    label: "Sniper",
    visualGridSize: { width: 6, height: 2 },
    attachmentSlotIds: [
      "optic",
      "muzzle",
      "barrel",
      "magazine",
      "grip",
      "stock",
      "handguard",
      "bipod",
    ],
  },
  machine_gun: {
    id: "machine_gun",
    label: "Machine Gun",
    visualGridSize: { width: 6, height: 3 },
    attachmentSlotIds: [
      "optic",
      "muzzle",
      "barrel",
      "magazine",
      "grip",
      "stock",
      "handguard",
      "bipod",
    ],
  },
};

export function getWeaponClassFromTags(tags: string[]) {
  const matchingClassId = tags.find((tag): tag is WeaponClassId => tag in weaponClassConfigs);
  return matchingClassId ? weaponClassConfigs[matchingClassId] : null;
}

export function getWeaponVisualGridSize(tags: string[]) {
  return getWeaponClassFromTags(tags)?.visualGridSize ?? null;
}
