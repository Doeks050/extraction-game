import type { HideoutCraftingRecipe } from "../types/hideoutCrafting";
import type { HideoutModule, PrinterFilamentSlot } from "../types/game";
import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import { getItemById } from "./items";

export const PRINTER_FILAMENT_ITEM_ID = "printer_filament_spool";

function getFilamentCapacityUnits(itemId: string) {
  return getItemById(itemId)?.filamentCapacityUnits ?? 0;
}

export function normalizePrinterFilamentSlot(
  value: PrinterFilamentSlot | null | undefined,
): PrinterFilamentSlot | null {
  if (!value) {
    return null;
  }

  const configuredCapacity = getFilamentCapacityUnits(value.itemId);
  const filamentCapacityUnits = Math.max(
    0,
    value.filamentCapacityUnits || configuredCapacity,
  );

  if (filamentCapacityUnits <= 0) {
    return null;
  }

  return {
    itemId: value.itemId,
    filamentCapacityUnits,
    filamentRemainingUnits: Math.min(
      filamentCapacityUnits,
      Math.max(0, value.filamentRemainingUnits),
    ),
  };
}

export function getFilamentPercentage(
  remainingUnits: number,
  capacityUnits: number,
) {
  if (capacityUnits <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.ceil((remainingUnits / capacityUnits) * 100)),
  );
}

export function getInventoryFilamentPercentage(
  itemId: string,
  remainingUnits?: number,
) {
  const capacityUnits = getFilamentCapacityUnits(itemId);

  if (capacityUnits <= 0) {
    return null;
  }

  return getFilamentPercentage(
    remainingUnits ?? capacityUnits,
    capacityUnits,
  );
}

export function isPrinterUsbItem(itemId: string) {
  const recipeIds = getItemById(itemId)?.printerRecipeIds;
  return Array.isArray(recipeIds) && recipeIds.length > 0;
}

export function getPrinterUsbRecipeIds(itemId: string | null | undefined) {
  if (!itemId) {
    return [];
  }

  return getItemById(itemId)?.printerRecipeIds ?? [];
}

export function isPrinterRecipeUnlocked(
  module: HideoutModule,
  recipe: HideoutCraftingRecipe,
) {
  if (module.level < recipe.requiredLevel) {
    return false;
  }

  if (!recipe.requiredUsbItemId) {
    return true;
  }

  return module.printerUsbItemId === recipe.requiredUsbItemId;
}

export function hasEnoughPrinterFilament(
  module: HideoutModule,
  recipe: HideoutCraftingRecipe,
) {
  const filamentSlot = normalizePrinterFilamentSlot(
    module.printerFilamentSlot,
  );
  const requiredUnits = recipe.filamentCostUnits ?? 0;

  return Boolean(
    filamentSlot && filamentSlot.filamentRemainingUnits >= requiredUnits,
  );
}

function takeSingleInventorySlot(
  stash: InventorySlot[],
  predicate: (slot: InventorySlot) => boolean,
) {
  const targetIndex = stash.findIndex(predicate);

  if (targetIndex < 0) {
    return null;
  }

  const sourceSlot = stash[targetIndex];
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
    sourceSlot,
    stash: nextStash,
  };
}

function addSingleItemToStash(
  stash: InventorySlot[],
  itemId: string,
  metadata?: Partial<InventorySlot>,
) {
  return [
    ...stash,
    {
      slotId: `printer_return_${Date.now()}_${stash.length + 1}`,
      itemId,
      quantity: 1,
      ...metadata,
    },
  ];
}

export function insertPrinterFilament(state: GameState): GameState | null {
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );

  if (
    !printer ||
    printer.level < 1 ||
    printer.craftingRecipeId ||
    printer.printerFilamentSlot
  ) {
    return null;
  }

  const taken = takeSingleInventorySlot(
    state.stash,
    (slot) => getFilamentCapacityUnits(slot.itemId) > 0,
  );

  if (!taken) {
    return null;
  }

  const filamentCapacityUnits = getFilamentCapacityUnits(
    taken.sourceSlot.itemId,
  );
  const filamentRemainingUnits = Math.min(
    filamentCapacityUnits,
    Math.max(
      0,
      taken.sourceSlot.filamentRemainingUnits ?? filamentCapacityUnits,
    ),
  );

  return {
    ...state,
    stash: taken.stash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? {
            ...module,
            printerFilamentSlot: {
              itemId: taken.sourceSlot.itemId,
              filamentRemainingUnits,
              filamentCapacityUnits,
            },
          }
        : module,
    ),
  };
}

export function removePrinterFilament(state: GameState): GameState | null {
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );
  const filamentSlot = normalizePrinterFilamentSlot(
    printer?.printerFilamentSlot,
  );

  if (!printer || printer.craftingRecipeId || !filamentSlot) {
    return null;
  }

  return {
    ...state,
    stash: addSingleItemToStash(state.stash, filamentSlot.itemId, {
      filamentRemainingUnits: filamentSlot.filamentRemainingUnits,
    }),
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? {
            ...module,
            printerFilamentSlot: null,
          }
        : module,
    ),
  };
}

export function insertPrinterUsb(state: GameState): GameState | null {
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );

  if (
    !printer ||
    printer.level < 1 ||
    printer.craftingRecipeId ||
    printer.printerUsbItemId
  ) {
    return null;
  }

  const taken = takeSingleInventorySlot(
    state.stash,
    (slot) => isPrinterUsbItem(slot.itemId),
  );

  if (!taken) {
    return null;
  }

  return {
    ...state,
    stash: taken.stash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? {
            ...module,
            printerUsbItemId: taken.sourceSlot.itemId,
          }
        : module,
    ),
  };
}

export function removePrinterUsb(state: GameState): GameState | null {
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );

  if (!printer || printer.craftingRecipeId || !printer.printerUsbItemId) {
    return null;
  }

  return {
    ...state,
    stash: addSingleItemToStash(
      state.stash,
      printer.printerUsbItemId,
    ),
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? {
            ...module,
            printerUsbItemId: null,
          }
        : module,
    ),
  };
}
