import { itemCategories } from "../../data/items/itemCategories";
import { getCategoryCount } from "../../lib/items";
import type { InventorySlot } from "../../types/items";
import { Panel } from "../ui/Panel";

type StashCategorySummaryProps = {
  slots: InventorySlot[];
};

export function StashCategorySummary({ slots }: StashCategorySummaryProps) {
  const visibleCategories = itemCategories.slice(0, 8);

  return (
    <div className="grid grid-cols-4 gap-2">
      {visibleCategories.map((category) => (
        <Panel key={category.id} className="p-2">
          <p className="text-[8px] font-black uppercase text-zinc-500">
            {category.shortLabel}
          </p>
          <p className="mt-1 text-base font-black leading-none text-zinc-100">
            {getCategoryCount(slots, category.id)}
          </p>
        </Panel>
      ))}
    </div>
  );
}
