import type { InventorySlot } from "../types/items";
import { getItemById } from "./items";

function createSplitSlot(
  slot: InventorySlot,
  quantity: number,
  index: number,
  containedSlots: InventorySlot[] | undefined,
): InventorySlot {
  return {
    ...slot,
    slotId: index === 0 ? slot.slotId : `${slot.slotId}_split_${index + 1}`,
    quantity,
    gridPosition: index === 0 ? slot.gridPosition : undefined,
    containedSlots:
      index === 0
        ? containedSlots
        : slot.containedSlots
          ? []
          : undefined,
  };
}

export function normalizeInventoryStacking(
  slots: InventorySlot[],
): InventorySlot[] {
  return slots.flatMap((slot) => {
    const item = getItemById(slot.itemId);
    const containedSlots = slot.containedSlots
      ? normalizeInventoryStacking(slot.containedSlots)
      : undefined;

    if (!item) {
      return [
        {
          ...slot,
          containedSlots,
        },
      ];
    }

    const stackLimit = item.category === "ammo"
      ? Math.max(1, item.maxStack)
      : 1;
    let remaining = Math.max(1, slot.quantity);
    const splitSlots: InventorySlot[] = [];
    let index = 0;

    while (remaining > 0) {
      const quantity = Math.min(stackLimit, remaining);
      splitSlots.push(
        createSplitSlot(slot, quantity, index, containedSlots),
      );
      remaining -= quantity;
      index += 1;
    }

    return splitSlots;
  });
}
