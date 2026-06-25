"use client";

import { threeDPrinterRecipes } from "../../data/hideout/threeDPrinterRecipes";
import {
  getPrinterUsbRecipeIds,
  hasEnoughPrinterFilament,
  isPrinterRecipeUnlocked,
  normalizePrinterFilamentSlot,
} from "../../lib/threeDPrinterSupplies";
import type { HideoutCraftingRecipe } from "../../types/hideoutCrafting";
import type { HideoutModule } from "../../types/game";
import type { InventorySlot } from "../../types/items";
import { CraftingRecipesPanel } from "./CraftingRecipesPanel";
import { ThreeDPrinterSupplyPanel } from "./ThreeDPrinterSupplyPanel";

type ThreeDPrinterCraftingPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  generatorPoweredOn: boolean;
  onInsertFilament: (itemId: string) => void;
  onRemoveFilament: () => void;
  onInsertUsb: (itemId: string) => void;
  onRemoveUsb: () => void;
  onCraft: (recipeId: string) => void;
};

export function ThreeDPrinterCraftingPanel({
  module,
  stash,
  generatorPoweredOn,
  onInsertFilament,
  onRemoveFilament,
  onInsertUsb,
  onRemoveUsb,
  onCraft,
}: ThreeDPrinterCraftingPanelProps) {
  const usbRecipeIds = getPrinterUsbRecipeIds(module.printerUsbItemId);
  const visibleRecipes = threeDPrinterRecipes.filter(
    (recipe) =>
      !recipe.requiredUsbItemId ||
      (recipe.requiredUsbItemId === module.printerUsbItemId &&
        usbRecipeIds.includes(recipe.id)),
  );

  function isRecipeAvailable(recipe: HideoutCraftingRecipe) {
    return (
      isPrinterRecipeUnlocked(module, recipe) &&
      hasEnoughPrinterFilament(module)
    );
  }

  function getRecipeUnavailableMessage(recipe: HideoutCraftingRecipe) {
    if (!isPrinterRecipeUnlocked(module, recipe)) {
      return recipe.requiredUsbItemId
        ? "Insert required recipe USB"
        : `Requires printer level ${recipe.requiredLevel}`;
    }

    const filamentSlot = normalizePrinterFilamentSlot(
      module.printerFilamentSlot,
    );

    if (!filamentSlot) {
      return "Insert filament";
    }

    if (!hasEnoughPrinterFilament(module)) {
      return "Filament is empty";
    }

    return undefined;
  }

  return (
    <div className="grid gap-2">
      <ThreeDPrinterSupplyPanel
        module={module}
        stash={stash}
        onInsertFilament={onInsertFilament}
        onRemoveFilament={onRemoveFilament}
        onInsertUsb={onInsertUsb}
        onRemoveUsb={onRemoveUsb}
      />

      <CraftingRecipesPanel
        module={module}
        stash={stash}
        recipes={visibleRecipes}
        isAvailable={generatorPoweredOn}
        unavailableMessage="Turn on generator"
        isRecipeAvailable={isRecipeAvailable}
        getRecipeUnavailableMessage={getRecipeUnavailableMessage}
        getRecipeMetaLabel={() => "1 filament print"}
        onCraft={onCraft}
      />
    </div>
  );
}
