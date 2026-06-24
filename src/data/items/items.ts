import { ammoItems } from "./ammo";
import { attachments } from "./attachments";
import { gearItems } from "./gear";
import { hideoutMaterials } from "./hideoutMaterials";
import { magazines } from "./magazines";
import { medicalItems } from "./medical";
import { questItems } from "./questItems";
import { valuables } from "./valuables";
import { weapons } from "./weapons";
import { workbenchMaterials } from "./workbenchMaterials";
import type { GameItem } from "../../types/items";

export const gameItems: GameItem[] = [
  ...weapons,
  ...ammoItems,
  ...magazines,
  ...attachments,
  ...gearItems,
  ...medicalItems,
  ...valuables,
  ...hideoutMaterials,
  ...workbenchMaterials,
  ...questItems,
];