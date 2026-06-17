import { formatCredits, hydrateInventory } from "../../lib/items";
import type { InventorySlot } from "../../types/items";
import { Panel } from "../ui/Panel";

type StashItemGridProps = {
  slots: InventorySlot[];
};

const rarityClassNames = {
  common: "border-zinc-700 text-zinc-300",
  uncommon: "border-emerald-500/50 text-emerald-300",
  rare: "border-sky-500/50 text-sky-300",
  epic: "border-purple-500/50 text-purple-300",
  legendary: "border-orange-400/70 text-orange-300",
};

export function StashItemGrid({ slots }: StashItemGridProps) {
  const hydratedSlots = hydrateInventory(slots);

  return (
    <Panel title="Inventory Grid" className="min-h-0 p-2">
      <div className="grid grid-cols-4 gap-1.5">
        {hydratedSlots.map((slot) => (
          <div
            key={slot.slotId}
            className={`relative h-20 border bg-black/60 p-1 ${rarityClassNames[slot.item.rarity]}`}
          >
            <div className="flex h-8 items-center justify-center border border-zinc-900 bg-zinc-950 text-[16px] font-black uppercase text-zinc-500">
              {slot.item.name.slice(0, 2)}
            </div>

            <p className="mt-1 line-clamp-2 text-[8px] font-black uppercase leading-tight text-zinc-200">
              {slot.item.name}
            </p>

            <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between gap-1 text-[8px] font-black uppercase">
              <span className="text-orange-400">x{slot.quantity}</span>
              <span className="text-zinc-600">{formatCredits(slot.totalValue)}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
