import { getGeneratorFuelSlotCount } from "../data/hideout/generatorConfig";
import type { GeneratorFuelSlot } from "../types/game";
import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import { getItemById } from "./items";

export const GENERATOR_FUEL_ITEM_ID = "part_fuel_jerrycan";
export const WORKBENCH_POWERED_DURATION_MULTIPLIER = 0.75;

type LegacyGeneratorFuelSlot = GeneratorFuelSlot | string | null;

function getFuelCapacitySeconds(itemId: string) {
  return getItemById(itemId)?.fuelCapacitySeconds ?? 0;
}

function normalizeFuelSlot(
  slot: LegacyGeneratorFuelSlot | undefined,
): GeneratorFuelSlot | null {
  if (!slot) {
    return null;
  }

  if (typeof slot === "string") {
    const fuelCapacitySeconds = getFuelCapacitySeconds(slot);

    if (fuelCapacitySeconds <= 0) {
      return null;
    }

    return {
      itemId: slot,
      fuelRemainingSeconds: fuelCapacitySeconds,
      fuelCapacitySeconds,
    };
  }

  const configuredCapacity = getFuelCapacitySeconds(slot.itemId);
  const fuelCapacitySeconds = Math.max(
    0,
    slot.fuelCapacitySeconds || configuredCapacity,
  );

  if (fuelCapacitySeconds <= 0) {
    return null;
  }

  return {
    itemId: slot.itemId,
    fuelCapacitySeconds,
    fuelRemainingSeconds: Math.min(
      fuelCapacitySeconds,
      Math.max(0, slot.fuelRemainingSeconds),
    ),
  };
}

export function normalizeGeneratorFuelSlots(
  level: number,
  slots: Array<LegacyGeneratorFuelSlot> | undefined,
) {
  const slotCount = getGeneratorFuelSlotCount(level);

  return Array.from({ length: slotCount }, (_, index) =>
    normalizeFuelSlot(slots?.[index]),
  );
}

export function getFuelPercentage(
  fuelRemainingSeconds: number,
  fuelCapacitySeconds: number,
) {
  if (fuelCapacitySeconds <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.ceil((fuelRemainingSeconds / fuelCapacitySeconds) * 100),
    ),
  );
}

export function getInventoryFuelPercentage(
  itemId: string,
  fuelRemainingSeconds?: number,
) {
  const fuelCapacitySeconds = getFuelCapacitySeconds(itemId);

  if (fuelCapacitySeconds <= 0) {
    return null;
  }

  return getFuelPercentage(
    fuelRemainingSeconds ?? fuelCapacitySeconds,
    fuelCapacitySeconds,
  );
}

export function isGeneratorPowered(state: GameState) {
  const generator = state.hideoutModules.find(
    (module) => module.id === "generator",
  );

  if (!generator || generator.level < 1 || !generator.generatorPoweredOn) {
    return false;
  }

  return normalizeGeneratorFuelSlots(
    generator.level,
    generator.generatorFuelSlots,
  ).some((slot) => Boolean(slot && slot.fuelRemainingSeconds > 0));
}

function consumeOneFuelItem(stash: InventorySlot[], itemId: string) {
  const targetIndex = stash.findIndex(
    (slot) => slot.itemId === itemId && slot.quantity > 0,
  );

  if (targetIndex < 0) {
    return null;
  }

  const sourceSlot = stash[targetIndex];
  const fuelCapacitySeconds = getFuelCapacitySeconds(itemId);

  if (fuelCapacitySeconds <= 0) {
    return null;
  }

  const fuelSlot: GeneratorFuelSlot = {
    itemId,
    fuelCapacitySeconds,
    fuelRemainingSeconds: Math.min(
      fuelCapacitySeconds,
      Math.max(
        0,
        sourceSlot.fuelRemainingSeconds ?? fuelCapacitySeconds,
      ),
    ),
  };
  const nextStash = stash.flatMap((slot, index) => {
    if (index !== targetIndex) {
      return [slot];
    }

    if (slot.quantity <= 1) {
      return [];
    }

    return [
      {
        ...slot,
        quantity: slot.quantity - 1,
      },
    ];
  });

  return {
    stash: nextStash,
    fuelSlot,
  };
}

function addFuelItemToStash(
  stash: InventorySlot[],
  fuelSlot: GeneratorFuelSlot,
): InventorySlot[] {
  return [
    ...stash,
    {
      slotId: `generator_return_${Date.now()}`,
      itemId: fuelSlot.itemId,
      quantity: 1,
      fuelRemainingSeconds: fuelSlot.fuelRemainingSeconds,
    },
  ];
}

function getGeneratorDetail(
  poweredOn: boolean,
  fuelSlots: Array<GeneratorFuelSlot | null>,
) {
  const activeFuel = fuelSlots.find(
    (slot) => slot && slot.fuelRemainingSeconds > 0,
  );

  if (poweredOn && activeFuel) {
    const percentage = getFuelPercentage(
      activeFuel.fuelRemainingSeconds,
      activeFuel.fuelCapacitySeconds,
    );

    return `Power online · ${percentage}% fuel`;
  }

  if (activeFuel) {
    const percentage = getFuelPercentage(
      activeFuel.fuelRemainingSeconds,
      activeFuel.fuelCapacitySeconds,
    );

    return `${percentage}% fuel loaded`;
  }

  if (fuelSlots.some(Boolean)) {
    return "Fuel empty";
  }

  return "No fuel";
}

export function resolveGeneratorFuel(
  state: GameState,
  now: number,
): GameState {
  const generator = state.hideoutModules.find(
    (module) => module.id === "generator",
  );

  if (!generator?.generatorPoweredOn) {
    return state;
  }

  const fuelSlots = normalizeGeneratorFuelSlots(
    generator.level,
    generator.generatorFuelSlots,
  );
  const previousUpdatedAt = generator.generatorFuelUpdatedAt ?? now;
  const elapsedSeconds = Math.max(
    0,
    Math.floor((now - previousUpdatedAt) / 1000),
  );

  if (elapsedSeconds <= 0) {
    return state;
  }

  let secondsToConsume = elapsedSeconds;
  const nextFuelSlots = fuelSlots.map((slot) => {
    if (!slot || secondsToConsume <= 0 || slot.fuelRemainingSeconds <= 0) {
      return slot;
    }

    const consumedSeconds = Math.min(
      secondsToConsume,
      slot.fuelRemainingSeconds,
    );
    secondsToConsume -= consumedSeconds;

    return {
      ...slot,
      fuelRemainingSeconds: slot.fuelRemainingSeconds - consumedSeconds,
    };
  });
  const hasFuelRemaining = nextFuelSlots.some(
    (slot) => slot && slot.fuelRemainingSeconds > 0,
  );

  return {
    ...state,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "generator"
        ? {
            ...module,
            status: hasFuelRemaining ? "active" : "idle",
            detail: getGeneratorDetail(hasFuelRemaining, nextFuelSlots),
            generatorFuelSlots: nextFuelSlots,
            generatorPoweredOn: hasFuelRemaining,
            generatorFuelUpdatedAt: hasFuelRemaining
              ? previousUpdatedAt + elapsedSeconds * 1000
              : undefined,
          }
        : module,
    ),
  };
}

export function insertGeneratorFuel(
  state: GameState,
  slotIndex: number,
): GameState | null {
  const generator = state.hideoutModules.find(
    (module) => module.id === "generator",
  );

  if (!generator || generator.level < 1 || generator.generatorPoweredOn) {
    return null;
  }

  const fuelSlots = normalizeGeneratorFuelSlots(
    generator.level,
    generator.generatorFuelSlots,
  );

  if (slotIndex < 0 || slotIndex >= fuelSlots.length || fuelSlots[slotIndex]) {
    return null;
  }

  const consumedFuel = consumeOneFuelItem(
    state.stash,
    GENERATOR_FUEL_ITEM_ID,
  );

  if (!consumedFuel) {
    return null;
  }

  fuelSlots[slotIndex] = consumedFuel.fuelSlot;

  return {
    ...state,
    stash: consumedFuel.stash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "generator"
        ? {
            ...module,
            status: "idle",
            detail: getGeneratorDetail(false, fuelSlots),
            generatorFuelSlots: fuelSlots,
            generatorPoweredOn: false,
            generatorFuelUpdatedAt: undefined,
          }
        : module,
    ),
  };
}

export function removeGeneratorFuel(
  state: GameState,
  slotIndex: number,
): GameState | null {
  const generator = state.hideoutModules.find(
    (module) => module.id === "generator",
  );

  if (!generator || generator.generatorPoweredOn) {
    return null;
  }

  const fuelSlots = normalizeGeneratorFuelSlots(
    generator.level,
    generator.generatorFuelSlots,
  );

  if (slotIndex < 0 || slotIndex >= fuelSlots.length) {
    return null;
  }

  const fuelSlot = fuelSlots[slotIndex];

  if (!fuelSlot) {
    return null;
  }

  fuelSlots[slotIndex] = null;

  return {
    ...state,
    stash: addFuelItemToStash(state.stash, fuelSlot),
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "generator"
        ? {
            ...module,
            status: "idle",
            detail: getGeneratorDetail(false, fuelSlots),
            generatorFuelSlots: fuelSlots,
            generatorPoweredOn: false,
            generatorFuelUpdatedAt: undefined,
          }
        : module,
    ),
  };
}

export function toggleGeneratorPower(
  state: GameState,
  now: number,
): GameState | null {
  const resolvedState = resolveGeneratorFuel(state, now);
  const generator = resolvedState.hideoutModules.find(
    (module) => module.id === "generator",
  );

  if (!generator || generator.level < 1) {
    return null;
  }

  const fuelSlots = normalizeGeneratorFuelSlots(
    generator.level,
    generator.generatorFuelSlots,
  );
  const hasFuel = fuelSlots.some(
    (slot) => slot && slot.fuelRemainingSeconds > 0,
  );
  const nextPoweredOn = !generator.generatorPoweredOn;

  if (nextPoweredOn && !hasFuel) {
    return null;
  }

  return {
    ...resolvedState,
    hideoutModules: resolvedState.hideoutModules.map((module) =>
      module.id === "generator"
        ? {
            ...module,
            status: nextPoweredOn ? "active" : "idle",
            detail: getGeneratorDetail(nextPoweredOn, fuelSlots),
            generatorFuelSlots: fuelSlots,
            generatorPoweredOn: nextPoweredOn,
            generatorFuelUpdatedAt: nextPoweredOn ? now : undefined,
          }
        : module,
    ),
  };
}
