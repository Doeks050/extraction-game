import type { ActiveTask } from "../../types/game";
import { Panel } from "../ui/Panel";

type ActiveTaskPanelProps = {
  task: ActiveTask;
};

function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function ActiveTaskPanel({ task }: ActiveTaskPanelProps) {
  const progress = Math.round((task.progress / task.required) * 100);

  return (
    <Panel title="Active Task" className="p-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase text-zinc-100">
            {task.title}
          </p>
          <p className="mt-1 truncate text-[9px] font-bold uppercase text-zinc-500">
            {task.trader}
          </p>
        </div>

        <p className="shrink-0 text-[9px] font-black uppercase text-orange-400">
          {task.progress}/{task.required}
        </p>
      </div>

      <div className="mt-2 h-1.5 border border-zinc-800 bg-black">
        <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
      </div>

      <p className="mt-1 text-[9px] font-bold uppercase text-zinc-600">
        Reward {formatCredits(task.rewardCredits)} cr
      </p>
    </Panel>
  );
}
