import { formatCredits, getItemById } from "../../lib/items";
import type { CurrentLoadout } from "../../types/loadout";
import { Panel } from "../ui/Panel";

type AmmoReservePanelProps = {
  ammoReserve: CurrentLoadout["ammoReserve"];
};

export function AmmoReservePanel({ ammoReserve }: AmmoReservePanelProps) {
  return (
    <Panel title="Ammo Reserve" className="p-2">
      <div className="grid gap-1.5">
        {ammoReserve.map((reserve) => {
          const item = getItemById(reserve.itemId);

          if (!item) {
            return null;
          }

          return (
            <div
              key={reserve.itemId}
              className="grid grid-cols-[1fr_auto] gap-2 border border-zinc-900 bg-black/45 px-2 py-1.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[10px] font-black uppercase text-zinc-200">
                  {item.name}
                </p>
                <p className="text-[8px] font-bold uppercase text-zinc-600">
                  {formatCredits(item.value)} cr / round
                </p>
              </div>

              <p className="text-xs font-black text-orange-400">
                {reserve.quantity}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
