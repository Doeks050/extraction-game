import { ItemImage } from "../items/ItemImage";
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
    <div className="grid auto-rows-[3.5rem] grid-cols-6 gap-1.5">
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.slotId;
        const { width, height } = slot.item.gridSize;
        const isLarge = width > 1 || height > 1;

        return (
          <button
            key={slot.slotId}
            type="button"
            onClick={() => onSelectSlot(slot.slotId)}
            style={{
              gridColumn: `span ${width} / span ${width}`,
              gridRow: `span ${height} / span ${height}`,
            }}
            className={[
              "relative overflow-hidden border bg-black/60 p-1 text-left active:scale-[0.98]",
              rarityClassNames[slot.item.rarity],
              isSelected ? "ring-1 ring-orange-400" : "",
            ].join(" ")}
          >
            <div className="absolute inset-1 border border-zinc-900/80 bg-zinc-950/70" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <ItemImage
                  src={slot.item.image}
                  alt={slot.item.name}
                  fallback={slot.item.name.slice(0, 2)}
                  className={isLarge ? "h-12" : "h-6"}
                  imageClassName="opacity-95"
                />

                <p
                  className={[
                    "mt-0.5 font-black uppercase leading-tight text-zinc-200",
                    isLarge ? "line-clamp-2 text-[9px]" : "line-clamp-1 text-[7px]",
                  ].join(" ")}
                >
                  {slot.item.name}
                </p>
              </div>

              <div className="flex items-center justify-between gap-1 text-[8px] font-black uppercase">
                <span className="text-orange-400">x{slot.quantity}</span>
                <span className="truncate text-zinc-600">{formatCredits(slot.totalValue)}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
