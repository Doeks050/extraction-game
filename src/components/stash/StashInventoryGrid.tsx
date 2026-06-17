import type { HydratedInventorySlot } from "../../lib/items";
import { formatCredits } from "../../lib/items";

const rarityClassNames = {
  common: "border-zinc-700 text-zinc-300",
  uncommon: "border-emerald-500/50 text-emerald-300",
  rare: "border-sky-500/50 text-sky-300",
  epic: "border-purple-500/50 text-purple-300",
  legendary: "border-orange-400/70 text-orange-300",
};

type StashInventoryGridProps = {
  slots: HydratedInventorySlot[];
  selectedSlotId: string;
  onSelectSlot: (slotId: string) => void;
};

export function StashInventoryGrid({
  slots,
  selectedSlotId,
  onSelectSlot,
}: StashInventoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.slotId;

        return (
          <button
            key={slot.slotId}
            type="button"
            onClick={() => onSelectSlot(slot.slotId)}
            className={[
              "relative h-20 border bg-black/60 p-1 text-left active:scale-[0.98]",
              rarityClassNames[slot.item.rarity],
              isSelected ? "ring-1 ring-orange-400" : "",
            ].join(" ")}
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
          </button>
        );
      })}
    </div>
  );
}
