"use client";

import { useState } from "react";
import { getThreeDPrinterRecipeById } from "../../data/hideout/threeDPrinterRecipes";
import { getItemById, hydrateInventory, type HydratedInventorySlot } from "../../lib/items";
import {
  layoutUsbCaseSlots,
  USB_CASE_CAPACITY,
  USB_CASE_COLUMNS,
  USB_CASE_ROWS,
} from "../../lib/usbCaseStorage";
import { ItemImage } from "../items/ItemImage";
import { Panel } from "../ui/Panel";

type UsbCasePanelProps = {
  caseSlot: HydratedInventorySlot;
  availableUsbSlots: HydratedInventorySlot[];
  onStoreUsb: (usbSlotId: string) => void;
  onRemoveUsb: (usbSlotId: string) => void;
  onBack: () => void;
};

export function UsbCasePanel({
  caseSlot,
  availableUsbSlots,
  onStoreUsb,
  onRemoveUsb,
  onBack,
}: UsbCasePanelProps) {
  const [selectedUsbSlotId, setSelectedUsbSlotId] = useState<string | null>(null);
  const containedSlots = hydrateInventory(
    layoutUsbCaseSlots(caseSlot.containedSlots ?? []),
  );
  const selectedUsb = selectedUsbSlotId
    ? containedSlots.find((slot) => slot.slotId === selectedUsbSlotId) ?? null
    : null;
  const selectedRecipes = (selectedUsb?.item.printerRecipeIds ?? []).map(
    (recipeId) => {
      const recipe = getThreeDPrinterRecipeById(recipeId);
      const outputItem = recipe ? getItemById(recipe.output.itemId) : undefined;

      return {
        id: recipeId,
        name: recipe?.name ?? recipeId.replaceAll("_", " "),
        outputName: outputItem?.name,
        outputQuantity: recipe?.output.quantity,
      };
    },
  );

  function handleMoveSelectedUsbToStash() {
    if (!selectedUsb) {
      return;
    }

    onRemoveUsb(selectedUsb.slotId);
    setSelectedUsbSlotId(null);
  }

  return (
    <div className="grid min-h-0 gap-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
            USB Storage Case
          </p>
          <p className="mt-0.5 text-[7px] font-black uppercase text-zinc-600">
            {containedSlots.length} / {USB_CASE_CAPACITY} USB sticks stored
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="h-8 border border-zinc-800 bg-black/60 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
        >
          Back
        </button>
      </div>

      <Panel title="Internal USB Grid" titleClassName="text-cyan-300" className="p-2">
        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${USB_CASE_COLUMNS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${USB_CASE_ROWS}, 72px)`,
          }}
        >
          {Array.from({ length: USB_CASE_CAPACITY }, (_, index) => (
            <div
              key={`usb-case-cell-${index}`}
              className="border border-zinc-900 bg-black/35"
              style={{
                gridColumnStart: (index % USB_CASE_COLUMNS) + 1,
                gridRowStart: Math.floor(index / USB_CASE_COLUMNS) + 1,
              }}
            />
          ))}

          {containedSlots.map((slot) => {
            if (!slot.gridPosition) {
              return null;
            }

            const isSelected = selectedUsbSlotId === slot.slotId;

            return (
              <button
                key={slot.slotId}
                type="button"
                title={`Inspect ${slot.item.name}`}
                onClick={() => setSelectedUsbSlotId(slot.slotId)}
                className={`relative z-10 overflow-hidden border p-1 active:scale-[0.98] ${
                  isSelected
                    ? "border-orange-400 bg-orange-500/15 ring-1 ring-orange-400"
                    : "border-cyan-500/55 bg-cyan-500/10"
                }`}
                style={{
                  gridColumnStart: slot.gridPosition.column + 1,
                  gridRowStart: slot.gridPosition.row + 1,
                }}
              >
                <ItemImage
                  src={slot.item.image}
                  alt={slot.item.name}
                  fallback={slot.item.name.slice(0, 2)}
                  className="absolute inset-1"
                  imageClassName="p-1 opacity-95"
                />
                <span className="absolute inset-x-1 bottom-1 truncate bg-black/85 px-1 text-[6px] font-black uppercase text-cyan-200">
                  {slot.item.name}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-center text-[7px] font-black uppercase text-zinc-600">
          Tap a stored USB to inspect its recipes
        </p>
      </Panel>

      {selectedUsb ? (
        <Panel title="USB Contents" titleClassName="text-orange-300" className="p-2">
          <div className="flex items-start justify-between gap-2 border border-zinc-800 bg-black/45 p-2">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-black uppercase text-zinc-100">
                {selectedUsb.item.name}
              </p>
              <p className="mt-0.5 text-[7px] font-black uppercase text-cyan-300">
                {selectedRecipes.length} recipe{selectedRecipes.length === 1 ? "" : "s"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedUsbSlotId(null)}
              className="h-7 shrink-0 border border-zinc-800 bg-black px-2 text-[7px] font-black uppercase text-zinc-400 active:border-orange-500 active:text-orange-300"
            >
              Close
            </button>
          </div>

          {selectedRecipes.length > 0 ? (
            <div className="mt-2 grid gap-1.5">
              {selectedRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="grid grid-cols-[22px_1fr_auto] items-center gap-2 border border-zinc-800 bg-black/55 px-2 py-1.5"
                >
                  <span className="flex h-5 w-5 items-center justify-center border border-cyan-500/40 bg-cyan-500/10 text-[7px] font-black text-cyan-300">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-[8px] font-black uppercase text-zinc-200">
                      {recipe.name}
                    </p>
                    {recipe.outputName ? (
                      <p className="truncate text-[6px] font-bold uppercase text-zinc-600">
                        Output: {recipe.outputName}
                      </p>
                    ) : null}
                  </div>

                  {recipe.outputQuantity ? (
                    <span className="text-[8px] font-black text-orange-300">
                      x{recipe.outputQuantity}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 border border-zinc-800 bg-black/55 py-3 text-center text-[8px] font-black uppercase text-zinc-600">
              No recipes stored on this USB
            </p>
          )}

          <button
            type="button"
            onClick={handleMoveSelectedUsbToStash}
            className="mt-2 h-9 w-full border border-orange-500/55 bg-orange-500/10 text-[8px] font-black uppercase tracking-[0.14em] text-orange-300 active:bg-orange-500/20"
          >
            Move USB to Main Stash
          </button>
        </Panel>
      ) : null}

      <Panel title="USB Sticks in Stash" titleClassName="text-orange-300" className="p-2">
        {availableUsbSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {availableUsbSlots.map((slot) => (
              <button
                key={slot.slotId}
                type="button"
                disabled={containedSlots.length >= USB_CASE_CAPACITY}
                onClick={() => onStoreUsb(slot.slotId)}
                className="min-h-16 border border-zinc-800 bg-black/55 p-1 text-center active:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <p className="truncate text-[7px] font-black uppercase text-zinc-200">
                  {slot.item.name}
                </p>
                <p className="mt-1 text-[6px] font-black uppercase text-cyan-300">
                  {slot.item.printerRecipeIds?.length ?? 0} recipes
                </p>
                <p className="mt-1 text-[6px] font-bold uppercase text-zinc-600">
                  Tap to store
                </p>
              </button>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-[8px] font-black uppercase text-zinc-600">
            No USB sticks in main stash
          </p>
        )}
      </Panel>
    </div>
  );
}
