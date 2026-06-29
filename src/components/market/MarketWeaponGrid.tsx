"use client";

import { useMemo } from "react";
import { getWeaponCaliberFromTags } from "../../data/weapons/calibers";
import { getWeaponClassFromTags } from "../../data/weapons/weaponClasses";
import { formatCredits } from "../../lib/items";
import { getMarketItemValue } from "../../lib/market";
import {
  getSlotGridSize,
  layoutStashSlots,
  STASH_GRID_COLUMNS,
} from "../../lib/stashGrid";
import type { GameItem, InventorySlot } from "../../types/items";

// Shared trader stock grid. It intentionally keeps the old component name
// because the first implementation only handled weapons.
type MarketWeaponGridProps = {
  items: GameItem[];
  soldItemIds: Set<string>;
  onSelectItem: (itemId: string) => void;
};

const CELL_HEIGHT_PX = 60;
const MIN_TRADER_ROWS = 8;

const rarityClassNames = {
  common: "border-zinc-700 text-zinc-300",
  uncommon: "border-emerald-500/50 text-emerald-300",
  rare: "border-sky-500/50 text-sky-300",
  epic: "border-purple-500/50 text-purple-300",
  legendary: "border-orange-400/70 text-orange-300",
};

const categoryLabels = {
  ammo: "AMMO",
  magazine: "MAG",
  attachment: "ATTACH",
  chest_gear: "GEAR",
  helmet: "HELMET",
  backpack: "PACK",
  medical: "MED",
  valuable: "VALUE",
  hideout_material: "MATERIAL",
  data: "DATA",
  container: "CASE",
  quest: "QUEST",
  key: "KEY",
};

function getItemMetaLabel(item: GameItem) {
  if (item.category === "weapon") {
    return getWeaponCaliberFromTags(item.tags);
  }

  if (item.stats?.armorClass) {
    return `AC ${item.stats.armorClass}`;
  }

  if (item.stats?.capacity) {
    return `${item.stats.capacity} SLOT`;
  }

  if (item.filamentPrintCapacity) {
    return `${item.filamentPrintCapacity} PRINT`;
  }

  if (item.containerGridSize) {
    return `${item.containerGridSize.width}X${item.containerGridSize.height}`;
  }

  return categoryLabels[item.category as keyof typeof categoryLabels] ?? item.category;
}

function getItemImageClassName(item: GameItem, isOneSlotItem: boolean) {
  const weaponClass = getWeaponClassFromTags(item.tags);

  if (weaponClass?.id === "pistol") {
    return "h-[120%] w-auto max-w-[120%] object-contain opacity-95";
  }

  if (weaponClass?.id === "assault_rifle") {
    return "h-[200%] w-[200%] max-h-none max-w-none object-contain opacity-95";
  }

  if (weaponClass?.id === "dmr") {
    return "h-[250%] w-[250%] max-h-none max-w-none object-contain opacity-95";
  }

  if (isOneSlotItem) {
    return "h-[115%] w-[115%] max-h-none max-w-none object-contain opacity-95";
  }

  return "h-full w-full max-h-full max-w-full object-contain p-1 opacity-95";
}

export function MarketWeaponGrid({
  items,
  soldItemIds,
  onSelectItem,
}: MarketWeaponGridProps) {
  const positionedOffers = useMemo(() => {
    const offerSlots: InventorySlot[] = items.map((item) => ({
      slotId: `market_offer_${item.id}`,
      itemId: item.id,
      quantity: 1,
      currentDurability: 100,
    }));

    return layoutStashSlots(offerSlots).flatMap((slot) => {
      const item = items.find((candidate) => candidate.id === slot.itemId);
      return item ? [{ slot, item }] : [];
    });
  }, [items]);

  const occupiedRows = positionedOffers.reduce((maxRow, offer) => {
    if (!offer.slot.gridPosition) {
      return maxRow;
    }

    const size = getSlotGridSize(offer.slot, offer.item);
    return Math.max(maxRow, offer.slot.gridPosition.row + size.height);
  }, 0);
  const rowCount = Math.max(MIN_TRADER_ROWS, occupiedRows + 2);

  return (
    <div
      className="relative grid grid-cols-6 gap-1.5"
      style={{ gridTemplateRows: `repeat(${rowCount}, ${CELL_HEIGHT_PX}px)` }}
    >
      {Array.from({ length: rowCount * STASH_GRID_COLUMNS }, (_, index) => (
        <div
          key={`market-cell-${index}`}
          className="border border-zinc-900 bg-black/25"
          style={{
            gridColumnStart: (index % STASH_GRID_COLUMNS) + 1,
            gridRowStart: Math.floor(index / STASH_GRID_COLUMNS) + 1,
          }}
        />
      ))}

      {positionedOffers.map(({ slot, item }) => {
        if (!slot.gridPosition) {
          return null;
        }

        const size = getSlotGridSize(slot, item);
        const isOneSlotItem = size.width === 1 && size.height === 1;
        const shouldHideTextOverlays = isOneSlotItem;
        const isSold = soldItemIds.has(item.id);
        const price = getMarketItemValue(item);
        const metaLabel = getItemMetaLabel(item);

        return (
          <button
            key={slot.slotId}
            type="button"
            title={item.name}
            onClick={() => onSelectItem(item.id)}
            className={[
              "relative z-10 overflow-hidden border bg-black/80 p-1 text-left active:scale-[0.99]",
              rarityClassNames[item.rarity],
              isSold ? "opacity-60" : "",
            ].join(" ")}
            style={{
              gridColumn: `${slot.gridPosition.column + 1} / span ${size.width}`,
              gridRow: `${slot.gridPosition.row + 1} / span ${size.height}`,
            }}
          >
            <div className="absolute inset-1 border border-zinc-900/80 bg-zinc-950/70" />

            <div
              className={[
                "absolute flex items-center justify-center overflow-hidden",
                shouldHideTextOverlays ? "inset-0" : "inset-x-2 bottom-3 top-4",
              ].join(" ")}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  draggable={false}
                  className={getItemImageClassName(item, isOneSlotItem)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-black uppercase text-zinc-500">
                  {item.name.slice(0, 2)}
                </div>
              )}
            </div>

            {!shouldHideTextOverlays ? (
              <>
                <div className="absolute left-1.5 top-1.5 max-w-[70%] bg-black/70 px-1.5 py-0.5 text-left">
                  <p className="truncate text-[9px] font-black uppercase leading-3 text-zinc-100">
                    {item.name}
                  </p>
                </div>

                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 text-[7px] font-black uppercase leading-3">
                  <span className="truncate bg-black/75 px-1 text-orange-400">
                    {`${formatCredits(price)} CR`}
                  </span>
                  <span className="truncate bg-black/75 px-1 text-cyan-300">
                    {metaLabel}
                  </span>
                </div>
              </>
            ) : null}

            {isSold ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
                {!shouldHideTextOverlays ? (
                  <span className="rotate-[-10deg] border border-red-500/70 bg-black/85 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
                    Sold
                  </span>
                ) : null}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
