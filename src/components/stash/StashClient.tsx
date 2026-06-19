"use client";

import { useMemo } from "react";
import { hydrateInventory } from "../../lib/items";
import type { InventorySlot } from "../../types/items";
import { Panel } from "../ui/Panel";
import { StashInventoryGrid } from "./StashInventoryGrid";

type StashClientProps = {
  slots: InventorySlot[];
};

export function StashClient({ slots }: StashClientProps) {
  const hydratedSlots = useMemo(() => hydrateInventory(slots), [slots]);

  return (
    <Panel title="Inventory Grid" className="min-h-0 overflow-y-auto p-2">
      {hydratedSlots.length > 0 ? (
        <StashInventoryGrid slots={hydratedSlots} />
      ) : (
        <p className="text-xs font-bold uppercase text-zinc-500">No items in stash</p>
      )}
    </Panel>
  );
}
