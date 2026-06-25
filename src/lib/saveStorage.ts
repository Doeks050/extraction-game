import { GENERATOR_FUEL_ITEM_ID } from "./generatorStation";
import { getItemById } from "./items";
import type { HideoutModule, HideoutModuleStatus } from "../types/game";
import type { GameState } from "../types/state";
import type { InventorySlot } from "../types/items";

export const SAVE_STORAGE_KEY = "extraction-game-save-v5";
export const TEMP_UNLOCK_HIDEOUT_STATIONS = true;
export const TEMP_GRANT_GENERATOR_TEST_FUEL = true;

export type SaveStatus = "loading" | "ready" | "error";

const temporaryUnlockedStationState: Record<
  string,
  { status: HideoutModuleStatus; detail: string }
> = {
  workshop: {
    status: "ready",
    detail: "Crafting ready",
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

function ensureTemporaryGeneratorFuel(stash: InventorySlot[]) {
  if (!TEMP_GRANT_GENERATOR_TEST_FUEL) {
    return stash;
  }

  const currentFuelCount = stash.reduce(
    (total, slot) =>
      total + (slot.itemId === GENERATOR_FUEL_ITEM_ID ? slot.quantity : 0),
    0,
  );
  const fuelToAdd = Math.max(0, 2 - currentFuelCount);

  if (fuelToAdd === 0) {
    return stash;
  }

  return [
    ...stash,
    ...Array.from({ length: fuelToAdd }, (_, index) => ({
      slotId: `temp_generator_fuel_${index + 1}`,
      itemId: GENERATOR_FUEL_ITEM_ID,
      quantity: 1,
    })),
  ];
}

function normalizeGeneratorModule(module: HideoutModule): HideoutModule {
  const fuelSlots = [
    module.generatorFuelSlots?.[0] ?? null,
    module.generatorFuelSlots?.[1] ?? null,
  ];
  const loadedCount = fuelSlots.filter(Boolean).length;
  const poweredOn = Boolean(module.generatorPoweredOn && loadedCount > 0);

  return {
    ...module,
    level: Math.max(1, module.level),
    status: poweredOn ? "active" : "idle",
    detail: poweredOn
      ? "Power online"
      : loadedCount > 0
        ? `${loadedCount} / 2 fuel loaded`
        : "No fuel",
    generatorFuelSlots: fuelSlots,
    generatorPoweredOn: poweredOn,
    installationEndsAt: undefined,
    installationTargetLevel: undefined,
  };
}

function applyTemporaryHideoutUnlock(module: HideoutModule): HideoutModule {
  if (!TEMP_UNLOCK_HIDEOUT_STATIONS) {
    return module;
  }

  if (module.id === "generator") {
    return normalizeGeneratorModule(module);
  }

  const unlockedState = temporaryUnlockedStationState[module.id];

  if (!unlockedState) {
    return module;
  }

  if (module.craftingRecipeId && module.craftingEndsAt) {
    return {
      ...module,
      level: Math.max(1, module.level),
      installationEndsAt: undefined,
      installationTargetLevel: undefined,
    };
  }

  return {
    ...module,
    level: Math.max(1, module.level),
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
  const clonedDefaultState = cloneGameState(defaultState);
  const savedGenerator = savedState?.hideoutModules?.find(
    (module) => module.id === "generator",
  );
  const needsTemporaryFuelGrant =
    TEMP_GRANT_GENERATOR_TEST_FUEL &&
    savedGenerator?.generatorFuelSlots === undefined;

  if (!savedState) {
    return {
      ...clonedDefaultState,
      hideoutModules: normalizeHideoutModules(
        undefined,
        clonedDefaultState.hideoutModules,
      ),
      stash: ensureTemporaryGeneratorFuel(clonedDefaultState.stash),
    };
  }

  const savedOperator = savedState.operator;
  const normalizedStash = normalizeInventorySlots(
    savedState.stash ?? defaultState.stash,
  );

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
    stash: needsTemporaryFuelGrant
      ? ensureTemporaryGeneratorFuel(normalizedStash)
      : normalizedStash,
    loadout: savedState.loadout ?? defaultState.loadout,
    tasks: savedState.tasks ?? defaultState.tasks,
  };
}
