"use client";

import { useRef, useState } from "react";
import { getWeaponCaliberFromTags } from "../../data/weapons/calibers";
import { getWeaponClassFromTags } from "../../data/weapons/weaponClasses";
import type { HydratedInventorySlot } from "../../lib/items";
import {
  canPlaceStashSlotWithRotation,
  getSlotGridSize,
  getStashGridRowCount,
  STASH_GRID_COLUMNS,
} from "../../lib/stashGrid";
import { isPrinterUsbItem } from "../../lib/threeDPrinterSupplies";
import {
  isUsbStorageCase,
  USB_CASE_CAPACITY,
} from "../../lib/usbCaseStorage";
import { ItemImage } from "../items/ItemImage";

const HOLD_DELAY_MS = 220;
const CELL_HEIGHT_PX = 60;
const GRID_GAP_PX = 6;

const rarityClassNames = {
  common: "border-zinc-700 text-zinc-300",
  uncommon: "border-emerald-500/50 text-emerald-300",
  rare: "border-sky-500/50 text-sky-300",
  epic: "border-purple-500/50 text-purple-300",
  legendary: "border-orange-400/70 text-orange-300",
};

type DragState = {
  slotId: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  targetColumn: number;
  targetRow: number;
  targetCaseSlotId?: string;
  isRotated: boolean;
  isValid: boolean;
};

type PressState = {
  slotId: string;
  pointerId: number;
  startX: number;
  startY: number;
  latestX: number;
  latestY: number;
  anchorColumn: number;
  anchorRow: number;
};

type StashInventoryGridProps = {
  slots: HydratedInventorySlot[];
  onSelectSlot: (slot: HydratedInventorySlot) => void;
  onMoveSlot: (
    slotId: string,
    column: number,
    row: number,
    isRotated: boolean,
  ) => void;
  onStoreUsb: (caseSlotId: string, usbSlotId: string) => void;
};

function getWeaponImageClassName(slot: HydratedInventorySlot) {
  const weaponClass = getWeaponClassFromTags(slot.item.tags);
  const rotationClass = slot.isRotated ? "rotate-90" : "";

  if (weaponClass?.id === "pistol") {
    return `h-[125%] w-auto max-w-[125%] object-contain opacity-95 ${rotationClass}`;
  }

  if (weaponClass?.id === "assault_rifle") {
    return `h-[205%] w-[205%] max-h-none max-w-none object-contain opacity-95 ${rotationClass}`;
  }

  if (weaponClass?.id === "dmr") {
    return `h-[255%] w-[255%] max-h-none max-w-none object-contain opacity-95 ${rotationClass}`;
  }

  return `h-full w-full max-h-full max-w-full object-contain opacity-95 ${rotationClass}`;
}

function getMagazineAmmoLabel(slot: HydratedInventorySlot) {
  const capacity = slot.item.stats?.capacity ?? 0;
  return `0/${capacity}`;
}

export function StashInventoryGrid({
  slots,
  onSelectSlot,
  onMoveSlot,
  onStoreUsb,
}: StashInventoryGridProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStateRef = useRef<PressState | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const rowCount = getStashGridRowCount(slots);

  function clearHoldTimer() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function getGridMetrics() {
    const grid = gridRef.current;

    if (!grid) {
      return null;
    }

    const rect = grid.getBoundingClientRect();
    const cellWidth =
      (rect.width - GRID_GAP_PX * (STASH_GRID_COLUMNS - 1)) / STASH_GRID_COLUMNS;

    return {
      rect,
      columnPitch: cellWidth + GRID_GAP_PX,
      rowPitch: CELL_HEIGHT_PX + GRID_GAP_PX,
    };
  }

  function getUsbCaseDropTarget(
    draggedSlot: HydratedInventorySlot,
    pointerColumn: number,
    pointerRow: number,
  ) {
    if (!isPrinterUsbItem(draggedSlot.itemId)) {
      return undefined;
    }

    return slots.find((candidate) => {
      if (
        candidate.slotId === draggedSlot.slotId ||
        !candidate.gridPosition ||
        !isUsbStorageCase(candidate) ||
        (candidate.containedSlots?.length ?? 0) >= USB_CASE_CAPACITY
      ) {
        return false;
      }

      const size = getSlotGridSize(candidate, candidate.item);
      const startColumn = candidate.gridPosition.column;
      const endColumn = startColumn + size.width;
      const startRow = candidate.gridPosition.row;
      const endRow = startRow + size.height;

      return (
        pointerColumn >= startColumn &&
        pointerColumn < endColumn &&
        pointerRow >= startRow &&
        pointerRow < endRow
      );
    });
  }

  function buildDragState(
    press: PressState,
    clientX: number,
    clientY: number,
  ): DragState | null {
    const metrics = getGridMetrics();
    const slot = slots.find((candidate) => candidate.slotId === press.slotId);

    if (!metrics || !slot) {
      return null;
    }

    const rawColumn = Math.floor((clientX - metrics.rect.left) / metrics.columnPitch);
    const rawRow = Math.floor((clientY - metrics.rect.top) / metrics.rowPitch);
    const currentRotation = Boolean(slot.isRotated);
    const caseTarget = getUsbCaseDropTarget(slot, rawColumn, rawRow);

    if (caseTarget?.gridPosition) {
      return {
        slotId: slot.slotId,
        startX: press.startX,
        startY: press.startY,
        currentX: clientX,
        currentY: clientY,
        targetColumn: caseTarget.gridPosition.column,
        targetRow: caseTarget.gridPosition.row,
        targetCaseSlotId: caseTarget.slotId,
        isRotated: currentRotation,
        isValid: true,
      };
    }

    const currentSize = getSlotGridSize(slot, slot.item);
    const currentAnchorColumn = Math.min(press.anchorColumn, currentSize.width - 1);
    const currentAnchorRow = Math.min(press.anchorRow, currentSize.height - 1);
    const currentColumn = Math.max(0, rawColumn - currentAnchorColumn);
    const currentRow = Math.max(0, rawRow - currentAnchorRow);
    const currentFits = canPlaceStashSlotWithRotation(
      slots,
      slot.slotId,
      currentColumn,
      currentRow,
      currentRotation,
    );

    if (currentFits) {
      return {
        slotId: slot.slotId,
        startX: press.startX,
        startY: press.startY,
        currentX: clientX,
        currentY: clientY,
        targetColumn: currentColumn,
        targetRow: currentRow,
        isRotated: currentRotation,
        isValid: true,
      };
    }

    const rotatedSlot = {
      ...slot,
      isRotated: !currentRotation,
    };
    const rotatedSize = getSlotGridSize(rotatedSlot, rotatedSlot.item);
    const rotatedAnchorColumn = Math.min(press.anchorColumn, rotatedSize.width - 1);
    const rotatedAnchorRow = Math.min(press.anchorRow, rotatedSize.height - 1);
    const rotatedColumn = Math.max(0, rawColumn - rotatedAnchorColumn);
    const rotatedRow = Math.max(0, rawRow - rotatedAnchorRow);
    const rotatedFits = canPlaceStashSlotWithRotation(
      slots,
      slot.slotId,
      rotatedColumn,
      rotatedRow,
      !currentRotation,
    );

    return {
      slotId: slot.slotId,
      startX: press.startX,
      startY: press.startY,
      currentX: clientX,
      currentY: clientY,
      targetColumn: rotatedFits ? rotatedColumn : currentColumn,
      targetRow: rotatedFits ? rotatedRow : currentRow,
      isRotated: rotatedFits ? !currentRotation : currentRotation,
      isValid: rotatedFits,
    };
  }

  function publishDragState(nextDragState: DragState | null) {
    dragStateRef.current = nextDragState;
    setDragState(nextDragState);
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>,
    slot: HydratedInventorySlot,
  ) {
    clearHoldTimer();
    suppressClickRef.current = false;

    const metrics = getGridMetrics();

    if (!metrics) {
      return;
    }

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const size = getSlotGridSize(slot, slot.item);
    const anchorColumn = Math.max(
      0,
      Math.min(size.width - 1, Math.floor((event.clientX - buttonRect.left) / metrics.columnPitch)),
    );
    const anchorRow = Math.max(
      0,
      Math.min(size.height - 1, Math.floor((event.clientY - buttonRect.top) / metrics.rowPitch)),
    );

    event.currentTarget.setPointerCapture(event.pointerId);

    pressStateRef.current = {
      slotId: slot.slotId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      latestX: event.clientX,
      latestY: event.clientY,
      anchorColumn,
      anchorRow,
    };

    holdTimerRef.current = setTimeout(() => {
      const press = pressStateRef.current;

      if (!press) {
        return;
      }

      suppressClickRef.current = true;
      publishDragState(buildDragState(press, press.latestX, press.latestY));
    }, HOLD_DELAY_MS);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const press = pressStateRef.current;

    if (!press || press.pointerId !== event.pointerId) {
      return;
    }

    press.latestX = event.clientX;
    press.latestY = event.clientY;

    if (!dragStateRef.current) {
      return;
    }

    event.preventDefault();
    publishDragState(buildDragState(press, event.clientX, event.clientY));
  }

  function finishPointerInteraction(event: React.PointerEvent<HTMLButtonElement>) {
    clearHoldTimer();

    const activeDrag = dragStateRef.current;

    if (activeDrag?.targetCaseSlotId) {
      onStoreUsb(activeDrag.targetCaseSlotId, activeDrag.slotId);
    } else if (activeDrag?.isValid) {
      onMoveSlot(
        activeDrag.slotId,
        activeDrag.targetColumn,
        activeDrag.targetRow,
        activeDrag.isRotated,
      );
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pressStateRef.current = null;
    publishDragState(null);
  }

  const draggedSlot = dragState
    ? slots.find((slot) => slot.slotId === dragState.slotId)
    : undefined;
  const previewSlot = draggedSlot && dragState
    ? {
        ...draggedSlot,
        isRotated: dragState.isRotated,
      }
    : undefined;
  const previewSize = previewSlot
    ? getSlotGridSize(previewSlot, previewSlot.item)
    : null;

  return (
    <div
      ref={gridRef}
      className="relative grid touch-none grid-cols-6 gap-1.5"
      style={{ gridTemplateRows: `repeat(${rowCount}, ${CELL_HEIGHT_PX}px)` }}
    >
      {Array.from({ length: rowCount * STASH_GRID_COLUMNS }, (_, index) => (
        <div
          key={`cell-${index}`}
          className="border border-zinc-900 bg-black/25"
          style={{
            gridColumnStart: (index % STASH_GRID_COLUMNS) + 1,
            gridRowStart: Math.floor(index / STASH_GRID_COLUMNS) + 1,
          }}
        />
      ))}

      {dragState && previewSize && !dragState.targetCaseSlotId ? (
        <div
          className={[
            "pointer-events-none z-20 border-2 bg-black/35",
            dragState.isValid ? "border-emerald-400" : "border-red-500",
          ].join(" ")}
          style={{
            gridColumn: `${dragState.targetColumn + 1} / span ${previewSize.width}`,
            gridRow: `${dragState.targetRow + 1} / span ${previewSize.height}`,
          }}
        />
      ) : null}

      {slots.map((slot) => {
        if (!slot.gridPosition) {
          return null;
        }

        const isDragging = dragState?.slotId === slot.slotId;
        const isCaseDropTarget = dragState?.targetCaseSlotId === slot.slotId;
        const displaySlot = isDragging && dragState
          ? {
              ...slot,
              isRotated: dragState.isRotated,
            }
          : slot;
        const size = getSlotGridSize(displaySlot, displaySlot.item);
        const isSingleSlot = size.width === 1 && size.height === 1;
        const isWeapon = slot.item.category === "weapon";
        const isMagazine = slot.item.category === "magazine";
        const quantityLabel = slot.quantity > 1 ? `x${slot.quantity}` : "";
        const statusLabel = isWeapon
          ? getWeaponCaliberFromTags(slot.item.tags)
          : isMagazine
            ? getMagazineAmmoLabel(slot)
            : "";
        const translateX = isDragging ? dragState.currentX - dragState.startX : 0;
        const translateY = isDragging ? dragState.currentY - dragState.startY : 0;

        return (
          <button
            key={slot.slotId}
            type="button"
            title={slot.item.name}
            onPointerDown={(event) => handlePointerDown(event, slot)}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerInteraction}
            onPointerCancel={finishPointerInteraction}
            onClick={() => {
              if (suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
              }

              onSelectSlot(slot);
            }}
            className={[
              "relative z-10 overflow-hidden border bg-black/80 p-1 text-left active:scale-[0.99]",
              rarityClassNames[slot.item.rarity],
              isCaseDropTarget
                ? "z-20 border-emerald-400 bg-emerald-500/15 ring-2 ring-emerald-400/70"
                : "",
              isDragging
                ? `${dragState.isValid ? "border-emerald-400" : "border-red-500"} z-30 opacity-90 shadow-2xl`
                : "",
            ].join(" ")}
            style={{
              gridColumn: `${slot.gridPosition.column + 1} / span ${size.width}`,
              gridRow: `${slot.gridPosition.row + 1} / span ${size.height}`,
              transform: isDragging
                ? `translate3d(${translateX}px, ${translateY}px, 0)`
                : undefined,
              willChange: isDragging ? "transform" : undefined,
            }}
          >
            <div className="absolute inset-1 border border-zinc-900/80 bg-zinc-950/70" />

            {isWeapon ? (
              <div className="absolute inset-x-2 bottom-3 top-4 flex items-center justify-center overflow-hidden">
                {slot.item.image ? (
                  <img
                    src={slot.item.image}
                    alt={slot.item.name}
                    draggable={false}
                    className={getWeaponImageClassName(displaySlot)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-black uppercase text-zinc-500">
                    {slot.item.name.slice(0, 2)}
                  </div>
                )}
              </div>
            ) : (
              <ItemImage
                src={slot.item.image}
                alt={slot.item.name}
                fallback={slot.item.name.slice(0, 2)}
                className={
                  isSingleSlot
                    ? "absolute inset-0.5 flex items-center justify-center"
                    : "absolute inset-2 flex items-center justify-center"
                }
                imageClassName={[
                  displaySlot.isRotated ? "rotate-90" : "",
                  isSingleSlot ? "p-0.5 opacity-100" : "p-1 opacity-95",
                ].join(" ")}
              />
            )}

            {!isSingleSlot ? (
              <div className="absolute left-1.5 top-1.5 max-w-[70%] bg-black/70 px-1.5 py-0.5 text-left">
                <p className="truncate text-[9px] font-black uppercase leading-3 text-zinc-100">
                  {slot.item.name}
                </p>
              </div>
            ) : null}

            {isSingleSlot ? (
              statusLabel || quantityLabel ? (
                <span className="absolute bottom-1 right-1 bg-black/85 px-1 text-[8px] font-black text-orange-400">
                  {statusLabel || quantityLabel}
                </span>
              ) : null
            ) : statusLabel || quantityLabel ? (
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 text-[7px] font-black uppercase leading-3">
                {quantityLabel ? (
                  <span className="bg-black/70 px-1 text-orange-400">
                    {quantityLabel}
                  </span>
                ) : (
                  <span />
                )}
                {statusLabel ? (
                  <span className="truncate bg-black/70 px-1 text-zinc-500">
                    {statusLabel}
                  </span>
                ) : null}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
