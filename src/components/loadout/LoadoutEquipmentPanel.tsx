import type { OperatorContainer } from "../../types/game";
import type { LoadoutSlot } from "../../types/loadout";
import { Panel } from "../ui/Panel";
import { LoadoutSlotCard } from "./LoadoutSlotCard";

type LoadoutEquipmentPanelProps = {
  slots: LoadoutSlot[];
  containers: OperatorContainer[];
};

export function LoadoutEquipmentPanel({ slots, containers }: LoadoutEquipmentPanelProps) {
  return (
    <Panel title="Equipment" className="min-h-0 p-2">
      <div className="grid gap-1">
        {slots.map((slot) => (
          <LoadoutSlotCard key={slot.id} slot={slot} />
        ))}

        {containers.map((container) => (
          <div
            key={container.id}
            className="grid grid-cols-[2.5rem_1fr_auto] gap-2 border border-zinc-800 bg-black/55 px-2 py-1.5"
          >
            <div className="flex h-9 items-center justify-center border border-zinc-900 bg-zinc-950 text-xs font-black uppercase text-zinc-500">
              {container.name.slice(0, 2)}
            </div>

            <div className="min-w-0">
              <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
                Operator Base
              </p>
              <p className="truncate text-[11px] font-black uppercase leading-4 text-zinc-100">
                {container.name}
              </p>
              <p className="truncate text-[8px] font-bold uppercase text-zinc-500">
                Standard · Upgradeable
              </p>
            </div>

            <div className="text-right">
              <p className="text-[8px] font-black uppercase text-orange-400">
                LV {container.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
