"use client";

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
          ) : availableFilaments.length > 0 ? (
            <div className="mt-2 grid gap-1">
              {availableFilaments.map(({ slot, item, filamentState }) => (
                <button
                  key={slot.slotId}
                  type="button"
                  disabled={isBusy}
                  onClick={() => onInsertFilament(slot.itemId)}
                  className="flex min-h-8 items-center justify-between gap-2 border border-zinc-800 bg-black/55 px-2 text-left active:border-orange-500 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  <span className="truncate text-[7px] font-black uppercase text-zinc-300">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-[7px] font-black uppercase text-orange-300">
                    {filamentState.filamentPrintsRemaining} prints
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-2 flex h-20 items-center justify-center border border-dashed border-zinc-800 bg-black/35 text-center">
              <div>
                <p className="text-[8px] font-black uppercase text-zinc-400">
                  Empty
                </p>
                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  No filament in stash
                </p>
              </div>
            </div>
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
          ) : availableUsbItems.length > 0 ? (
            <div className="mt-2 grid gap-1">
              {availableUsbItems.map(({ slot, item }) => (
                <button
                  key={slot.slotId}
                  type="button"
                  disabled={isBusy}
                  onClick={() => onInsertUsb(item.id)}
                  className="flex min-h-8 items-center justify-between gap-2 border border-zinc-800 bg-black/55 px-2 text-left active:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  <span className="truncate text-[7px] font-black uppercase text-zinc-300">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-[7px] font-black uppercase text-cyan-300">
                    {item.printerRecipeIds?.length ?? 0} recipes
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-2 flex h-20 items-center justify-center border border-dashed border-zinc-800 bg-black/35 text-center">
              <div>
                <p className="text-[8px] font-black uppercase text-zinc-400">
                  Empty
                </p>
                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  No recipe USB in stash
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
