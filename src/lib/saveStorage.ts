import type { GameState } from "../types/state";

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
    hideoutModules: savedState.hideoutModules ?? defaultState.hideoutModules,
    stash: savedState.stash ?? defaultState.stash,
    loadout: savedState.loadout ?? defaultState.loadout,
    tasks: savedState.tasks ?? defaultState.tasks,
  };
}
