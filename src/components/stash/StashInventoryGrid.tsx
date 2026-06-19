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

function isRifleSlot(slot: HydratedInventorySlot) {
  return slot.item.category === "weapon" && slot.item.tags.includes("rifle");
}

function getVisualGridSize(slot: HydratedInventorySlot) {
  const { width, height } = slot.item.gridSize;

  if (isRifleSlot(slot)) {
    return { width: 4, height: 2 };
  }

  return { width, height };
}

export function StashInventoryGrid({ slots }: StashInventoryGridProps) {
  return (
    <div className="grid auto-rows-[3.75rem] grid-cols-6 gap-1.5">
      {slots.map((slot) => {
        const { width, height } = getVisualGridSize(slot);
        const showQuantity = slot.quantity > 1;
        const isRifle = isRifleSlot(slot);

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

            <ItemImage
              src={slot.item.image}
              alt={slot.item.name}
              fallback={slot.item.name.slice(0, 2)}
              className={
                isRifle
                  ? "absolute inset-x-2 bottom-4 top-5 flex items-center justify-center"
                  : "absolute inset-2 flex items-center justify-center"
              }
              imageClassName={isRifle ? "p-0 opacity-95 scale-125" : "p-1 opacity-95"}
            />

            <div className="absolute left-1.5 top-1.5 max-w-[70%] bg-black/70 px-1.5 py-0.5 text-left">
              <p className="truncate text-[9px] font-black uppercase leading-3 text-zinc-100">
                {slot.item.name}
              </p>
            </div>

            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 text-[7px] font-black uppercase leading-3">
              <span className="bg-black/70 px-1 text-orange-400">
                {showQuantity ? `x${slot.quantity}` : ""}
              </span>
              <span className="truncate bg-black/70 px-1 text-zinc-500">
                {formatCredits(slot.totalValue)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
