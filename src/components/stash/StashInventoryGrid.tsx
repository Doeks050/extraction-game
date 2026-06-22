"use client";

import { useRef, useState } from "react";
import { getWeaponCaliberFromTags } from "../../data/weapons/calibers";
import { getWeaponClassFromTags } from "../../data/weapons/weaponClasses";
import { formatCredits } from "../../lib/items";
import type { HydratedInventorySlot } from "../../lib/items";
import {
  canPlaceStashSlot,
  getSlotGridSize,
  getStashGridRowCount,
  STASH_GRID_COLUMNS,
} from "../../lib/stashGrid";
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
  anchorColumn: number;
  anchorRow: number;
  targetColumn: number;
  targetRow: number;
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
  onMoveSlot: (slotId: string, column: number, row: number) => void;
  onRotateSlot: (slotId: string) => boolean;
};

function getWeaponImageClassName(slot: HydratedInventorySlot) {
  const weaponClass = getWeaponClassFromTags(slot.item.tags);
  const rotationClass = slot.isRotated ? "rotate-90" : "";

  if (weaponClass?.id === "pistol") {
    return `h-[120%] w-auto max-w-[120%] object-contain opacity-95 ${rotationClass}`;
  }

  if (weaponClass?.id === "assault_rifle") {
    return `h-[200%] w-[200%] max-h-none max-w-none object-contain opacity-95 ${rotationClass}`;
  }

  if (weaponClass?.id === "dmr") {
    return `h-[250%] w-[250%] max-h-none max-w-none object-contain opacity-95 ${rotationClass}`;
  }

  return `h-full w-full max-h-full max-w-full object-contain opacity-95 ${rotationClass}`;
}

export function StashInventoryGrid({
  slots,
  onSelectSlot,
  onMoveSlot,
  onRotateSlot,
}: StashInventoryGridProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStateRef = useRef<PressState | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const rotateErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [rotateErrorSlotId, setRotateErrorSlotId] = useState<string | null>(null);
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

  function buildDragState(press: PressState, clientX: number, clientY: number): DragState | null {
    const metrics = getGridMetrics();

    if (!metrics) {
      return null;
    }

    const rawColumn = Math.floor((clientX - metrics.rect.left) / metrics.columnPitch);
    const rawRow = Math.floor((clientY - metrics.rect.top) / metrics.rowPitch);
    const targetColumn = Math.max(0, rawColumn - press.anchorColumn);
    const targetRow = Math.max(0, rawRow - press.anchorRow);

    return {
      slotId: press.slotId,
      startX: press.startX,
      startY: press.startY,
      currentX: clientX,
      currentY: clientY,
      anchorColumn: press.anchorColumn,
      anchorRow: press.anchorRow,
      targetColumn,
      targetRow,
      isValid: canPlaceStashSlot(slots, press.slotId, targetColumn, targetRow),
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

    if (activeDrag?.isValid) {
      onMoveSlot(activeDrag.slotId, activeDrag.targetColumn, activeDrag.targetRow);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pressStateRef.current = null;
    publishDragState(null);
  }

  function handleRotate(slotId: string) {
    const didRotate = onRotateSlot(slotId);

    if (didRotate) {
      setRotateErrorSlotId(null);
      return;
    }

    setRotateErrorSlotId(slotId);

    if (rotateErrorTimerRef.current) {
      clearTimeout(rotateErrorTimerRef.current);
    }

    rotateErrorTimerRef.current = setTimeout(() => {
      setRotateErrorSlotId(null);
    }, 1200);
  }

  const draggedSlot = dragState
    ? slots.find((slot) => slot.slotId === dragState.slotId)
    : undefined;
  const draggedSize = draggedSlot ? getSlotGridSize(draggedSlot, draggedSlot.item) : null;

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

      {dragState && draggedSize ? (
        <div
          className={[
            "pointer-events-none z-20 border-2 bg-black/35",
            dragState.isValid ? "border-emerald-400" : "border-red-500",
          ].join(" ")}
          style={{
            gridColumn: `${dragState.targetColumn + 1} / span ${draggedSize.width}`,
            gridRow: `${dragState.targetRow + 1} / span ${draggedSize.height}`,
          }}
        />
      ) : null}

      {slots.map((slot) => {
        if (!slot.gridPosition) {
          return null;
        }

        const size = getSlotGridSize(slot, slot.item);
        const isWeapon = slot.item.category === "weapon";
        const isDragging = dragState?.slotId === slot.slotId;
        const translateX = isDragging ? dragState.currentX - dragState.startX : 0;
        const translateY = isDragging ? dragState.currentY - dragState.startY : 0;
        const hasRotateError = rotateErrorSlotId === slot.slotId;

        return (
          <div
            key={slot.slotId}
            className="relative z-10"
            style={{
              gridColumn: `${slot.gridPosition.column + 1} / span ${size.width}`,
              gridRow: `${slot.gridPosition.row + 1} / span ${size.height}`,
              transform: isDragging
                ? `translate3d(${translateX}px, ${translateY}px, 0)`
                : undefined,
              willChange: isDragging ? "transform" : undefined,
              zIndex: isDragging ? 30 : 10,
            }}
          >
            <button
              type="button"
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
                "relative h-full w-full overflow-hidden border bg-black/80 p-1 text-left active:scale-[0.99]",
                rarityClassNames[slot.item.rarity],
                isDragging
                  ? `${dragState.isValid ? "border-emerald-400" : "border-red-500"} opacity-90 shadow-2xl`
                  : "",
                hasRotateError ? "border-red-500 ring-2 ring-inset ring-red-500" : "",
              ].join(" ")}
            >
              <div className="absolute inset-1 border border-zinc-900/80 bg-zinc-950/70" />

              {isWeapon ? (
                <div className="absolute inset-x-2 bottom-3 top-4 flex items-center justify-center overflow-hidden">
                  {slot.item.image ? (
                    <img
                      src={slot.item.image}
                      alt={slot.item.name}
                      draggable={false}
                      className={getWeaponImageClassName(slot)}
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
                  className="absolute inset-2 flex items-center justify-center"
                  imageClassName={slot.isRotated ? "rotate-90 p-1 opacity-95" : "p-1 opacity-95"}
                />
              )}

              <div className="absolute left-1.5 top-1.5 max-w-[62%] bg-black/70 px-1.5 py-0.5 text-left">
                <p className="truncate text-[9px] font-black uppercase leading-3 text-zinc-100">
                  {slot.item.name}
                </p>
              </div>

              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 text-[7px] font-black uppercase leading-3">
                <span className="bg-black/70 px-1 text-orange-400">
                  {slot.quantity > 1 ? `x${slot.quantity}` : ""}
                </span>
                <span className="truncate bg-black/70 px-1 text-zinc-500">
                  {isWeapon ? getWeaponCaliberFromTags(slot.item.tags) : formatCredits(slot.totalValue)}
                </span>
              </div>
            </button>

            {!isDragging ? (
              <button
                type="button"
                aria-label={`Rotate ${slot.item.name}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  handleRotate(slot.slotId);
                }}
                className="absolute right-1.5 top-1.5 z-40 flex h-6 w-6 items-center justify-center border border-zinc-700 bg-black/90 text-sm font-black text-orange-400 active:border-orange-400 active:bg-orange-400 active:text-black"
              >
                ↻
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
