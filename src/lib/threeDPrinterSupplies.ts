import type { HideoutCraftingRecipe } from "../types/hideoutCrafting";
import type { HideoutModule, PrinterFilamentSlot } from "../types/game";
import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import { getItemById } from "./items";

export const BASIC_FILAMENT_ITEM_ID = "printer_filament_basic";
export const LEGACY_FILAMENT_ITEM_ID = "printer_filament_spool";
export const USB_STORAGE_CASE_ITEM_ID = "usb_storage_case";

function normalizeFilamentItemId(itemId: string) {
  return itemId === LEGACY_FILAMENT_ITEM_ID
    ? BASIC_FILAMENT_ITEM_ID
    : itemId;
}

export function getFilamentPrintCapacity(itemId: string) {
  return getItemById(normalizeFilamentItemId(itemId))?.filamentPrintCapacity ?? 0;
}

function convertLegacyUnitsToPrints(
  remainingUnits: number | undefined,
  capacityUnits: number | undefined,
  printCapacity: number,
) {
  const safeCapacity = Math.max(1, capacityUnits ?? 100);
  const safeRemaining = Math.max(
    0,
    Math.min(safeCapacity, remainingUnits ?? safeCapacity),
  );

  return Math.max(
    0,
    Math.min(
      printCapacity,
      Math.ceil((safeRemaining / safeCapacity) * printCapacity),
    ),
  );
}

export function normalizePrinterFilamentSlot(
  value: PrinterFilamentSlot | null | undefined,
): PrinterFilamentSlot | null {
  if (!value) {
    return null;
  }

  const itemId = normalizeFilamentItemId(value.itemId);
  const filamentPrintCapacity = getFilamentPrintCapacity(itemId);

  if (filamentPrintCapacity <= 0) {
    return null;
  }

  const filamentPrintsRemaining =
    value.filamentPrintsRemaining ??
    convertLegacyUnitsToPrints(
      value.filamentRemainingUnits,
      value.filamentCapacityUnits,
      filamentPrintCapacity,
    );

  return {
    itemId,
    filamentPrintCapacity,
    filamentPrintsRemaining: Math.max(
      0,
      Math.min(filamentPrintCapacity, filamentPrintsRemaining),
    ),
  };
}

export function getInventoryFilamentState(
  itemId: string,
  printsRemaining?: number,
  legacyRemainingUnits?: number,
) {
  const normalizedItemId = normalizeFilamentItemId(itemId);
  const filamentPrintCapacity = getFilamentPrintCapacity(normalizedItemId);

  if (filamentPrintCapacity <= 0) {
    return null;
  }

  return {
    itemId: normalizedItemId,
    filamentPrintCapacity,
    filamentPrintsRemaining: Math.max(
      0,
      Math.min(
        filamentPrintCapacity,
        printsRemaining ??
          convertLegacyUnitsToPrints(
            legacyRemainingUnits,
            100,
            filamentPrintCapacity,
          ),
      ),
    ),
  };
}

export function isPrinterUsbItem(itemId: string) {
  const item = getItemById(itemId);
  return Boolean(
    item?.tags.includes("printer-usb") && item.printerRecipeIds?.length,
  );
}

export function getPrinterUsbRecipeIds(itemId: string | null | undefined) {
  return itemId ? getItemById(itemId)?.printerRecipeIds ?? [] : [];
}

export function isPrinterRecipeUnlocked(
  module: HideoutModule,
  recipe: HideoutCraftingRecipe,
) {
  if (module.level < recipe.requiredLevel) {
    return false;
  }

  return !recipe.requiredUsbItemId ||
    module.printerUsbItemId === recipe.requiredUsbItemId;
}

export function hasEnoughPrinterFilament(module: HideoutModule) {
  const slot = normalizePrinterFilamentSlot(module.printerFilamentSlot);
  return Boolean(slot && slot.filamentPrintsRemaining >= 1);
}

function takeOne(
  stash: InventorySlot[],
  itemId: string,
) {
  const index = stash.findIndex(
    (slot) => slot.itemId === itemId && slot.quantity > 0,
  );

  if (index < 0) {
    return null;
  }

  const sourceSlot = stash[index];
  const nextStash = stash.flatMap((slot, slotIndex) => {
    if (slotIndex !== index) {
      return [slot];
    }

    return slot.quantity <= 1
      ? []
      : [{ ...slot, quantity: slot.quantity - 1 }];
  });

  return { sourceSlot, stash: nextStash };
}

function returnOne(
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

export function insertPrinterFilament(
  state: GameState,
  itemId: string,
): GameState | null {
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );

  if (
    !printer ||
    printer.level < 1 ||
    printer.craftingRecipeId ||
    printer.printerFilamentSlot ||
    getFilamentPrintCapacity(itemId) <= 0
  ) {
    return null;
  }

  const taken = takeOne(state.stash, itemId);
  const filamentState = taken
    ? getInventoryFilamentState(
        taken.sourceSlot.itemId,
        taken.sourceSlot.filamentPrintsRemaining,
        taken.sourceSlot.filamentRemainingUnits,
      )
    : null;

  if (!taken || !filamentState) {
    return null;
  }

  return {
    ...state,
    stash: taken.stash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? { ...module, printerFilamentSlot: filamentState }
        : module,
    ),
  };
}

export function removePrinterFilament(state: GameState): GameState | null {
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );
  const slot = normalizePrinterFilamentSlot(printer?.printerFilamentSlot);

  if (!printer || printer.craftingRecipeId || !slot) {
    return null;
  }

  return {
    ...state,
    stash: returnOne(state.stash, slot.itemId, {
      filamentPrintsRemaining: slot.filamentPrintsRemaining,
    }),
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? { ...module, printerFilamentSlot: null }
        : module,
    ),
  };
}

export function insertPrinterUsb(
  state: GameState,
  itemId: string,
): GameState | null {
  const printer = state.hideoutModules.find(
    (module) => module.id === "three_d_printer",
  );

  if (
    !printer ||
    printer.level < 1 ||
    printer.craftingRecipeId ||
    printer.printerUsbItemId ||
    !isPrinterUsbItem(itemId)
  ) {
    return null;
  }

  const taken = takeOne(state.stash, itemId);

  if (!taken) {
    return null;
  }

  return {
    ...state,
    stash: taken.stash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? { ...module, printerUsbItemId: taken.sourceSlot.itemId }
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
    stash: returnOne(state.stash, printer.printerUsbItemId),
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? { ...module, printerUsbItemId: null }
        : module,
    ),
  };
}
