import type { GameState } from "../types/state";

export const SAVE_STORAGE_KEY = "extraction-game-save-v2";

export type SaveStatus = "loading" | "ready" | "error";

export function readSavedGameState(): Partial<GameState> | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(SAVE_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as Partial<GameState>;
  } catch {
    return null;
  }
}

export function writeSavedGameState(state: GameState): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearSavedGameState(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

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

export function normalizeSavedGameState(
  savedState: Partial<GameState> | null,
  defaultState: GameState,
): GameState {
  if (!savedState) {
    return cloneGameState(defaultState);
  }

  return {
    ...cloneGameState(defaultState),
    ...savedState,
    operator: {
      ...cloneGameState(defaultState).operator,
      ...savedState.operator,
      xp: savedState.operator?.xp ?? defaultState.operator.xp,
      credits: savedState.operator?.credits ?? defaultState.operator.credits,
      operatorSkills:
        savedState.operator?.operatorSkills ?? defaultState.operator.operatorSkills,
      weaponClassSkills:
        savedState.operator?.weaponClassSkills ??
        defaultState.operator.weaponClassSkills,
      weaponMasteries:
        savedState.operator?.weaponMasteries ?? defaultState.operator.weaponMasteries,
      lastRaid: savedState.operator?.lastRaid ?? defaultState.operator.lastRaid,
      activeTask: savedState.operator?.activeTask ?? defaultState.operator.activeTask,
    },
    hideoutModules: savedState.hideoutModules ?? defaultState.hideoutModules,
    stash: savedState.stash ?? defaultState.stash,
    loadout: savedState.loadout ?? defaultState.loadout,
    tasks: savedState.tasks ?? defaultState.tasks,
  };
}
