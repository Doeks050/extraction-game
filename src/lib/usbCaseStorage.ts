import type { InventorySlot } from "../types/items";
import type { GameState } from "../types/state";
import { getItemById } from "./items";
import {
  isPrinterUsbItem,
  USB_STORAGE_CASE_ITEM_ID,
} from "./threeDPrinterSupplies";

export const USB_CASE_COLUMNS = 3;
export const USB_CASE_ROWS = 3;
export const USB_CASE_CAPACITY = USB_CASE_COLUMNS * USB_CASE_ROWS;

export function isUsbStorageCase(slot: InventorySlot) {
  return slot.itemId === USB_STORAGE_CASE_ITEM_ID;
}

export function layoutUsbCaseSlots(slots: InventorySlot[]) {
  return slots.slice(0, USB_CASE_CAPACITY).map((slot, index) => ({
    ...slot,
    gridPosition: {
      column: index % USB_CASE_COLUMNS,
      row: Math.floor(index / USB_CASE_COLUMNS),
    },
    isRotated: false,
  }));
}

export function canStoreItemInUsbCase(itemId: string) {
  const item = getItemById(itemId);
  return Boolean(item && isPrinterUsbItem(itemId));
}

export function storeUsbInCase(
  state: GameState,
  caseSlotId: string,
  usbSlotId: string,
): GameState | null {
  const caseSlot = state.stash.find((slot) => slot.slotId === caseSlotId);
  const usbSlot = state.stash.find((slot) => slot.slotId === usbSlotId);

  if (
    !caseSlot ||
    !isUsbStorageCase(caseSlot) ||
    !usbSlot ||
    !canStoreItemInUsbCase(usbSlot.itemId)
  ) {
    return null;
  }

  const containedSlots = layoutUsbCaseSlots(caseSlot.containedSlots ?? []);

  if (containedSlots.length >= USB_CASE_CAPACITY) {
    return null;
  }

  const storedUsb: InventorySlot = {
    ...usbSlot,
    quantity: 1,
    gridPosition: undefined,
    isRotated: false,
  };
  const nextContainedSlots = layoutUsbCaseSlots([
    ...containedSlots,
    storedUsb,
  ]);
  const nextStash = state.stash.flatMap((slot) => {
    if (slot.slotId === caseSlotId) {
      return [
        {
          ...slot,
          containedSlots: nextContainedSlots,
        },
      ];
    }

    if (slot.slotId !== usbSlotId) {
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
    ...state,
    stash: nextStash,
  };
}

export function removeUsbFromCase(
  state: GameState,
  caseSlotId: string,
  usbSlotId: string,
): GameState | null {
  const caseSlot = state.stash.find((slot) => slot.slotId === caseSlotId);

  if (!caseSlot || !isUsbStorageCase(caseSlot)) {
    return null;
  }

  const containedSlots = layoutUsbCaseSlots(caseSlot.containedSlots ?? []);
  const usbSlot = containedSlots.find((slot) => slot.slotId === usbSlotId);

  if (!usbSlot || !canStoreItemInUsbCase(usbSlot.itemId)) {
    return null;
  }

  const nextContainedSlots = layoutUsbCaseSlots(
    containedSlots.filter((slot) => slot.slotId !== usbSlotId),
  );
  const restoredUsb: InventorySlot = {
    ...usbSlot,
    slotId: `usb_case_return_${Date.now()}_${usbSlot.slotId}`,
    gridPosition: undefined,
    isRotated: false,
  };

  return {
    ...state,
    stash: [
      ...state.stash.map((slot) =>
        slot.slotId === caseSlotId
          ? {
              ...slot,
              containedSlots: nextContainedSlots,
            }
          : slot,
      ),
      restoredUsb,
    ],
  };
}
