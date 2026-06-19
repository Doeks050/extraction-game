import { getItemById } from "../../lib/items";
import type { LoadoutSlot } from "../../types/loadout";

type LoadoutSlotCardProps = {
  slot: LoadoutSlot;
};

export function LoadoutSlotCard({ slot }: LoadoutSlotCardProps) {
  const item = slot.itemId ? getItemById(slot.itemId) : undefined;
  const durability = item?.stats?.durability;

  return (
    <div className="grid grid-cols-[2.5rem_1fr_auto] gap-2 border border-zinc-800 bg-black/55 px-2 py-1.5">
      <div className="flex h-9 items-center justify-center border border-zinc-900 bg-zinc-950 text-xs font-black uppercase text-zinc-500">
        {item ? item.name.slice(0, 2) : "--"}
      </div>

      <div className="min-w-0">
        <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
          {slot.label}
        </p>
        <p className="truncate text-[11px] font-black uppercase leading-4 text-zinc-100">
          {item?.name ?? "Empty Slot"}
        </p>
        <p className="truncate text-[8px] font-bold uppercase text-zinc-500">
          {item?.tags.join(" · ") ?? "No item equipped"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[8px] font-black uppercase text-orange-400">
          {slot.quantity ? `x${slot.quantity}` : ""}
        </p>
        <p className="mt-2 text-[7px] font-bold uppercase text-zinc-600">
          {durability ? `${durability}%` : ""}
        </p>
      </div>
    </div>
  );
}
