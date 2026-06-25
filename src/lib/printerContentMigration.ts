import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import {
  BASIC_FILAMENT_ITEM_ID,
  getFilamentPrintCapacity,
  getInventoryFilamentState,
  normalizePrinterFilamentSlot,
  USB_STORAGE_CASE_ITEM_ID,
} from "./threeDPrinterSupplies";

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
