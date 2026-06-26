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

type StatBarProps = {
  label: string;
  value: number;
};

function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

function StatBar({ label, value }: StatBarProps) {
  const safeValue = clampStat(value);

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-zinc-400">
          {label}
        </p>
        <p className="text-[8px] font-black uppercase text-orange-400">
          {safeValue}
        </p>
      </div>
      <div className="h-1.5 overflow-hidden bg-zinc-900">
        <div className="h-full bg-orange-400" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function getWeaponImageClassName(item: GameItem) {
  const weaponClass = getWeaponClassFromTags(item.tags);

  if (weaponClass?.id === "pistol") {
    return "h-[120%] w-auto max-w-[120%] object-contain opacity-95";
  }

  return "h-auto w-full max-w-none object-contain opacity-95";
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
  const stats = item.stats ?? {};
  const weaponClass = getWeaponClassFromTags(item.tags);
  const weaponStats = [
    { label: "Accuracy", value: stats.accuracy ?? 0 },
    { label: "Handling", value: stats.handling ?? stats.ergonomics ?? 0 },
    { label: "Recoil Control", value: stats.recoilControl ?? 0 },
    { label: "Fire Rate", value: stats.fireRate ?? 0 },
    { label: "Effective Range", value: stats.effectiveRange ?? 0 },
  ];

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1.15fr_auto_auto_1fr_auto] gap-1.5 overflow-y-auto">
      <div className="flex h-8 items-center justify-between gap-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
            Weapon Offer
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
              className={getWeaponImageClassName(item)}
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
            {weaponClass?.label ?? "Weapon"}
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
            Ammo
          </p>
          <p className="truncate text-[10px] font-black uppercase leading-3 text-zinc-100">
            {getWeaponCaliberFromTags(item.tags)}
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
          Weapon Stats
        </p>
        {weaponStats.map((stat) => (
          <StatBar key={stat.label} label={stat.label} value={stat.value} />
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
