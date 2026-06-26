"use client";

import { useMemo, useState } from "react";
import { hydrateInventory } from "../../lib/items";
import { isPrinterUsbItem } from "../../lib/threeDPrinterSupplies";
import type { InventorySlot } from "../../types/items";
import { Panel } from "../ui/Panel";
import { StashInventoryGrid } from "./StashInventoryGrid";
import { StashItemDetailPanel } from "./StashItemDetailPanel";
import { UsbCasePanel } from "./UsbCasePanel";
import { WeaponDetailPanel } from "./WeaponDetailPanel";

type StashClientProps = {
  slots: InventorySlot[];
  onMoveSlot: (
    slotId: string,
    column: number,
    row: number,
    isRotated: boolean,
  ) => void;
  onStoreUsb: (caseSlotId: string, usbSlotId: string) => void;
  onRemoveUsb: (caseSlotId: string, usbSlotId: string) => void;
};

export function StashClient({
  slots,
  onMoveSlot,
  onStoreUsb,
  onRemoveUsb,
}: StashClientProps) {
  const hydratedSlots = useMemo(() => hydrateInventory(slots), [slots]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const selectedSlot = selectedSlotId
    ? hydratedSlots.find((slot) => slot.slotId === selectedSlotId) ?? null
    : null;
  const availableUsbSlots = hydratedSlots.filter((slot) =>
    isPrinterUsbItem(slot.itemId),
  );

  return (
    <Panel className="min-h-0 overflow-hidden p-2">
      {selectedSlot?.item.id === "usb_storage_case" ? (
        <UsbCasePanel
          caseSlot={selectedSlot}
          availableUsbSlots={availableUsbSlots}
          onStoreUsb={(usbSlotId) => onStoreUsb(selectedSlot.slotId, usbSlotId)}
          onRemoveUsb={(usbSlotId) => onRemoveUsb(selectedSlot.slotId, usbSlotId)}
          onBack={() => setSelectedSlotId(null)}
        />
      ) : selectedSlot ? (
        selectedSlot.item.category === "weapon" ? (
          <WeaponDetailPanel
            slot={selectedSlot}
            onBack={() => setSelectedSlotId(null)}
          />
        ) : (
          <StashItemDetailPanel
            slot={selectedSlot}
            onBack={() => setSelectedSlotId(null)}
          />
        )
      ) : hydratedSlots.length > 0 ? (
        <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Inventory Grid
            </p>
            <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-zinc-600">
              Tap for info · Hold and drag to move · Drag USB onto USB Case to store
            </p>
          </div>

          <div className="min-h-0 overflow-y-auto">
            <StashInventoryGrid
              slots={hydratedSlots}
              onSelectSlot={(slot) => setSelectedSlotId(slot.slotId)}
              onMoveSlot={onMoveSlot}
              onStoreUsb={onStoreUsb}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs font-bold uppercase text-zinc-500">No items in stash</p>
      )}
    </Panel>
  );
}
