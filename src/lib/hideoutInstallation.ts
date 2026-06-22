import {
  WORKBENCH_LEVEL_ONE_DURATION_SECONDS,
  workbenchLevelOneRequirements,
  type HideoutItemRequirement,
} from "../data/hideout/workbenchRequirements";
import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";

export function countInventoryItem(stash: InventorySlot[], itemId: string): number {
  return stash.reduce(
    (total, slot) => total + (slot.itemId === itemId ? slot.quantity : 0),
    0,
  );
}

export function hasInventoryRequirements(
  stash: InventorySlot[],
  requirements: HideoutItemRequirement[],
): boolean {
  return requirements.every(
    (requirement) => countInventoryItem(stash, requirement.itemId) >= requirement.quantity,
  );
}

export function consumeInventoryRequirements(
  stash: InventorySlot[],
  requirements: HideoutItemRequirement[],
): InventorySlot[] | null {
  if (!hasInventoryRequirements(stash, requirements)) {
    return null;
  }

  const remainingByItemId = new Map(
    requirements.map((requirement) => [requirement.itemId, requirement.quantity]),
  );
  const nextStash: InventorySlot[] = [];

  for (const slot of stash) {
    const remainingRequired = remainingByItemId.get(slot.itemId) ?? 0;

    if (remainingRequired <= 0) {
      nextStash.push(slot);
      continue;
    }

    const quantityToConsume = Math.min(slot.quantity, remainingRequired);
    const quantityLeft = slot.quantity - quantityToConsume;

    remainingByItemId.set(slot.itemId, remainingRequired - quantityToConsume);

    if (quantityLeft > 0) {
      nextStash.push({
        ...slot,
        quantity: quantityLeft,
      });
    }
  }

  return nextStash;
}

export function startWorkbenchLevelOneInstallation(
  state: GameState,
  now: number,
): GameState | null {
  const workbench = state.hideoutModules.find((module) => module.id === "workshop");

  if (
    !workbench ||
    workbench.level !== 0 ||
    workbench.installationEndsAt ||
    workbench.status !== "locked"
  ) {
    return null;
  }

  const nextStash = consumeInventoryRequirements(
    state.stash,
    workbenchLevelOneRequirements,
  );

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
            detail: "Installing Level 1",
            installationEndsAt:
              now + WORKBENCH_LEVEL_ONE_DURATION_SECONDS * 1000,
            installationTargetLevel: 1,
          }
        : module,
    ),
  };
}

export function resolveCompletedHideoutInstallations(
  state: GameState,
  now: number,
): GameState {
  let didChange = false;

  const hideoutModules = state.hideoutModules.map((module) => {
    if (!module.installationEndsAt || module.installationEndsAt > now) {
      return module;
    }

    didChange = true;
    const targetLevel = module.installationTargetLevel ?? module.level + 1;

    return {
      ...module,
      level: targetLevel,
      status: "ready" as const,
      detail: targetLevel === 1 ? "Crafting ready" : `Level ${targetLevel} ready`,
      installationEndsAt: undefined,
      installationTargetLevel: undefined,
    };
  });

  return didChange
    ? {
        ...state,
        hideoutModules,
      }
    : state;
}
