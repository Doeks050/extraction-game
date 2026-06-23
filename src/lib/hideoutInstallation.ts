import {
  GENERATOR_LEVEL_ONE_DURATION_SECONDS,
  generatorLevelOneRequirements,
} from "../data/hideout/generatorRequirements";
import {
  WORKBENCH_LEVEL_ONE_DURATION_SECONDS,
  workbenchLevelOneRequirements,
  type HideoutItemRequirement,
} from "../data/hideout/workbenchRequirements";
import type { HideoutModuleStatus } from "../types/game";
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

type StartInstallationOptions = {
  moduleId: string;
  requirements: HideoutItemRequirement[];
  durationSeconds: number;
};

function startLevelOneInstallation(
  state: GameState,
  now: number,
  options: StartInstallationOptions,
): GameState | null {
  const targetModule = state.hideoutModules.find(
    (module) => module.id === options.moduleId,
  );

  if (
    !targetModule ||
    targetModule.level !== 0 ||
    targetModule.installationEndsAt ||
    targetModule.status !== "locked"
  ) {
    return null;
  }

  const nextStash = consumeInventoryRequirements(
    state.stash,
    options.requirements,
  );

  if (!nextStash) {
    return null;
  }

  return {
    ...state,
    stash: nextStash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === options.moduleId
        ? {
            ...module,
            status: "active",
            detail: "Installing Level 1",
            installationEndsAt: now + options.durationSeconds * 1000,
            installationTargetLevel: 1,
          }
        : module,
    ),
  };
}

export function startWorkbenchLevelOneInstallation(
  state: GameState,
  now: number,
): GameState | null {
  return startLevelOneInstallation(state, now, {
    moduleId: "workshop",
    requirements: workbenchLevelOneRequirements,
    durationSeconds: WORKBENCH_LEVEL_ONE_DURATION_SECONDS,
  });
}

export function startGeneratorLevelOneInstallation(
  state: GameState,
  now: number,
): GameState | null {
  return startLevelOneInstallation(state, now, {
    moduleId: "generator",
    requirements: generatorLevelOneRequirements,
    durationSeconds: GENERATOR_LEVEL_ONE_DURATION_SECONDS,
  });
}

function getCompletedModuleState(moduleId: string, targetLevel: number) {
  if (moduleId === "generator" && targetLevel === 1) {
    return {
      status: "idle" as HideoutModuleStatus,
      detail: "No fuel",
    };
  }

  if (moduleId === "workshop" && targetLevel === 1) {
    return {
      status: "ready" as HideoutModuleStatus,
      detail: "Crafting ready",
    };
  }

  return {
    status: "ready" as HideoutModuleStatus,
    detail: `Level ${targetLevel} ready`,
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
    const completedState = getCompletedModuleState(module.id, targetLevel);

    return {
      ...module,
      level: targetLevel,
      ...completedState,
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
