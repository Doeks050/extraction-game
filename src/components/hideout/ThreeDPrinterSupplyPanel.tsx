"use client";

import { useState } from "react";
import { getItemById } from "../../lib/items";
import {
  getInventoryFilamentState,
  getPrinterUsbRecipeIds,
  isPrinterUsbItem,
  normalizePrinterFilamentSlot,
} from "../../lib/threeDPrinterSupplies";
import type { HideoutModule } from "../../types/game";
import type { InventorySlot } from "../../types/items";
import { ItemImage } from "../items/ItemImage";
import { Panel } from "../ui/Panel";

type ThreeDPrinterSupplyPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  onInsertFilament: (itemId: string) => void;
  onRemoveFilament: () => void;
  onInsertUsb: (itemId: string) => void;
  onRemoveUsb: () => void;
};

function getFallback(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function ThreeDPrinterSupplyPanel({
  module,
  stash,
  onInsertFilament,
  onRemoveFilament,
  onInsertUsb,
  onRemoveUsb,
}: ThreeDPrinterSupplyPanelProps) {
  const [isFilamentSelectorOpen, setIsFilamentSelectorOpen] = useState(false);
  const [isUsbSelectorOpen, setIsUsbSelectorOpen] = useState(false);
  const filamentSlot = normalizePrinterFilamentSlot(
    module.printerFilamentSlot,
  );
  const filamentItem = filamentSlot
    ? getItemById(filamentSlot.itemId)
    : undefined;
  const filamentRatio = filamentSlot
    ? filamentSlot.filamentPrintsRemaining /
      filamentSlot.filamentPrintCapacity
    : 0;
  const availableFilaments = stash.flatMap((slot) => {
    const filamentState = getInventoryFilamentState(
      slot.itemId,
      slot.filamentPrintsRemaining,
      slot.filamentRemainingUnits,
    );
    const item = filamentState ? getItemById(filamentState.itemId) : undefined;

    return filamentState && item
      ? [{ slot, item, filamentState }]
      : [];
  });

  const usbItem = module.printerUsbItemId
    ? getItemById(module.printerUsbItemId)
    : undefined;
  const usbRecipeCount = getPrinterUsbRecipeIds(
    module.printerUsbItemId,
  ).length;
  const availableUsbItems = stash.flatMap((slot) => {
    const item = isPrinterUsbItem(slot.itemId)
      ? getItemById(slot.itemId)
      : undefined;

    return item ? [{ slot, item }] : [];
  });
  const isBusy = Boolean(module.craftingRecipeId || module.craftingEndsAt);

  function handleOpenFilamentSelector() {
    setIsUsbSelectorOpen(false);
    setIsFilamentSelectorOpen(true);
  }

  function handleOpenUsbSelector() {
    setIsFilamentSelectorOpen(false);
    setIsUsbSelectorOpen(true);
  }

  function handleSelectFilament(itemId: string) {
    onInsertFilament(itemId);
    setIsFilamentSelectorOpen(false);
  }

  function handleSelectUsb(itemId: string) {
    onInsertUsb(itemId);
    setIsUsbSelectorOpen(false);
  }

  return (
    <Panel
      title="Printer Supplies"
      titleClassName="text-orange-300"
      className="p-2"
    >
      <div className="grid grid-cols-2 gap-2">
        <div
          className={`min-h-32 border p-2 ${
            filamentSlot
              ? "border-orange-500/55 bg-orange-500/8"
              : "border-zinc-800 bg-black/45"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-300">
              Filament Slot
            </p>
            <p className="text-[7px] font-black uppercase text-zinc-600">
              Stash {availableFilaments.length}
            </p>
          </div>

          {filamentSlot && filamentItem ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={onRemoveFilament}
              className="mt-2 grid w-full grid-cols-[48px_1fr] items-center gap-2 text-left disabled:cursor-not-allowed disabled:opacity-65"
            >
              <ItemImage
                src={filamentItem.image}
                alt={filamentItem.name}
                fallback={getFallback(filamentItem.name)}
                className="h-14 w-12"
                imageClassName="p-0.5"
              />

              <div className="min-w-0">
                <p className="truncate text-[8px] font-black uppercase text-zinc-200">
                  {filamentItem.name}
                </p>
                <p className="mt-1 text-sm font-black text-orange-300">
                  {filamentSlot.filamentPrintsRemaining} / {filamentSlot.filamentPrintCapacity}
                </p>
                <p className="text-[7px] font-black uppercase text-zinc-500">
                  prints remaining
                </p>

                <div className="mt-1.5 h-2 border border-zinc-800 bg-black">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${filamentRatio * 100}%` }}
                  />
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              disabled={isBusy || availableFilaments.length === 0}
              onClick={handleOpenFilamentSelector}
              className="mt-2 flex h-20 w-full items-center justify-center border border-dashed border-zinc-800 bg-black/35 text-center active:border-orange-500 disabled:cursor-not-allowed disabled:opacity-65"
            >
              <div>
                <p className="text-[8px] font-black uppercase text-zinc-400">
                  Empty
                </p>
                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  {availableFilaments.length > 0
                    ? "Tap to choose filament"
                    : "No filament in stash"}
                </p>
              </div>
            </button>
          )}
        </div>

        <div
          className={`min-h-32 border p-2 ${
            usbItem
              ? "border-cyan-500/55 bg-cyan-500/8"
              : "border-zinc-800 bg-black/45"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-cyan-300">
              Recipe USB
            </p>
            <p className="text-[7px] font-black uppercase text-zinc-600">
              Stash {availableUsbItems.length}
            </p>
          </div>

          {usbItem ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={onRemoveUsb}
              className="mt-2 grid w-full grid-cols-[48px_1fr] items-center gap-2 text-left disabled:cursor-not-allowed disabled:opacity-65"
            >
              <ItemImage
                src={usbItem.image}
                alt={usbItem.name}
                fallback={getFallback(usbItem.name)}
                className="h-14 w-12"
                imageClassName="p-0.5"
              />

              <div className="min-w-0">
                <p className="truncate text-[8px] font-black uppercase text-zinc-200">
                  {usbItem.name}
                </p>
                <p className="mt-1 text-[8px] font-black uppercase text-cyan-300">
                  {usbRecipeCount} recipes unlocked
                </p>
                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  {isBusy ? "USB in use" : "Tap to remove"}
                </p>
              </div>
            </button>
          ) : (
            <button
              type="button"
              disabled={isBusy || availableUsbItems.length === 0}
              onClick={handleOpenUsbSelector}
              className="mt-2 flex h-20 w-full items-center justify-center border border-dashed border-zinc-800 bg-black/35 text-center active:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-65"
            >
              <div>
                <p className="text-[8px] font-black uppercase text-zinc-400">
                  Empty
                </p>
                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  {availableUsbItems.length > 0
                    ? "Tap to choose recipe USB"
                    : "No recipe USB in stash"}
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {isFilamentSelectorOpen && !filamentSlot ? (
        <div className="mt-2 border border-orange-500/45 bg-zinc-950 p-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-orange-300">
                Choose Filament
              </p>
              <p className="mt-0.5 text-[7px] font-bold uppercase text-zinc-600">
                Select one spool from your stash
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFilamentSelectorOpen(false)}
              className="h-7 border border-zinc-800 bg-black px-2 text-[7px] font-black uppercase text-zinc-400 active:border-orange-500 active:text-orange-300"
            >
              Cancel
            </button>
          </div>

          <div className="mt-2 grid gap-1.5">
            {availableFilaments.map(({ slot, item, filamentState }) => (
              <button
                key={slot.slotId}
                type="button"
                onClick={() => handleSelectFilament(slot.itemId)}
                className="grid min-h-12 grid-cols-[42px_1fr_auto] items-center gap-2 border border-zinc-800 bg-black/55 p-1.5 text-left active:border-orange-500"
              >
                <ItemImage
                  src={item.image}
                  alt={item.name}
                  fallback={getFallback(item.name)}
                  className="h-9 w-10"
                  imageClassName="p-0.5"
                />

                <div className="min-w-0">
                  <p className="truncate text-[8px] font-black uppercase text-zinc-200">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[7px] font-bold uppercase text-zinc-600">
                    {item.rarity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-orange-300">
                    {filamentState.filamentPrintsRemaining}
                  </p>
                  <p className="text-[6px] font-black uppercase text-zinc-600">
                    prints
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {isUsbSelectorOpen && !usbItem ? (
        <div className="mt-2 border border-cyan-500/45 bg-zinc-950 p-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-cyan-300">
                Choose Recipe USB
              </p>
              <p className="mt-0.5 text-[7px] font-bold uppercase text-zinc-600">
                Select one USB stick from your stash
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsUsbSelectorOpen(false)}
              className="h-7 border border-zinc-800 bg-black px-2 text-[7px] font-black uppercase text-zinc-400 active:border-cyan-500 active:text-cyan-300"
            >
              Cancel
            </button>
          </div>

          <div className="mt-2 grid gap-1.5">
            {availableUsbItems.map(({ slot, item }) => (
              <button
                key={slot.slotId}
                type="button"
                onClick={() => handleSelectUsb(item.id)}
                className="grid min-h-12 grid-cols-[42px_1fr_auto] items-center gap-2 border border-zinc-800 bg-black/55 p-1.5 text-left active:border-cyan-500"
              >
                <ItemImage
                  src={item.image}
                  alt={item.name}
                  fallback={getFallback(item.name)}
                  className="h-9 w-10"
                  imageClassName="p-0.5"
                />

                <div className="min-w-0">
                  <p className="truncate text-[8px] font-black uppercase text-zinc-200">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[7px] font-bold uppercase text-zinc-600">
                    {item.rarity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-cyan-300">
                    {item.printerRecipeIds?.length ?? 0}
                  </p>
                  <p className="text-[6px] font-black uppercase text-zinc-600">
                    recipes
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
