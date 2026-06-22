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

const HOLD_DELAY_MS = 260;
const CELL_HEIGHT_PX = 60;

const rarityClassNames = {
  common: "border-zinc-700 text-zinc-300",
  uncommon: "border-emerald-500/50 text-emerald-300",
  rare: "border-sky-500/50 text-sky-300",
  epic: "border-purple-500/50 text-purple-300",
  legendary: "border-orange-400/70 text-orange-300",
};

type DragPreview = {
  slotId: string;
  column: number;
  row: number;
  isValid: boolean;
};

type StashInventoryGridProps = {
  slots: HydratedInventorySlot[];
  onSelectSlot: (slot: HydratedInventorySlot) => void;
  onMoveSlot: (slotId: string, column: number, row: number) => void;
};

function getWeaponImageClassName(slot: HydratedInventorySlot) {
  const weaponClass = getWeaponClassFromTags(slot.item.tags);

  if (weaponClass?.id === "pistol") {
    return "h-[120%] w-auto max-w-[120%] object-contain opacity-95";
  }

  if (weaponClass?.id === "assault_rifle") {
    return "h-[200%] w-[200%] max-h-none max-w-none object-contain opacity-95";
  }

  if (weaponClass?.id === "dmr") {
    return "h-[250%] w-[250%] max-h-none max-w-none object-contain opacity-95";
  }

  return "h-full w-full max-h-full max-w-full object-contain opacity-95";
}

export function StashInventoryGrid({ slots, onSelectSlot, onMoveSlot }: StashInventoryGridProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggedSlotIdRef = useRef<string | null>(null);
  const suppressClickRef = useRef(false);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const rowCount = getStashGridRowCount(slots);

  function clearHoldTimer() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function getPointerCell(clientX: number, clientY: number) {
    const grid = gridRef.current;

    if (!grid) {
      return null;
    }

    const rect = grid.getBoundingClientRect();
    const columnWidth = rect.width / STASH_GRID_COLUMNS;

    return {
      column: Math.max(0, Math.min(STASH_GRID_COLUMNS - 1, Math.floor((clientX - rect.left) / columnWidth))),
      row: Math.max(0, Math.floor((clientY - rect.top) / CELL_HEIGHT_PX)),
    };
  }

  function updateDragPreview(slotId: string, clientX: number, clientY: number) {
    const cell = getPointerCell(clientX, clientY);

    if (!cell) {
      return;
    }

    setDragPreview({
      slotId,
      column: cell.column,
      row: cell.row,
      isValid: canPlaceStashSlot(slots, slotId, cell.column, cell.row),
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>, slotId: string) {
    clearHoldTimer();
    suppressClickRef.current = false;

    holdTimerRef.current = setTimeout(() => {
      draggedSlotIdRef.current = slotId;
      suppressClickRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      updateDragPreview(slotId, event.clientX, event.clientY);
    }, HOLD_DELAY_MS);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const slotId = draggedSlotIdRef.current;

    if (!slotId) {
      return;
    }

    event.preventDefault();
    updateDragPreview(slotId, event.clientX, event.clientY);
  }

  function finishPointerInteraction() {
    clearHoldTimer();

    if (dragPreview?.isValid) {
      onMoveSlot(dragPreview.slotId, dragPreview.column, dragPreview.row);
    }

    draggedSlotIdRef.current = null;
    setDragPreview(null);
  }

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

      {slots.map((slot) => {
        if (!slot.gridPosition) {
          return null;
        }

        const size = getSlotGridSize(slot, slot.item);
        const isWeapon = slot.item.category === "weapon";
        const isDragging = dragPreview?.slotId === slot.slotId;
        const displayPosition = isDragging ? dragPreview : slot.gridPosition;

        return (
          <button
            key={slot.slotId}
            type="button"
            onPointerDown={(event) => handlePointerDown(event, slot.slotId)}
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
              isDragging ? (dragPreview?.isValid ? "border-emerald-400 opacity-80" : "border-red-500 opacity-80") : "",
            ].join(" ")}
            style={{
              gridColumn: `${displayPosition.column + 1} / span ${size.width}`,
              gridRow: `${displayPosition.row + 1} / span ${size.height}`,
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
                imageClassName="p-1 opacity-95"
              />
            )}

            <div className="absolute left-1.5 top-1.5 max-w-[70%] bg-black/70 px-1.5 py-0.5 text-left">
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
        );
      })}
    </div>
  );
}
