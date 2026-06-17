import { getItemById } from "../../lib/items";
import type { QuickSlot } from "../../types/loadout";
import { Panel } from "../ui/Panel";

type QuickUsePanelProps = {
  quickSlots: QuickSlot[];
};

export function QuickUsePanel({ quickSlots }: QuickUsePanelProps) {
  return (
    <Panel title="Quick Use" className="p-2">
      <div className="grid grid-cols-4 gap-1.5">
        {quickSlots.map((slot) => {
          const item = slot.itemId ? getItemById(slot.itemId) : undefined;

          return (
            <div
              key={slot.id}
              className="h-16 border border-zinc-800 bg-black/55 p-1"
            >
              <div className="flex h-7 items-center justify-center border border-zinc-900 bg-zinc-950 text-[11px] font-black uppercase text-zinc-500">
                {item ? item.name.slice(0, 2) : "--"}
              </div>
              <p className="mt-1 truncate text-[8px] font-black uppercase text-zinc-300">
                {item?.name ?? slot.label}
              </p>
              <p className="text-[8px] font-black uppercase text-orange-400">
                {slot.quantity ? `x${slot.quantity}` : "Empty"}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
