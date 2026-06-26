"use client";

import { useState } from "react";
import { hydrateInventory, type HydratedInventorySlot } from "../../lib/items";
import {
  layoutUsbCaseSlots,
  USB_CASE_CAPACITY,
  USB_CASE_COLUMNS,
  USB_CASE_ROWS,
} from "../../lib/usbCaseStorage";
import { ItemImage } from "../items/ItemImage";
import { Panel } from "../ui/Panel";
import { UsbBlueprintDetailPanel } from "./UsbBlueprintDetailPanel";

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

  function handleMoveSelectedUsbToStash() {
    if (!selectedUsb) {
      return;
    }

    onRemoveUsb(selectedUsb.slotId);
    setSelectedUsbSlotId(null);
  }

  return (
    <div className="relative grid h-full min-h-0 content-start gap-2">
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

            return (
              <button
                key={slot.slotId}
                type="button"
                title={`Inspect ${slot.item.name}`}
                onClick={() => setSelectedUsbSlotId(slot.slotId)}
                className="relative z-10 overflow-hidden border border-cyan-500/55 bg-cyan-500/10 p-1 active:scale-[0.98] active:border-orange-400"
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
          Tap a stored USB to view its blueprint data
        </p>
      </Panel>

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
                  {slot.item.printerRecipeIds?.length ?? 0} blueprints
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

      {selectedUsb ? (
        <UsbBlueprintDetailPanel
          slot={selectedUsb}
          onClose={() => setSelectedUsbSlotId(null)}
          onMoveToStash={handleMoveSelectedUsbToStash}
        />
      ) : null}
    </div>
  );
}
