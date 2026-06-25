import { getGeneratorFuelSlotCount } from "../data/hideout/generatorConfig";
import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import { getItemById } from "./items";

export const GENERATOR_FUEL_ITEM_ID = "part_fuel_jerrycan";

export function normalizeGeneratorFuelSlots(
  level: number,
  slots: Array<string | null> | undefined,
) {
  const slotCount = getGeneratorFuelSlotCount(level);

  return Array.from(
    { length: slotCount },
    (_, index) => slots?.[index] ?? null,
  );
}

function consumeOneItem(stash: InventorySlot[], itemId: string) {
  const targetIndex = stash.findIndex(
    (slot) => slot.itemId === itemId && slot.quantity > 0,
  );

  if (targetIndex < 0) {
    return null;
  }

  return stash.flatMap((slot, index) => {
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
}

function addOneItem(stash: InventorySlot[], itemId: string): InventorySlot[] {
  const item = getItemById(itemId);

  if (!item) {
    return stash;
  }

  const stackIndex = stash.findIndex(
    (slot) => slot.itemId === itemId && slot.quantity < item.maxStack,
  );

  if (stackIndex >= 0) {
    return stash.map((slot, index) =>
      index === stackIndex
        ? {
            ...slot,
            quantity: slot.quantity + 1,
          }
        : slot,
    );
  }

  return [
    ...stash,
    {
      slotId: `generator_return_${Date.now()}`,
      itemId,
      quantity: 1,
    },
  ];
}

function getGeneratorDetail(
  poweredOn: boolean,
  fuelSlots: Array<string | null>,
) {
  const loadedCount = fuelSlots.filter(Boolean).length;
  const slotCount = fuelSlots.length;

  if (poweredOn && loadedCount > 0) {
    return "Power online";
  }

  if (loadedCount > 0) {
    return `${loadedCount} / ${slotCount} fuel loaded`;
  }

  return "No fuel";
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

  const nextStash = consumeOneItem(state.stash, GENERATOR_FUEL_ITEM_ID);

  if (!nextStash) {
    return null;
  }

  fuelSlots[slotIndex] = GENERATOR_FUEL_ITEM_ID;

  return {
    ...state,
    stash: nextStash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "generator"
        ? {
            ...module,
            status: "idle",
            detail: getGeneratorDetail(false, fuelSlots),
            generatorFuelSlots: fuelSlots,
            generatorPoweredOn: false,
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

  const itemId = fuelSlots[slotIndex];

  if (!itemId) {
    return null;
  }

  fuelSlots[slotIndex] = null;

  return {
    ...state,
    stash: addOneItem(state.stash, itemId),
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "generator"
        ? {
            ...module,
            status: "idle",
            detail: getGeneratorDetail(false, fuelSlots),
            generatorFuelSlots: fuelSlots,
            generatorPoweredOn: false,
          }
        : module,
    ),
  };
}

export function toggleGeneratorPower(state: GameState): GameState | null {
  const generator = state.hideoutModules.find(
    (module) => module.id === "generator",
  );

  if (!generator || generator.level < 1) {
    return null;
  }

  const fuelSlots = normalizeGeneratorFuelSlots(
    generator.level,
    generator.generatorFuelSlots,
  );
  const hasFuel = fuelSlots.some(Boolean);
  const nextPoweredOn = !generator.generatorPoweredOn;

  if (nextPoweredOn && !hasFuel) {
    return null;
  }

  return {
    ...state,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "generator"
        ? {
            ...module,
            status: nextPoweredOn ? "active" : "idle",
            detail: getGeneratorDetail(nextPoweredOn, fuelSlots),
            generatorFuelSlots: fuelSlots,
            generatorPoweredOn: nextPoweredOn,
          }
        : module,
    ),
  };
}
