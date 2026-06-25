"use client";

import {
  getFilamentPercentage,
  getPrinterUsbRecipeIds,
  isPrinterUsbItem,
  normalizePrinterFilamentSlot,
} from "../../lib/threeDPrinterSupplies";
import { getItemById } from "../../lib/items";
import type { HideoutModule } from "../../types/game";
import type { InventorySlot } from "../../types/items";
import { ItemImage } from "../items/ItemImage";
import { Panel } from "../ui/Panel";

type ThreeDPrinterSupplyPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  onInsertFilament: () => void;
  onRemoveFilament: () => void;
  onInsertUsb: () => void;
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
  const filamentPercentage = filamentSlot
    ? getFilamentPercentage(
        filamentSlot.filamentRemainingUnits,
        filamentSlot.filamentCapacityUnits,
      )
    : 0;
  const filamentInStash = stash.filter(
    (slot) => Boolean(getItemById(slot.itemId)?.filamentCapacityUnits),
  ).length;

  const usbItem = module.printerUsbItemId
    ? getItemById(module.printerUsbItemId)
    : undefined;
  const usbRecipeCount = getPrinterUsbRecipeIds(
    module.printerUsbItemId,
  ).length;
  const usbInStash = stash.filter((slot) => isPrinterUsbItem(slot.itemId)).length;
  const isBusy = Boolean(module.craftingRecipeId || module.craftingEndsAt);

  return (
    <Panel
      title="Printer Supplies"
      titleClassName="text-orange-300"
      className="p-2"
    >
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isBusy || (!filamentSlot && filamentInStash === 0)}
          onClick={filamentSlot ? onRemoveFilament : onInsertFilament}
          className={`min-h-28 border p-2 text-left transition active:scale-[0.98] ${
            filamentSlot
              ? "border-orange-500/55 bg-orange-500/8"
              : "border-zinc-800 bg-black/45"
          } ${
            isBusy || (!filamentSlot && filamentInStash === 0)
              ? "cursor-not-allowed opacity-65"
              : "cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-300">
              Filament Slot
            </p>
            <p className="text-[7px] font-black uppercase text-zinc-600">
              Stash {filamentInStash}
            </p>
          </div>

          {filamentSlot && filamentItem ? (
            <div className="mt-2 grid grid-cols-[48px_1fr] items-center gap-2">
              <ItemImage
                src={filamentItem.image}
                alt={filamentItem.name}
                fallback={getFallback(filamentItem.name)}
                className="h-14 w-12"
                imageClassName="p-0.5"
              />

              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[8px] font-black uppercase text-zinc-200">
                    {filamentItem.name}
                  </p>
                  <p className="shrink-0 text-sm font-black text-orange-300">
                    {filamentPercentage}%
                  </p>
                </div>

                <div className="mt-1.5 h-2 border border-zinc-800 bg-black">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${filamentPercentage}%` }}
                  />
                </div>

                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  {isBusy ? "Printing" : "Tap to remove"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex h-16 items-center justify-center border border-dashed border-zinc-800 bg-black/35 text-center">
              <div>
                <p className="text-[8px] font-black uppercase text-zinc-400">
                  Empty
                </p>
                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  {filamentInStash > 0
                    ? "Tap to insert spool"
                    : "No filament in stash"}
                </p>
              </div>
            </div>
          )}
        </button>

        <button
          type="button"
          disabled={isBusy || (!usbItem && usbInStash === 0)}
          onClick={usbItem ? onRemoveUsb : onInsertUsb}
          className={`min-h-28 border p-2 text-left transition active:scale-[0.98] ${
            usbItem
              ? "border-cyan-500/55 bg-cyan-500/8"
              : "border-zinc-800 bg-black/45"
          } ${
            isBusy || (!usbItem && usbInStash === 0)
              ? "cursor-not-allowed opacity-65"
              : "cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-cyan-300">
              Recipe USB
            </p>
            <p className="text-[7px] font-black uppercase text-zinc-600">
              Stash {usbInStash}
            </p>
          </div>

          {usbItem ? (
            <div className="mt-2 grid grid-cols-[48px_1fr] items-center gap-2">
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
                  {usbRecipeCount} rare recipe{usbRecipeCount === 1 ? "" : "s"}
                </p>
                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  {isBusy ? "USB in use" : "Tap to remove"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex h-16 items-center justify-center border border-dashed border-zinc-800 bg-black/35 text-center">
              <div>
                <p className="text-[8px] font-black uppercase text-zinc-400">
                  Empty
                </p>
                <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                  {usbInStash > 0
                    ? "Tap to insert recipe USB"
                    : "No recipe USB in stash"}
                </p>
              </div>
            </div>
          )}
        </button>
      </div>
    </Panel>
  );
}
