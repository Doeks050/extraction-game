"use client";

import { threeDPrinterRecipes } from "../../data/hideout/threeDPrinterRecipes";
import type { HideoutModule } from "../../types/game";
import type { InventorySlot } from "../../types/items";
import { CraftingRecipesPanel } from "./CraftingRecipesPanel";

type ThreeDPrinterCraftingPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  generatorPoweredOn: boolean;
  onCraft: (recipeId: string) => void;
};

export function ThreeDPrinterCraftingPanel({
  module,
  stash,
  generatorPoweredOn,
  onCraft,
}: ThreeDPrinterCraftingPanelProps) {
  return (
    <CraftingRecipesPanel
      module={module}
      stash={stash}
      recipes={threeDPrinterRecipes}
      isAvailable={generatorPoweredOn}
      unavailableMessage="Turn on generator"
      onCraft={onCraft}
    />
  );
}
