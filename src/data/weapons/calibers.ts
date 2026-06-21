export const weaponCaliberTags = [
  "9x18",
  "7.62x25",
  "9x19",
  ".45 ACP",
  "5.7x28",
  ".50 AE",
  ".357 Magnum",
  ".500 Magnum",
  "4.6x30",
  "5.56x45",
  "5.45x39",
  "7.62x39",
  "7.62x51",
  "7.62x54r",
  "6.5 Creedmoor",
  "6.8x51",
  "9x39",
  ".300 Win Mag",
  ".338 Lapua",
  ".375 CheyTac",
  ".408 CheyTac",
  ".50 BMG",
] as const;

export function getWeaponCaliberFromTags(tags: string[]) {
  return tags.find((tag) => weaponCaliberTags.includes(tag as (typeof weaponCaliberTags)[number])) ?? "Unknown";
}
