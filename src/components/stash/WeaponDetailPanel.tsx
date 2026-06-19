import { defaultWeaponAttachmentSlots } from "../../data/weapons/attachmentSlots";
import type { HydratedInventorySlot } from "../../lib/items";
import { formatCredits, formatWeight } from "../../lib/items";

type WeaponDetailPanelProps = {
  slot: HydratedInventorySlot;
  onBack: () => void;
};

export function WeaponDetailPanel({ slot, onBack }: WeaponDetailPanelProps) {
  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-2">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="border border-zinc-800 bg-black/60 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
        >
          Back
        </button>

        <div className="min-w-0 text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
            Weapon Detail
          </p>
          <p className="truncate text-base font-black uppercase text-zinc-100">
            {slot.item.name}
          </p>
        </div>
      </div>

      <div className="relative h-36 overflow-hidden border border-zinc-800 bg-black/60">
        <div className="absolute inset-1 border border-zinc-900 bg-zinc-950/80" />
        {slot.item.image ? (
          <img
            src={slot.item.image}
            alt={slot.item.name}
            draggable={false}
            className="relative h-full w-full object-contain p-3 opacity-95"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center text-3xl font-black uppercase text-zinc-600">
            {slot.item.name.slice(0, 2)}
          </div>
        )}
      </div>

      <div className="grid min-h-0 grid-rows-[auto_1fr] gap-2">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="border border-zinc-800 bg-black/55 p-2">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-600">
              Value
            </p>
            <p className="text-xs font-black uppercase text-orange-400">
              {formatCredits(slot.item.value)}
            </p>
          </div>
          <div className="border border-zinc-800 bg-black/55 p-2">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-600">
              Weight
            </p>
            <p className="text-xs font-black uppercase text-zinc-100">
              {formatWeight(slot.item.weightKg)}
            </p>
          </div>
          <div className="border border-zinc-800 bg-black/55 p-2">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-600">
              Size
            </p>
            <p className="text-xs font-black uppercase text-zinc-100">
              {slot.item.gridSize.width}x{slot.item.gridSize.height}
            </p>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto border border-zinc-800 bg-black/45 p-2">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Attachment Slots
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            {defaultWeaponAttachmentSlots.map((attachmentSlot) => (
              <div
                key={attachmentSlot.id}
                className="border border-zinc-800 bg-zinc-950/80 p-2"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-orange-400">
                  {attachmentSlot.label}
                </p>
                <p className="mt-1 truncate text-[9px] font-bold uppercase text-zinc-500">
                  Empty Slot
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
