import { assaultRifles } from "./weaponPacks/assaultRifles";
import { pistols } from "./weaponPacks/pistols";
import type { GameItem } from "../../types/items";

export const weapons: GameItem[] = [...assaultRifles, ...pistols];
