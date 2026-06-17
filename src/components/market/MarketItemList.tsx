import { formatCredits } from "../../lib/items";
import { getMarketItemValue } from "../../lib/market";
import type { GameItem } from "../../types/items";
import type { MarketMode } from "../../types/market";

type MarketItemListProps = {
  items: GameItem[];
  mode: MarketMode;
  selectedItemId: string;
  onSelectItem: (itemId: string) => void;
};

const rarityClassNames = {
  common: "border-zinc-700",
  uncommon: "border-emerald-500/50",
  rare: "border-sky-500/50",
  epic: "border-purple-500/50",
  legendary: "border-orange-400/70",
};

export function MarketItemList({
  items,
  mode,
  selectedItemId,
  onSelectItem,
}: MarketItemListProps) {
  return (
    <div className="grid gap-1.5">
      {items.map((item) => {
        const isSelected = item.id === selectedItemId;
        const value = getMarketItemValue(item, mode);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectItem(item.id)}
            className={[
              "grid h-14 grid-cols-[2.5rem_1fr_auto] gap-2 border bg-black/55 p-1.5 text-left active:scale-[0.98]",
              rarityClassNames[item.rarity],
              isSelected ? "ring-1 ring-orange-400" : "",
            ].join(" ")}
          >
            <div className="flex h-full items-center justify-center border border-zinc-900 bg-zinc-950 text-xs font-black uppercase text-zinc-500">
              {item.name.slice(0, 2)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-black uppercase text-zinc-100">
                {item.name}
              </p>
              <p className="truncate text-[8px] font-bold uppercase text-zinc-600">
                {item.category.replace("_", " ")} · {item.rarity}
              </p>
              <p className="truncate text-[8px] font-bold uppercase text-zinc-500">
                {item.tags.join(" · ")}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black text-orange-400">
                {formatCredits(value)}
              </p>
              <p className="text-[8px] font-black uppercase text-zinc-600">
                cr
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
