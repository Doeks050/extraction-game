"use client";

import { useState } from "react";
import { defaultWeaponAttachmentSlots } from "../../data/weapons/attachmentSlots";
import type { HydratedInventorySlot } from "../../lib/items";
import { formatCredits, formatWeight } from "../../lib/items";

type WeaponDetailPanelProps = {
  slot: HydratedInventorySlot;
  onBack: () => void;
};

type StatBarProps = {
  label: string;
  value: number;
};

function getAmmoType(slot: HydratedInventorySlot) {
  return slot.item.tags.find((tag) => tag.includes("x")) ?? "Unknown";
}

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
        <p className="text-[8px] font-black uppercase text-orange-400">{safeValue}</p>
      </div>
      <div className="h-1.5 overflow-hidden bg-zinc-900">
        <div className="h-full bg-orange-400" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

export function WeaponDetailPanel({ slot, onBack }: WeaponDetailPanelProps) {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const stats = slot.item.stats ?? {};
  const durability = clampStat(stats.durability ?? 0);

  const weaponStats = [
    { label: "Accuracy", value: stats.accuracy ?? 0 },
    { label: "Handling", value: stats.handling ?? stats.ergonomics ?? 0 },
    { label: "Recoil Control", value: stats.recoilControl ?? 0 },
    { label: "Fire Rate", value: stats.fireRate ?? 0 },
    { label: "Effective Range", value: stats.effectiveRange ?? 0 },
  ];

  return (
    <div className="relative grid h-full min-h-0 grid-rows-[auto_1.22fr_auto_1fr] gap-1">
      <div className="flex h-7 items-center justify-between gap-2">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
          Weapon Detail
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsStatsOpen(true)}
            className="h-7 border border-zinc-800 bg-black/60 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
          >
            Stats
          </button>
          <button
            type="button"
            onClick={onBack}
            className="h-7 border border-zinc-800 bg-black/60 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
          >
            Back
          </button>
        </div>
      </div>

      <div className="relative min-h-0 overflow-hidden border border-zinc-800 bg-black/60">
        <div className="absolute inset-1 border border-zinc-900 bg-zinc-950/80" />
        {slot.item.image ? (
          <div className="absolute inset-x-2 bottom-6 top-4 flex items-center justify-center overflow-hidden">
            <img
              src={slot.item.image}
              alt={slot.item.name}
              draggable={false}
              className="h-auto w-full max-w-none object-contain opacity-95"
            />
          </div>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center text-3xl font-black uppercase text-zinc-600">
            {slot.item.name.slice(0, 2)}
          </div>
        )}

        <div className="absolute left-1.5 top-1.5 bg-black/70 px-1.5 py-0.5">
          <p className="text-[9px] font-black uppercase leading-3 text-zinc-100">
            {slot.item.name}
          </p>
        </div>

        <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 px-1.5 py-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-[7px] font-black uppercase leading-3 tracking-[0.14em] text-zinc-400">
              Durability
            </p>
            <p className="text-[7px] font-black uppercase leading-3 text-orange-400">
              {durability}
            </p>
          </div>
          <div className="h-1.5 overflow-hidden bg-zinc-900">
            <div className="h-full bg-orange-400" style={{ width: `${durability}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            Value
          </p>
          <p className="text-[10px] font-black uppercase leading-3 text-orange-400">
            {formatCredits(slot.item.value)}
          </p>
        </div>
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            Weight
          </p>
          <p className="text-[10px] font-black uppercase leading-3 text-zinc-100">
            {formatWeight(slot.item.weightKg)}
          </p>
        </div>
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            Ammo
          </p>
          <p className="truncate text-[10px] font-black uppercase leading-3 text-zinc-100">
            {getAmmoType(slot)}
          </p>
        </div>
      </div>

      <div className="min-h-0 border border-zinc-800 bg-black/45 p-1">
        <div className="grid h-full min-h-0 grid-cols-2 grid-rows-4 gap-1">
          {defaultWeaponAttachmentSlots.map((attachmentSlot) => (
            <div
              key={attachmentSlot.id}
              className="grid min-h-0 grid-cols-[1fr_auto] items-center border border-zinc-800 bg-zinc-950/80 px-2"
            >
              <p className="truncate text-[8px] font-black uppercase leading-3 tracking-[0.1em] text-orange-400">
                {attachmentSlot.label}
              </p>
              <p className="pl-2 text-[7px] font-bold uppercase leading-3 text-zinc-500">
                Empty
              </p>
            </div>
          ))}
        </div>
      </div>

      {isStatsOpen ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/80 p-3">
          <div className="grid w-full gap-2 border border-zinc-700 bg-zinc-950 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
                Weapon Stats
              </p>
              <button
                type="button"
                onClick={() => setIsStatsOpen(false)}
                className="h-7 border border-zinc-800 bg-black/60 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
              >
                Close
              </button>
            </div>

            <div className="grid gap-2">
              {weaponStats.map((stat) => (
                <StatBar key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
