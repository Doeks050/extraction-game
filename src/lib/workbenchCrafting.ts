import {
  getWorkbenchRecipeById,
  type WorkbenchRecipe,
} from "../data/hideout/workbenchRecipes";
import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import { consumeInventoryRequirements } from "./hideoutInstallation";
import { getItemById } from "./items";

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

function canStartRecipe(state: GameState, recipe: WorkbenchRecipe): boolean {
  const workbench = state.hideoutModules.find((module) => module.id === "workshop");

  return Boolean(
    workbench &&
      workbench.level >= recipe.requiredLevel &&
      workbench.status === "ready" &&
      !workbench.craftingRecipeId &&
      !workbench.craftingEndsAt,
  );
}

export function startWorkbenchCraft(
  state: GameState,
  recipeId: string,
  now: number,
): GameState | null {
  const recipe = getWorkbenchRecipeById(recipeId);

  if (!recipe || !canStartRecipe(state, recipe)) {
    return null;
  }

  const nextStash = consumeInventoryRequirements(state.stash, recipe.inputs);

  if (!nextStash) {
    return null;
  }

  return {
    ...state,
    stash: nextStash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "workshop"
        ? {
            ...module,
            status: "active",
            detail: `Crafting ${recipe.name}`,
            craftingRecipeId: recipe.id,
            craftingEndsAt: now + recipe.durationSeconds * 1000,
          }
        : module,
    ),
  };
}

export function resolveCompletedWorkbenchCrafts(
  state: GameState,
  now: number,
): GameState {
  const workbench = state.hideoutModules.find((module) => module.id === "workshop");

  if (
    !workbench?.craftingRecipeId ||
    !workbench.craftingEndsAt ||
    workbench.craftingEndsAt > now
  ) {
    return state;
  }

  const recipe = getWorkbenchRecipeById(workbench.craftingRecipeId);
  const completedAt = workbench.craftingEndsAt;
  const nextStash = recipe
    ? addItemToStash(
        state.stash,
        recipe.output.itemId,
        recipe.output.quantity,
        `craft_${recipe.id}_${completedAt}`,
      )
    : state.stash;

  return {
    ...state,
    stash: nextStash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "workshop"
        ? {
            ...module,
            status: "ready",
            detail: "Crafting ready",
            craftingRecipeId: undefined,
            craftingEndsAt: undefined,
          }
        : module,
    ),
  };
}
