import type { HideoutCraftingRecipe } from "../types/hideoutCrafting";
import type { HideoutModule, PrinterFilamentSlot } from "../types/game";
import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import { getItemById } from "./items";

export const BASIC_FILAMENT_ITEM_ID = "printer_filament_basic";
export const LEGACY_FILAMENT_ITEM_ID = "printer_filament_spool";
export const USB_STORAGE_CASE_ITEM_ID = "usb_storage_case";
export const PRINTER_CONTENT_MIGRATION_VERSION = 1;

const starterPrinterItemIds = [
  BASIC_FILAMENT_ITEM_ID,
  "printer_filament_industrial",
  "printer_filament_reinforced",
  "printer_filament_carbon",
  "printer_usb_drummer",
  "printer_usb_ghost",
  "printer_usb_sentry",
  USB_STORAGE_CASE_ITEM_ID,
];

function normalizeFilamentItemId(itemId: string) {
  return itemId === LEGACY_FILAMENT_ITEM_ID
    ? BASIC_FILAMENT_ITEM_ID
    : itemId;
}

function getFilamentPrintCapacity(itemId: string) {
  return getItemById(normalizeFilamentItemId(itemId))?.filamentPrintCapacity ?? 0;
}

function convertLegacyUnitsToPrints(
  remainingUnits: number | undefined,
  capacityUnits: number | undefined,
  printCapacity: number,
) {
  const safeCapacityUnits = Math.max(1, capacityUnits ?? 100);
  const safeRemainingUnits = Math.max(
    0,
    Math.min(safeCapacityUnits, remainingUnits ?? safeCapacityUnits),
  );

  return Math.max(
    0,
    Math.min(
      printCapacity,
      Math.ceil((safeRemainingUnits / safeCapacityUnits) * printCapacity),
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

  const filamentPrintsRemaining =
    printsRemaining ??
    convertLegacyUnitsToPrints(
      legacyRemainingUnits,
      100,
      filamentPrintCapacity,
    );

  return {
    itemId: normalizedItemId,
    filamentPrintCapacity,
    filamentPrintsRemaining: Math.max(
      0,
      Math.min(filamentPrintCapacity, filamentPrintsRemaining),
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

export function hasEnoughPrinterFilament(module: HideoutModule) {
  const filamentSlot = normalizePrinterFilamentSlot(
    module.printerFilamentSlot,
  );

  return Boolean(filamentSlot && filamentSlot.filamentPrintsRemaining >= 1);
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
    (slot) => getFilamentPrintCapacity(slot.itemId) > 0,
  );

  if (!taken) {
    return null;
  }

  const filamentState = getInventoryFilamentState(
    taken.sourceSlot.itemId,
    taken.sourceSlot.filamentPrintsRemaining,
    taken.sourceSlot.filamentRemainingUnits,
  );

  if (!filamentState) {
    return null;
  }

  return {
    ...state,
    stash: taken.stash,
    hideoutModules: state.hideoutModules.map((module) =>
      module.id === "three_d_printer"
        ? {
            ...module,
            printerFilamentSlot: filamentState,
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
      filamentPrintsRemaining: filamentSlot.filamentPrintsRemaining,
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

function hasItemInSlots(slots: InventorySlot[], itemId: string): boolean {
  return slots.some(
    (slot) =>
      slot.itemId === itemId ||
      hasItemInSlots(slot.containedSlots ?? [], itemId),
  );
}

function normalizeLegacyInventorySlot(slot: InventorySlot): InventorySlot {
  const filamentState = getInventoryFilamentState(
    slot.itemId,
    slot.filamentPrintsRemaining,
    slot.filamentRemainingUnits,
  );

  return {
    ...slot,
    itemId: filamentState?.itemId ?? slot.itemId,
    filamentPrintsRemaining: filamentState?.filamentPrintsRemaining,
    filamentRemainingUnits: undefined,
    containedSlots: slot.containedSlots?.map(normalizeLegacyInventorySlot),
  };
}

export function applyPrinterContentMigration(state: GameState): GameState {
  if (
    (state.contentMigrationVersion ?? 0) >=
    PRINTER_CONTENT_MIGRATION_VERSION
  ) {
    return state;
  }

  const normalizedStash = state.stash.map(normalizeLegacyInventorySlot);
  const normalizedModules = state.hideoutModules.map((module) =>
    module.id === "three_d_printer"
      ? {
          ...module,
          printerFilamentSlot: normalizePrinterFilamentSlot(
            module.printerFilamentSlot,
          ),
          printerUsbItemId: module.printerUsbItemId ?? null,
        }
      : module,
  );
  const nextStash = [...normalizedStash];

  starterPrinterItemIds.forEach((itemId, index) => {
    if (hasItemInSlots(nextStash, itemId)) {
      return;
    }

    const filamentPrintCapacity = getFilamentPrintCapacity(itemId);

    nextStash.push({
      slotId: `printer_content_v1_${index + 1}`,
      itemId,
      quantity: 1,
      filamentPrintsRemaining:
        filamentPrintCapacity > 0 ? filamentPrintCapacity : undefined,
      containedSlots: itemId === USB_STORAGE_CASE_ITEM_ID ? [] : undefined,
    });
  });

  return {
    ...state,
    stash: nextStash,
    hideoutModules: normalizedModules,
    contentMigrationVersion: PRINTER_CONTENT_MIGRATION_VERSION,
  };
}
