import { getItemById } from "../../lib/items";
import type { LoadoutSlot } from "../../types/loadout";

type LoadoutSlotCardProps = {
  slot: LoadoutSlot;
};

export function LoadoutSlotCard({ slot }: LoadoutSlotCardProps) {
  const item = slot.itemId ? getItemById(slot.itemId) : undefined;
  const durability = item?.stats?.durability;

  return (
    <div className="grid grid-cols-[3.25rem_1fr_auto] gap-2 border border-zinc-800 bg-black/55 p-2">
      <div className="flex h-11 items-center justify-center border border-zinc-900 bg-zinc-950 text-sm font-black uppercase text-zinc-500">
        {item ? item.name.slice(0, 2) : "--"}
      </div>

      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-600">
          {slot.label}
        </p>
        <p className="truncate text-xs font-black uppercase text-zinc-100">
          {item?.name ?? "Empty Slot"}
        </p>
        <p className="truncate text-[9px] font-bold uppercase text-zinc-500">
          {item?.tags.join(" · ") ?? "No item equipped"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[9px] font-black uppercase text-orange-400">
          {slot.quantity ? `x${slot.quantity}` : ""}
        </p>
        <p className="mt-3 text-[8px] font-bold uppercase text-zinc-600">
          {durability ? `${durability}%` : ""}
        </p>
      </div>
    </div>
  );
}
