"use client";

import { useMemo, useState } from "react";
import { hydrateInventory } from "../../lib/items";
import type { HydratedInventorySlot } from "../../lib/items";
import type { InventorySlot } from "../../types/items";
import { Panel } from "../ui/Panel";
import { StashInventoryGrid } from "./StashInventoryGrid";
import { WeaponDetailPanel } from "./WeaponDetailPanel";

type StashClientProps = {
  slots: InventorySlot[];
  onMoveSlot: (sourceSlotId: string, targetSlotId: string) => void;
};

export function StashClient({ slots, onMoveSlot }: StashClientProps) {
  const hydratedSlots = useMemo(() => hydrateInventory(slots), [slots]);
  const [selectedWeaponSlot, setSelectedWeaponSlot] = useState<HydratedInventorySlot | null>(null);
  const [isMoveMode, setIsMoveMode] = useState(false);
  const [selectedMoveSlotId, setSelectedMoveSlotId] = useState<string | null>(null);

  function handleSelectSlot(slot: HydratedInventorySlot) {
    if (isMoveMode) {
      if (!selectedMoveSlotId) {
        setSelectedMoveSlotId(slot.slotId);
        return;
      }

      if (selectedMoveSlotId === slot.slotId) {
        setSelectedMoveSlotId(null);
        return;
      }

      onMoveSlot(selectedMoveSlotId, slot.slotId);
      setSelectedMoveSlotId(null);
      return;
    }

    if (slot.item.category !== "weapon") {
      return;
    }

    setSelectedWeaponSlot(slot);
  }

  function toggleMoveMode() {
    setIsMoveMode((current) => !current);
    setSelectedMoveSlotId(null);
    setSelectedWeaponSlot(null);
  }

  return (
    <Panel className="min-h-0 overflow-hidden p-2">
      {selectedWeaponSlot ? (
        <WeaponDetailPanel
          slot={selectedWeaponSlot}
          onBack={() => setSelectedWeaponSlot(null)}
        />
      ) : (
        <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Inventory Grid
              </p>
              {isMoveMode ? (
                <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-orange-400">
                  {selectedMoveSlotId ? "Select destination item" : "Select item to move"}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={toggleMoveMode}
              className={[
                "h-7 border px-3 text-[8px] font-black uppercase tracking-[0.14em]",
                isMoveMode
                  ? "border-orange-400 bg-orange-400 text-black"
                  : "border-zinc-700 bg-black/60 text-zinc-300 active:border-orange-400",
              ].join(" ")}
            >
              {isMoveMode ? "Done" : "Move"}
            </button>
          </div>

          {hydratedSlots.length > 0 ? (
            <div className="min-h-0 overflow-y-auto">
              <StashInventoryGrid
                slots={hydratedSlots}
                onSelectSlot={handleSelectSlot}
                isMoveMode={isMoveMode}
                selectedMoveSlotId={selectedMoveSlotId}
              />
            </div>
          ) : (
            <p className="text-xs font-bold uppercase text-zinc-500">No items in stash</p>
          )}
        </div>
      )}
    </Panel>
  );
}
