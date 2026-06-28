import { resolveWeaponAssetPath } from "../../lib/weaponAssetPath";
import type { GameItem } from "../../types/items";
import { assaultRifles } from "./weaponPacks/assaultRifles";
import { assaultRifles545 } from "./weaponPacks/assaultRifles545";
import { assaultRifles76239 } from "./weaponPacks/assaultRifles76239";
import { assaultRifles762 } from "./weaponPacks/assaultRifles762";
import { dmrs762 } from "./weaponPacks/dmrs762";
import { pistols } from "./weaponPacks/pistols";

const weaponPacks: GameItem[] = [
  ...assaultRifles,
  ...assaultRifles545,
  ...assaultRifles76239,
  ...assaultRifles762,
  ...dmrs762,
  ...pistols,
];

export const weapons: GameItem[] = weaponPacks.map((weapon) => ({
  ...weapon,
  image: resolveWeaponAssetPath(weapon),
}));
