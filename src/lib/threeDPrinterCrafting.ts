import { getThreeDPrinterRecipeById } from "../data/hideout/threeDPrinterRecipes";
import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import { isGeneratorPowered } from "./generatorStation";
import { consumeInventoryRequirements } from "./hideoutInstallation";
import { getItemById } from "./items";
import {
  hasEnoughPrinterFilament,
  isPrinterRecipeUnlocked,
  normalizePrinterFilamentSlot,
} from "./threeDPrinterSupplies";

function addItemToStash(
  stash: InventorySlot[],
  itemId: string,
  quantity: number,
  slotPrefix: string,
): InventorySlot[] {
  const item = getItemById(itemId);

  if (!item || quantity <= 0) {
    return stash;
  }

  let remaining = quantity;
  const nextStash = stash.map((slot) => {
    if (
      remaining <= 0 ||
      slot.itemId !== itemId ||
      slot.quantity >= item.maxStack
    ) {
      return slot;
    }

    const availableSpace = item.maxStack - slot.quantity;
    const amountToAdd = Math.min(availableSpace, remaining);
    remaining -= amountToAdd;

    return {
      ...slot,
      quantity: slot.quantity + amountToAdd,
    };
  });

  let index = 1;

  while (remaining > 0) {
    const stackQuantity = Math.min(item.maxStack, remaining);

    nextStash.push({
      slotId: `${slotPrefix}_${index}`,
      itemId,
      quantity: stackQuantity,
    });

    remaining -= stackQuantity;
    index += 1;
  }

  return nextStash;
}

export function startThreeDPrinterCraft(
  state: GameState,
  recipeId: string,
  now: number,
): GameState | null {
  const recipe = getThreeDPrinterRecipeById(recipeId);
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );

  if (
    !recipe ||
    !printer ||
    !isGeneratorPowered(state) ||
    !isPrinterRecipeUnlocked(printer, recipe) ||
    !hasEnoughPrinterFilament(printer, recipe) ||
    printer.status !== "idle" ||
    printer.craftingRecipeId ||
    printer.craftingEndsAt
  ) {
    return null;
  }

  const nextStash = consumeInventoryRequirements(state.stash, recipe.inputs);
  const filamentSlot = normalizePrinterFilamentSlot(
    printer.printerFilamentSlot,
  );

  if (!nextStash || !filamentSlot) {
    return null;
  }

  const filamentCostUnits = recipe.filamentCostUnits ?? 0;
  const nextFilamentSlot = {
    ...filamentSlot,
    filamentRemainingUnits: Math.max(
      0,
      filamentSlot.filamentRemainingUnits - filamentCostUnits,
    ),
  };

  return {
    ...state,
    stash: nextStash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? {
            ...module,
            status: "active",
            detail: `Printing ${recipe.name}`,
            craftingRecipeId: recipe.id,
            craftingEndsAt: now + recipe.durationSeconds * 1000,
            printerFilamentSlot: nextFilamentSlot,
          }
        : module,
    ),
  };
}

export function resolveCompletedThreeDPrinterCrafts(
  state: GameState,
  now: number,
): GameState {
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );

  if (
    !printer?.craftingRecipeId ||
    !printer.craftingEndsAt ||
    printer.craftingEndsAt > now
  ) {
    return state;
  }

  const recipe = getThreeDPrinterRecipeById(printer.craftingRecipeId);
  const completedAt = printer.craftingEndsAt;
  const nextStash = recipe
    ? addItemToStash(
        state.stash,
        recipe.output.itemId,
        recipe.output.quantity,
        `print_${recipe.id}_${completedAt}`,
      )
    : state.stash;

  return {
    ...state,
    stash: nextStash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? {
            ...module,
            status: "idle",
            detail: "No print job",
            craftingRecipeId: undefined,
            craftingEndsAt: undefined,
          }
        : module,
    ),
  };
}
