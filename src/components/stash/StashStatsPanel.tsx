import { Panel } from "../ui/Panel";

type StashStatsPanelProps = {
  usedSlots: number;
  maxSlots: number;
  credits: string;
};

export function StashStatsPanel({ usedSlots, maxSlots, credits }: StashStatsPanelProps) {
  return (
    <Panel className="px-2 py-1.5">
      <div className="grid grid-cols-2 gap-2 text-center">
        <div>
          <p className="text-[7px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Slots
          </p>
          <p className="text-xs font-black text-zinc-100">
            {usedSlots}/{maxSlots}
          </p>
        </div>

        <div>
          <p className="text-[7px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Credits
          </p>
          <p className="text-xs font-black text-orange-400">{credits}</p>
        </div>
      </div>
    </Panel>
  );
}
