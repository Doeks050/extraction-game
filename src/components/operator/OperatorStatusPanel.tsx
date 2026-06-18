import type { OperatorProfile } from "../../types/game";
import { Panel } from "../ui/Panel";

type OperatorStatusPanelProps = {
  operator: OperatorProfile;
};

function getProgressPercent(xp: number, maxXp: number) {
  if (maxXp <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((xp / maxXp) * 100));
}

function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function OperatorStatusPanel({ operator }: OperatorStatusPanelProps) {
  const progress = getProgressPercent(operator.xp, operator.nextXp);

  return (
    <Panel className="p-3">
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Player Profile
          </p>
          <h2 className="truncate text-xl font-black uppercase text-zinc-100">
            Operator
          </h2>
          <p className="mt-1 text-xs font-bold uppercase text-zinc-500">
            Level {operator.level}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Credits
          </p>
          <p className="text-xl font-black text-orange-400">
            {formatCredits(operator.credits)}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 border border-zinc-800 bg-black">
        <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
      </div>
    </Panel>
  );
}
