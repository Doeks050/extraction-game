"use client";

import { workbenchRecipes } from "../../data/hideout/workbenchRecipes";
import { WORKBENCH_POWERED_DURATION_MULTIPLIER } from "../../lib/generatorStation";
import type { HideoutModule } from "../../types/game";
import type { InventorySlot } from "../../types/items";
import { CraftingRecipesPanel } from "./CraftingRecipesPanel";

type WorkbenchCraftingPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  generatorPoweredOn: boolean;
  onCraft: (recipeId: string) => void;
};

export function WorkbenchCraftingPanel({
  module,
  stash,
  generatorPoweredOn,
  onCraft,
}: WorkbenchCraftingPanelProps) {
  return (
    <CraftingRecipesPanel
      module={module}
      stash={stash}
      recipes={workbenchRecipes}
      durationMultiplier={
        generatorPoweredOn ? WORKBENCH_POWERED_DURATION_MULTIPLIER : 1
      }
      activeBonusLabel={generatorPoweredOn ? "25% faster" : undefined}
      onCraft={onCraft}
    />
  );
}
