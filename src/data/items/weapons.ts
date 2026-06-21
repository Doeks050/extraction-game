import { resolveWeaponAssetPath } from "../../lib/weaponAssetPath";
import type { GameItem } from "../../types/items";
import { assaultRifles } from "./weaponPacks/assaultRifles";
import { assaultRifles762 } from "./weaponPacks/assaultRifles762";
import { pistols } from "./weaponPacks/pistols";

const weaponPacks: GameItem[] = [...assaultRifles, ...assaultRifles762, ...pistols];

export const weapons: GameItem[] = weaponPacks.map((weapon) => ({
  ...weapon,
  image: resolveWeaponAssetPath(weapon),
}));
