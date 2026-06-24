"use client";

import { workbenchRecipes } from "../../data/hideout/workbenchRecipes";
import type { HideoutModule } from "../../types/game";
import type { InventorySlot } from "../../types/items";
import { CraftingRecipesPanel } from "./CraftingRecipesPanel";

type WorkbenchCraftingPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  onCraft: (recipeId: string) => void;
};

export function WorkbenchCraftingPanel({
  module,
  stash,
  onCraft,
}: WorkbenchCraftingPanelProps) {
  return (
    <CraftingRecipesPanel
      module={module}
      stash={stash}
      recipes={workbenchRecipes}
      onCraft={onCraft}
    />
  );
}
