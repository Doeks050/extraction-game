import { Panel } from "../ui/Panel";

type StashStatsPanelProps = {
  usedSlots: number;
  maxSlots: number;
  totalValue: string;
  totalWeight: string;
};

export function StashStatsPanel({
  usedSlots,
  maxSlots,
  totalValue,
  totalWeight,
}: StashStatsPanelProps) {
  return (
    <Panel className="p-2">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Slots
          </p>
          <p className="mt-1 text-sm font-black text-zinc-100">
            {usedSlots}/{maxSlots}
          </p>
        </div>

        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Value
          </p>
          <p className="mt-1 text-sm font-black text-orange-400">
            {totalValue}
          </p>
        </div>

        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Weight
          </p>
          <p className="mt-1 text-sm font-black text-zinc-100">
            {totalWeight}
          </p>
        </div>
      </div>
    </Panel>
  );
}
