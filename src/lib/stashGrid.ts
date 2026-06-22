import { getWeaponVisualGridSize } from "../data/weapons/weaponClasses";
import type { GameItem, InventorySlot, ItemGridSize } from "../types/items";
import { getItemById } from "./items";

export const STASH_GRID_COLUMNS = 6;
export const STASH_MIN_ROWS = 12;

export function getSlotGridSize(slot: InventorySlot, item: GameItem): ItemGridSize {
  const baseSize = getWeaponVisualGridSize(item.tags) ?? item.gridSize;

  if (!slot.isRotated) {
    return baseSize;
  }

  return {
    width: baseSize.height,
    height: baseSize.width,
  };
}

function doRectanglesOverlap(
  aColumn: number,
  aRow: number,
  aWidth: number,
  aHeight: number,
  bColumn: number,
  bRow: number,
  bWidth: number,
  bHeight: number,
) {
  return !(
    aColumn + aWidth <= bColumn ||
    bColumn + bWidth <= aColumn ||
    aRow + aHeight <= bRow ||
    bRow + bHeight <= aRow
  );
}

export function canPlaceStashSlot(
  slots: InventorySlot[],
  movingSlotId: string,
  column: number,
  row: number,
) {
  const movingSlot = slots.find((slot) => slot.slotId === movingSlotId);
  const movingItem = movingSlot ? getItemById(movingSlot.itemId) : undefined;

  if (!movingSlot || !movingItem) {
    return false;
  }

  const movingSize = getSlotGridSize(movingSlot, movingItem);

  if (
    column < 0 ||
    row < 0 ||
    column + movingSize.width > STASH_GRID_COLUMNS
  ) {
    return false;
  }

  return slots.every((slot) => {
    if (slot.slotId === movingSlotId || !slot.gridPosition) {
      return true;
    }

    const item = getItemById(slot.itemId);

    if (!item) {
      return true;
    }

    const size = getSlotGridSize(slot, item);

    return !doRectanglesOverlap(
      column,
      row,
      movingSize.width,
      movingSize.height,
      slot.gridPosition.column,
      slot.gridPosition.row,
      size.width,
      size.height,
    );
  });
}

export function canPlaceStashSlotWithRotation(
  slots: InventorySlot[],
  movingSlotId: string,
  column: number,
  row: number,
  isRotated: boolean,
) {
  const candidateSlots = slots.map((slot) =>
    slot.slotId === movingSlotId
      ? {
          ...slot,
          isRotated,
        }
      : slot,
  );

  return canPlaceStashSlot(candidateSlots, movingSlotId, column, row);
}

export function layoutStashSlots(slots: InventorySlot[]) {
  const positionedSlots: InventorySlot[] = [];

  for (const slot of slots) {
    const item = getItemById(slot.itemId);

    if (!item) {
      positionedSlots.push(slot);
      continue;
    }

    if (
      slot.gridPosition &&
      canPlaceStashSlot(
        [...positionedSlots, slot],
        slot.slotId,
        slot.gridPosition.column,
        slot.gridPosition.row,
      )
    ) {
      positionedSlots.push(slot);
      continue;
    }

    let row = 0;
    let didPlace = false;

    while (!didPlace) {
      for (let column = 0; column < STASH_GRID_COLUMNS; column += 1) {
        const candidateSlot = {
          ...slot,
          gridPosition: { column, row },
        };
        const candidates = [...positionedSlots, candidateSlot];

        if (canPlaceStashSlot(candidates, slot.slotId, column, row)) {
          positionedSlots.push(candidateSlot);
          didPlace = true;
          break;
        }
      }

      row += 1;
    }
  }

  return positionedSlots;
}

export function getStashGridRowCount(slots: InventorySlot[]) {
  const occupiedRows = slots.reduce((maxRow, slot) => {
    const item = getItemById(slot.itemId);

    if (!item || !slot.gridPosition) {
      return maxRow;
    }

    const size = getSlotGridSize(slot, item);
    return Math.max(maxRow, slot.gridPosition.row + size.height);
  }, 0);

  return Math.max(STASH_MIN_ROWS, occupiedRows + 4);
}
