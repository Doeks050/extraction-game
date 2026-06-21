import { resolveWeaponAssetPath } from "../../lib/weaponAssetPath";
import type { GameItem } from "../../types/items";
import { assaultRifles } from "./weaponPacks/assaultRifles";
import { pistols } from "./weaponPacks/pistols";

const weaponPacks: GameItem[] = [...assaultRifles, ...pistols];

export const weapons: GameItem[] = weaponPacks.map((weapon) => ({
  ...weapon,
  image: resolveWeaponAssetPath(weapon),
}));
