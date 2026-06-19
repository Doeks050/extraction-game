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
};

export function StashInventoryGrid({ slots }: StashInventoryGridProps) {
  return (
    <div className="grid auto-rows-[3.75rem] grid-cols-6 gap-1.5">
      {slots.map((slot) => {
        const { width, height } = slot.item.gridSize;
        const isLarge = width > 1 || height > 1;
        const showQuantity = slot.quantity > 1;

        return (
          <button
            key={slot.slotId}
            type="button"
            style={{
              gridColumn: `span ${width} / span ${width}`,
              gridRow: `span ${height} / span ${height}`,
            }}
            className={[
              "relative overflow-hidden border bg-black/60 p-1 text-left active:scale-[0.98]",
              rarityClassNames[slot.item.rarity],
            ].join(" ")}
          >
            <div className="absolute inset-1 border border-zinc-900/80 bg-zinc-950/70" />

            <div className="relative grid h-full grid-rows-[1fr_auto] gap-0.5">
              <ItemImage
                src={slot.item.image}
                alt={slot.item.name}
                fallback={slot.item.name.slice(0, 2)}
                className="min-h-0 w-full"
                imageClassName={isLarge ? "p-1 opacity-95" : "p-0.5 opacity-95"}
              />

              <div className="min-h-0 border-t border-zinc-800/80 pt-0.5">
                <p
                  className={[
                    "truncate font-black uppercase leading-3 text-zinc-100",
                    isLarge ? "text-[9px]" : "text-[7px]",
                  ].join(" ")}
                >
                  {slot.item.name}
                </p>

                <div className="flex items-center justify-between gap-1 text-[7px] font-black uppercase leading-3">
                  <span className="text-orange-400">{showQuantity ? `x${slot.quantity}` : ""}</span>
                  <span className="truncate text-zinc-600">{formatCredits(slot.totalValue)}</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
