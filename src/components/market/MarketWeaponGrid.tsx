import { formatCredits } from "../../lib/items";
import { getMarketItemValue } from "../../lib/market";
import type { GameItem } from "../../types/items";
import { ItemImage } from "../items/ItemImage";

type MarketWeaponGridProps = {
  items: GameItem[];
  soldItemIds: Set<string>;
  onSelectItem: (itemId: string) => void;
};

const rarityClassNames = {
  common: "border-zinc-700",
  uncommon: "border-emerald-500/50",
  rare: "border-sky-500/50",
  epic: "border-purple-500/50",
  legendary: "border-orange-400/70",
};

export function MarketWeaponGrid({
  items,
  soldItemIds,
  onSelectItem,
}: MarketWeaponGridProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {items.map((item) => {
        const isSold = soldItemIds.has(item.id);
        const price = getMarketItemValue(item);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectItem(item.id)}
            className={[
              "relative h-28 overflow-hidden border bg-black/75 p-1 text-left active:scale-[0.99]",
              rarityClassNames[item.rarity],
              isSold ? "opacity-55" : "",
            ].join(" ")}
          >
            <div className="absolute inset-1 border border-zinc-900 bg-zinc-950/80" />

            <ItemImage
              src={item.image}
              alt={item.name}
              fallback={item.name.slice(0, 2)}
              className="absolute inset-x-2 bottom-7 top-5 flex items-center justify-center"
              imageClassName="p-1 opacity-95"
            />

            <div className="absolute left-1.5 top-1.5 max-w-[80%] bg-black/80 px-1.5 py-0.5">
              <p className="truncate text-[8px] font-black uppercase leading-3 text-zinc-100">
                {item.name}
              </p>
            </div>

            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 bg-black/85 px-1.5 py-1">
              <p className="text-[7px] font-black uppercase text-zinc-500">
                {isSold ? "Sold out" : "Price"}
              </p>
              <p className={`text-[9px] font-black ${isSold ? "text-red-400" : "text-orange-400"}`}>
                {isSold ? "SOLD" : `${formatCredits(price)} CR`}
              </p>
            </div>

            {isSold ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35">
                <span className="rotate-[-10deg] border border-red-500/70 bg-black/85 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
                  Sold
                </span>
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
