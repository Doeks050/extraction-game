import { ammoItems } from "./ammo";
import { attachments } from "./attachments";
import { gearItems } from "./gear";
import { generatorFuelItems } from "./generatorFuelItems";
import { hideoutMaterials } from "./hideoutMaterials";
import { magazines } from "./magazines";
import { medicalItems } from "./medical";
import { printerCraftedItems } from "./printerCraftedItems";
import { questItems } from "./questItems";
import { threeDPrinterSupplies } from "./threeDPrinterSupplies";
import { valuables } from "./valuables";
import { weapons } from "./weapons";
import { workbenchMaterials } from "./workbenchMaterials";
import type { GameItem } from "../../types/items";

const rawGameItems: GameItem[] = [
  ...weapons,
  ...ammoItems,
  ...magazines,
  ...attachments,
  ...gearItems,
  ...medicalItems,
  ...valuables,
  ...hideoutMaterials,
  ...generatorFuelItems,
  ...threeDPrinterSupplies,
  ...printerCraftedItems,
  ...workbenchMaterials,
  ...questItems,
];

export const gameItems: GameItem[] = rawGameItems.map((item) =>
  item.category === "ammo"
    ? item
    : {
        ...item,
        maxStack: 1,
      },
);
