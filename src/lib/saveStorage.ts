import { getItemById } from "./items";
import type { HideoutModule } from "../types/game";
import type { GameState } from "../types/state";
import type { InventorySlot } from "../types/items";

export const SAVE_STORAGE_KEY = "extraction-game-save-v5";

export type SaveStatus = "loading" | "ready" | "error";

export function readSavedGameState(): Partial<GameState> | null {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.localStorage.getItem(SAVE_STORAGE_KEY);
    if (!rawValue) return null;
    return JSON.parse(rawValue) as Partial<GameState>;
  } catch {
    return null;
  }
}

export function writeSavedGameState(state: GameState): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearSavedGameState(): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(SAVE_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function cloneGameState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function normalizeInventorySlots(slots: InventorySlot[]) {
  return slots.map((slot) => {
    const item = getItemById(slot.itemId);

    if (item?.category !== "weapon") {
      return slot;
    }

    return {
      ...slot,
      currentDurability: slot.currentDurability ?? 100,
    };
  });
}

function normalizeHideoutModules(
  savedModules: HideoutModule[] | undefined,
  defaultModules: HideoutModule[],
) {
  if (!savedModules) {
    return defaultModules;
  }

  const savedById = new Map(savedModules.map((module) => [module.id, module]));

  return defaultModules.map((defaultModule) => {
    const savedModule = savedById.get(defaultModule.id);

    if (!savedModule) {
      return defaultModule;
    }

    const isLegacyGenerator =
      savedModule.id === "generator" &&
      savedModule.level === 1 &&
      savedModule.status === "stable" &&
      savedModule.detail === "Power stable";
    const isLegacyGrowRoom =
      savedModule.id === "grow_room" &&
      savedModule.level === 1 &&
      savedModule.status === "idle" &&
      savedModule.detail === "No crop";

    if (isLegacyGenerator || isLegacyGrowRoom) {
      return defaultModule;
    }

    return {
      ...defaultModule,
      ...savedModule,
    };
  });
}

export function normalizeSavedGameState(
  savedState: Partial<GameState> | null,
  defaultState: GameState,
): GameState {
  if (!savedState) return cloneGameState(defaultState);

  const clonedDefaultState = cloneGameState(defaultState);
  const savedOperator = savedState.operator;

  return {
    ...clonedDefaultState,
    ...savedState,
    operator: {
      ...clonedDefaultState.operator,
      ...(savedOperator ?? {}),
      xp: savedOperator?.xp ?? defaultState.operator.xp,
      credits: savedOperator?.credits ?? defaultState.operator.credits,
      containers: savedOperator?.containers ?? defaultState.operator.containers,
      operatorSkills: savedOperator?.operatorSkills ?? defaultState.operator.operatorSkills,
      weaponClassSkills: savedOperator?.weaponClassSkills ?? defaultState.operator.weaponClassSkills,
      weaponMasteries: savedOperator?.weaponMasteries ?? defaultState.operator.weaponMasteries,
      lastRaid: savedOperator?.lastRaid ?? defaultState.operator.lastRaid,
      activeTask: savedOperator?.activeTask ?? defaultState.operator.activeTask,
    },
    hideoutModules: normalizeHideoutModules(
      savedState.hideoutModules,
      clonedDefaultState.hideoutModules,
    ),
    stash: normalizeInventorySlots(savedState.stash ?? defaultState.stash),
    loadout: savedState.loadout ?? defaultState.loadout,
    tasks: savedState.tasks ?? defaultState.tasks,
  };
}
