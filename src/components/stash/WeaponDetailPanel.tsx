import { defaultWeaponAttachmentSlots } from "../../data/weapons/attachmentSlots";
import type { HydratedInventorySlot } from "../../lib/items";
import { formatCredits, formatWeight } from "../../lib/items";

type WeaponDetailPanelProps = {
  slot: HydratedInventorySlot;
  onBack: () => void;
};

function getAmmoType(slot: HydratedInventorySlot) {
  return slot.item.tags.find((tag) => tag.includes("x")) ?? "Unknown";
}

export function WeaponDetailPanel({ slot, onBack }: WeaponDetailPanelProps) {
  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1.2fr_auto_1fr] gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="h-8 border border-zinc-800 bg-black/60 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
        >
          Back
        </button>

        <div className="min-w-0 text-right">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-orange-400">
            Weapon Detail
          </p>
          <p className="truncate text-sm font-black uppercase leading-4 text-zinc-100">
            {slot.item.name}
          </p>
        </div>
      </div>

      <div className="relative min-h-0 overflow-hidden border border-zinc-800 bg-black/60">
        <div className="absolute inset-1 border border-zinc-900 bg-zinc-950/80" />
        {slot.item.image ? (
          <div className="absolute inset-x-2 bottom-3 top-4 flex items-center justify-center overflow-hidden">
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
      </div>

      <div className="grid grid-cols-3 gap-1.5">
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

      <div className="min-h-0 border border-zinc-800 bg-black/45 p-1.5">
        <p className="mb-1 text-[8px] font-black uppercase tracking-[0.18em] text-zinc-500">
          Attachment Slots
        </p>

        <div className="grid h-[calc(100%-0.875rem)] grid-cols-2 grid-rows-4 gap-1">
          {defaultWeaponAttachmentSlots.map((attachmentSlot) => (
            <div
              key={attachmentSlot.id}
              className="min-h-0 border border-zinc-800 bg-zinc-950/80 px-1.5 py-1"
            >
              <p className="truncate text-[8px] font-black uppercase leading-[10px] tracking-[0.1em] text-orange-400">
                {attachmentSlot.label}
              </p>
              <p className="truncate text-[7px] font-bold uppercase leading-[10px] text-zinc-500">
                Empty
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
