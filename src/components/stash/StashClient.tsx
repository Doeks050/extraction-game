"use client";

import { useMemo, useState } from "react";
import { hydrateInventory } from "../../lib/items";
import type { InventorySlot, ItemCategory } from "../../types/items";
import { Panel } from "../ui/Panel";
import { StashCategoryTabs } from "./StashCategoryTabs";
import { StashInventoryGrid } from "./StashInventoryGrid";
import { StashItemDetailPanel } from "./StashItemDetailPanel";

type StashClientProps = {
  slots: InventorySlot[];
};

export function StashClient({ slots }: StashClientProps) {
  const hydratedSlots = useMemo(() => hydrateInventory(slots), [slots]);
  const [activeCategory, setActiveCategory] = useState<ItemCategory | "all">("all");
  const [selectedSlotId, setSelectedSlotId] = useState(
    hydratedSlots[0]?.slotId ?? "",
  );

  const filteredSlots = hydratedSlots.filter((slot) => {
    if (activeCategory === "all") {
      return true;
    }

    return slot.item.category === activeCategory;
  });

  const selectedSlot =
    hydratedSlots.find((slot) => slot.slotId === selectedSlotId) ??
    filteredSlots[0];

  function handleCategoryChange(category: ItemCategory | "all") {
    setActiveCategory(category);

    const nextSlot = hydratedSlots.find((slot) => {
      if (category === "all") {
        return true;
      }

      return slot.item.category === category;
    });

    setSelectedSlotId(nextSlot?.slotId ?? "");
  }

  return (
    <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-2">
      <StashCategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <Panel title="Inventory Grid" className="min-h-0 overflow-hidden p-2">
        {filteredSlots.length > 0 ? (
          <StashInventoryGrid
            slots={filteredSlots}
            selectedSlotId={selectedSlot?.slotId ?? ""}
            onSelectSlot={setSelectedSlotId}
          />
        ) : (
          <p className="text-xs font-bold uppercase text-zinc-500">
            No items in this category
          </p>
        )}
      </Panel>

      <StashItemDetailPanel slot={selectedSlot} />
    </div>
  );
}
