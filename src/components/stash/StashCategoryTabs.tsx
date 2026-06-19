import { itemCategories } from "../../data/items/itemCategories";
import type { ItemCategory } from "../../types/items";

type StashCategoryTabsProps = {
  activeCategory: ItemCategory | "all";
  onCategoryChange: (category: ItemCategory | "all") => void;
};

const visibleCategoryIds: Array<ItemCategory | "all"> = [
  "all",
  "weapon",
  "ammo",
  "magazine",
  "attachment",
  "chest_gear",
  "helmet",
  "backpack",
  "medical",
  "hideout_material",
  "valuable",
];

function getCategoryLabel(categoryId: ItemCategory | "all") {
  if (categoryId === "all") {
    return "ALL";
  }

  return (
    itemCategories.find((category) => category.id === categoryId)?.shortLabel ??
    categoryId.toUpperCase()
  );
}

export function StashCategoryTabs({
  activeCategory,
  onCategoryChange,
}: StashCategoryTabsProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {visibleCategoryIds.map((categoryId) => {
        const isActive = activeCategory === categoryId;

        return (
          <button
            key={categoryId}
            type="button"
            onClick={() => onCategoryChange(categoryId)}
            className={[
              "h-8 border px-1 text-[8px] font-black uppercase tracking-[0.12em]",
              isActive
                ? "border-orange-500 bg-orange-500/15 text-orange-300"
                : "border-zinc-800 bg-zinc-950 text-zinc-500 active:border-orange-500/60 active:text-orange-300",
            ].join(" ")}
          >
            {getCategoryLabel(categoryId)}
          </button>
        );
      })}
    </div>
  );
}
