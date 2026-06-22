"use client";

import { useMemo, useState } from "react";
import { hydrateInventory } from "../../lib/items";
import type { HydratedInventorySlot } from "../../lib/items";
import type { InventorySlot } from "../../types/items";
import { Panel } from "../ui/Panel";
import { StashInventoryGrid } from "./StashInventoryGrid";
import { StashItemDetailPanel } from "./StashItemDetailPanel";
import { WeaponDetailPanel } from "./WeaponDetailPanel";

type StashClientProps = {
  slots: InventorySlot[];
  onMoveSlot: (slotId: string, column: number, row: number) => void;
};

export function StashClient({ slots, onMoveSlot }: StashClientProps) {
  const hydratedSlots = useMemo(() => hydrateInventory(slots), [slots]);
  const [selectedSlot, setSelectedSlot] = useState<HydratedInventorySlot | null>(null);

  return (
    <Panel className="min-h-0 overflow-hidden p-2">
      {selectedSlot ? (
        selectedSlot.item.category === "weapon" ? (
          <WeaponDetailPanel
            slot={selectedSlot}
            onBack={() => setSelectedSlot(null)}
          />
        ) : (
          <StashItemDetailPanel
            slot={selectedSlot}
            onBack={() => setSelectedSlot(null)}
          />
        )
      ) : hydratedSlots.length > 0 ? (
        <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Inventory Grid
            </p>
            <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-zinc-600">
              Tap for info · Hold and drag to move
            </p>
          </div>

          <div className="min-h-0 overflow-y-auto">
            <StashInventoryGrid
              slots={hydratedSlots}
              onSelectSlot={setSelectedSlot}
              onMoveSlot={onMoveSlot}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs font-bold uppercase text-zinc-500">No items in stash</p>
      )}
    </Panel>
  );
}
