import { getItemById } from "./items";
import type { HideoutModule, HideoutModuleStatus } from "../types/game";
import type { GameState } from "../types/state";
import type { InventorySlot } from "../types/items";

export const SAVE_STORAGE_KEY = "extraction-game-save-v5";
export const TEMP_UNLOCK_HIDEOUT_STATIONS = true;

export type SaveStatus = "loading" | "ready" | "error";

const temporaryUnlockedStationState: Record<
  string,
  { status: HideoutModuleStatus; detail: string }
> = {
  workshop: {
    status: "ready",
    detail: "Crafting ready",
  },
  generator: {
    status: "idle",
    detail: "No fuel",
  },
  grow_room: {
    status: "idle",
    detail: "No crop",
  },
  three_d_printer: {
    status: "idle",
    detail: "No print job",
  },
  mining_rig: {
    status: "idle",
    detail: "0 / 1 GPU installed",
  },
};

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
    const normalizedSlot =
      slot.itemId === "part_mechanical_parts"
        ? {
            ...slot,
            itemId: "part_mechanical_components",
          }
        : slot;
    const item = getItemById(normalizedSlot.itemId);

    if (item?.category !== "weapon") {
      return normalizedSlot;
    }

    return {
      ...normalizedSlot,
      currentDurability: normalizedSlot.currentDurability ?? 100,
    };
  });
}

function applyTemporaryHideoutUnlock(module: HideoutModule): HideoutModule {
  if (!TEMP_UNLOCK_HIDEOUT_STATIONS || module.level >= 1) {
    return module;
  }

  const unlockedState = temporaryUnlockedStationState[module.id];

  if (!unlockedState) {
    return module;
  }

  return {
    ...module,
    level: 1,
    ...unlockedState,
    installationEndsAt: undefined,
    installationTargetLevel: undefined,
  };
}

function normalizeHideoutModules(
  savedModules: HideoutModule[] | undefined,
  defaultModules: HideoutModule[],
) {
  if (!savedModules) {
    return defaultModules.map(applyTemporaryHideoutUnlock);
  }

  const savedById = new Map(savedModules.map((module) => [module.id, module]));

  return defaultModules.map((defaultModule) => {
    const savedModule = savedById.get(defaultModule.id);

    if (!savedModule) {
      return applyTemporaryHideoutUnlock(defaultModule);
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
      return applyTemporaryHideoutUnlock(defaultModule);
    }

    return applyTemporaryHideoutUnlock({
      ...defaultModule,
      ...savedModule,
    });
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
