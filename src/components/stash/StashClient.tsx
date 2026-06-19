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
};

export function StashClient({ slots }: StashClientProps) {
  const hydratedSlots = useMemo(() => hydrateInventory(slots), [slots]);
  const [selectedWeaponSlot, setSelectedWeaponSlot] = useState<HydratedInventorySlot | null>(null);

  function handleSelectSlot(slot: HydratedInventorySlot) {
    if (slot.item.category !== "weapon") {
      return;
    }

    setSelectedWeaponSlot(slot);
  }

  return (
    <Panel
      title={selectedWeaponSlot ? "Weapon Detail" : "Inventory Grid"}
      className="min-h-0 overflow-hidden p-2"
    >
      {selectedWeaponSlot ? (
        <WeaponDetailPanel
          slot={selectedWeaponSlot}
          onBack={() => setSelectedWeaponSlot(null)}
        />
      ) : hydratedSlots.length > 0 ? (
        <div className="h-full overflow-y-auto">
          <StashInventoryGrid slots={hydratedSlots} onSelectSlot={handleSelectSlot} />
        </div>
      ) : (
        <p className="text-xs font-bold uppercase text-zinc-500">No items in stash</p>
      )}
    </Panel>
  );
}
