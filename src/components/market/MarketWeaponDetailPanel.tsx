"use client";

import { getWeaponCaliberFromTags } from "../../data/weapons/calibers";
import { getWeaponClassFromTags } from "../../data/weapons/weaponClasses";
import { formatCredits, formatWeight } from "../../lib/items";
import { getMarketItemValue } from "../../lib/market";
import type { GameItem } from "../../types/items";
import type { MarketTrader } from "../../types/market";

type MarketWeaponDetailPanelProps = {
  item: GameItem;
  trader: MarketTrader;
  credits: number;
  isSold: boolean;
  purchaseMessage?: string | null;
  onBack: () => void;
  onBuy: () => void;
};

type MarketStat = {
  label: string;
  value: number;
  displayValue?: string;
};

type StatBarProps = MarketStat;

const categoryLabels = {
  weapon: "Weapon",
  ammo: "Ammo",
  magazine: "Magazine",
  attachment: "Attachment",
  chest_gear: "Chest Gear",
  helmet: "Helmet",
  backpack: "Backpack",
  medical: "Medical",
  valuable: "Valuable",
  hideout_material: "Material",
  data: "Data",
  container: "Container",
  quest: "Quest",
  key: "Key",
};

function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

function StatBar({ label, value, displayValue }: StatBarProps) {
  const safeValue = clampStat(value);

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-zinc-400">
          {label}
        </p>
        <p className="text-[8px] font-black uppercase text-orange-400">
          {displayValue ?? safeValue}
        </p>
      </div>
      <div className="h-1.5 overflow-hidden bg-zinc-900">
        <div className="h-full bg-orange-400" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function getOfferTypeLabel(trader: MarketTrader) {
  if (trader.kind === "weapon") {
    return "Weapon Offer";
  }

  if (trader.kind === "gear") {
    return "Gear Offer";
  }

  if (trader.kind === "loot") {
    return "Loot Offer";
  }

  return "Market Offer";
}

function getItemClassLabel(item: GameItem) {
  const weaponClass = getWeaponClassFromTags(item.tags);
  return weaponClass?.label ?? categoryLabels[item.category];
}

function getThirdStatLabel(item: GameItem) {
  if (item.category === "weapon") {
    return "Ammo";
  }

  if (item.stats?.armorClass) {
    return "Armor";
  }

  if (item.stats?.capacity) {
    return "Capacity";
  }

  if (item.filamentPrintCapacity) {
    return "Prints";
  }

  if (item.containerGridSize) {
    return "Storage";
  }

  return "Type";
}

function getThirdStatValue(item: GameItem) {
  if (item.category === "weapon") {
    return getWeaponCaliberFromTags(item.tags);
  }

  if (item.stats?.armorClass) {
    return `Class ${item.stats.armorClass}`;
  }

  if (item.stats?.capacity) {
    return `${item.stats.capacity} slots`;
  }

  if (item.filamentPrintCapacity) {
    return `${item.filamentPrintCapacity} prints`;
  }

  if (item.containerGridSize) {
    return `${item.containerGridSize.width}x${item.containerGridSize.height}`;
  }

  return categoryLabels[item.category];
}

function getMarketStatTitle(item: GameItem) {
  if (item.category === "weapon") {
    return "Weapon Stats";
  }

  if (
    item.category === "chest_gear" ||
    item.category === "helmet" ||
    item.category === "backpack"
  ) {
    return "Gear Stats";
  }

  return "Item Info";
}

function getMarketStats(item: GameItem): MarketStat[] {
  const stats = item.stats ?? {};

  if (item.category === "weapon") {
    return [
      { label: "Accuracy", value: stats.accuracy ?? 0 },
      { label: "Handling", value: stats.handling ?? stats.ergonomics ?? 0 },
      { label: "Recoil Control", value: stats.recoilControl ?? 0 },
      { label: "Fire Rate", value: stats.fireRate ?? 0 },
      { label: "Effective Range", value: stats.effectiveRange ?? 0 },
    ];
  }

  const itemStats: MarketStat[] = [];

  if (stats.armorClass) {
    itemStats.push({
      label: "Armor Class",
      value: stats.armorClass * 20,
      displayValue: `Class ${stats.armorClass}`,
    });
  }

  if (stats.capacity) {
    itemStats.push({
      label: "Storage Capacity",
      value: Math.min(100, stats.capacity * 4),
      displayValue: `${stats.capacity} slots`,
    });
  }

  if (item.filamentPrintCapacity) {
    itemStats.push({
      label: "Print Capacity",
      value: Math.min(100, item.filamentPrintCapacity * 8),
      displayValue: `${item.filamentPrintCapacity} prints`,
    });
  }

  if (item.containerGridSize) {
    itemStats.push({
      label: "Internal Grid",
      value: Math.min(
        100,
        item.containerGridSize.width * item.containerGridSize.height * 10,
      ),
      displayValue: `${item.containerGridSize.width}x${item.containerGridSize.height}`,
    });
  }

  if (itemStats.length === 0) {
    itemStats.push({
      label: "Category",
      value: 50,
      displayValue: categoryLabels[item.category],
    });
  }

  return itemStats;
}

function getItemImageClassName(item: GameItem) {
  const weaponClass = getWeaponClassFromTags(item.tags);

  if (weaponClass?.id === "pistol") {
    return "h-[120%] w-auto max-w-[120%] object-contain opacity-95";
  }

  if (item.category === "weapon") {
    return "h-auto w-full max-w-none object-contain opacity-95";
  }

  return "h-full w-full max-h-full max-w-full object-contain p-3 opacity-95";
}

export function MarketWeaponDetailPanel({
  item,
  trader,
  credits,
  isSold,
  purchaseMessage,
  onBack,
  onBuy,
}: MarketWeaponDetailPanelProps) {
  const price = getMarketItemValue(item);
  const canAfford = credits >= price;
  const marketStats = getMarketStats(item);

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1.15fr_auto_auto_1fr_auto] gap-1.5 overflow-y-auto">
      <div className="flex h-8 items-center justify-between gap-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
            {getOfferTypeLabel(trader)}
          </p>
          <p className="text-[7px] font-black uppercase text-zinc-600">
            {trader.name}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="h-7 border border-zinc-800 bg-black/60 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
        >
          Back
        </button>
      </div>

      <div className="relative min-h-40 overflow-hidden border border-zinc-800 bg-black/60">
        <div className="absolute inset-1 border border-zinc-900 bg-zinc-950/80" />

        {item.image ? (
          <div className="absolute inset-x-3 bottom-7 top-5 flex items-center justify-center overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              draggable={false}
              className={getItemImageClassName(item)}
            />
          </div>
        ) : (
          <div className="relative flex h-full items-center justify-center text-3xl font-black uppercase text-zinc-600">
            {item.name.slice(0, 2)}
          </div>
        )}

        <div className="absolute left-1.5 top-1.5 bg-black/75 px-1.5 py-0.5">
          <p className="text-[9px] font-black uppercase leading-3 text-zinc-100">
            {item.name}
          </p>
        </div>

        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-2 bg-black/80 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-500">
            {getItemClassLabel(item)}
          </p>
          <p className="text-[10px] font-black uppercase text-orange-400">
            {formatCredits(price)} CR
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            Value
          </p>
          <p className="text-[10px] font-black uppercase leading-3 text-orange-400">
            {formatCredits(price)} CR
          </p>
        </div>
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            Weight
          </p>
          <p className="text-[10px] font-black uppercase leading-3 text-zinc-100">
            {formatWeight(item.weightKg)}
          </p>
        </div>
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            {getThirdStatLabel(item)}
          </p>
          <p className="truncate text-[10px] font-black uppercase leading-3 text-zinc-100">
            {getThirdStatValue(item)}
          </p>
        </div>
      </div>

      <div className="border border-zinc-800 bg-black/55 p-2">
        <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
          Description
        </p>
        <p className="mt-1 text-[10px] leading-4 text-zinc-300">
          {item.description}
        </p>
      </div>

      <div className="grid content-start gap-2 border border-zinc-800 bg-black/45 p-2">
        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-300">
          {getMarketStatTitle(item)}
        </p>
        {marketStats.map((stat) => (
          <StatBar
            key={stat.label}
            label={stat.label}
            value={stat.value}
            displayValue={stat.displayValue}
          />
        ))}
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-center justify-between border border-zinc-800 bg-black/55 px-2 py-1.5">
          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
              Your Balance
            </p>
            <p className={`text-[10px] font-black ${canAfford ? "text-zinc-100" : "text-red-400"}`}>
              {formatCredits(credits)} CR
            </p>
          </div>
          {purchaseMessage ? (
            <p className="text-right text-[7px] font-black uppercase text-emerald-300">
              {purchaseMessage}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          disabled={isSold || !canAfford}
          onClick={onBuy}
          className="h-11 w-full border border-orange-500/55 bg-orange-500/10 text-[10px] font-black uppercase tracking-[0.16em] text-orange-300 active:bg-orange-500/20 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-950 disabled:text-zinc-600"
        >
          {isSold
            ? "Sold Out"
            : canAfford
              ? `Buy for ${formatCredits(price)} CR`
              : "Not Enough Credits"}
        </button>
      </div>
    </div>
  );
}
