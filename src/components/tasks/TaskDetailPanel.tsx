import { formatCredits } from "../../lib/items";
import { getTaskProgress, getTaskStatusLabel } from "../../lib/tasks";
import type { GameTask } from "../../types/tasks";
import { Panel } from "../ui/Panel";

type TaskDetailPanelProps = {
  task?: GameTask;
};

export function TaskDetailPanel({ task }: TaskDetailPanelProps) {
  if (!task) {
    return (
      <Panel title="Task Detail" className="p-2">
        <p className="text-xs font-bold uppercase text-zinc-500">
          Select a task
        </p>
      </Panel>
    );
  }

  const progress = getTaskProgress(task);

  return (
    <Panel title="Task Detail" className="p-2">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-black uppercase text-zinc-100">
            {task.title}
          </p>
          <p className="text-[9px] font-black uppercase text-orange-400">
            {task.issuer} · {getTaskStatusLabel(task.status)}
          </p>
          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-zinc-500">
            {task.summary}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Progress
          </p>
          <p className="text-sm font-black text-orange-400">{progress}%</p>
        </div>
      </div>

      <div className="mt-2 grid gap-1.5">
        {task.objectives.map((objective) => (
          <div
            key={objective.label}
            className="grid grid-cols-[1fr_auto] gap-2 border border-zinc-900 bg-black/45 px-2 py-1.5"
          >
            <p className="truncate text-[9px] font-black uppercase text-zinc-400">
              {objective.label}
            </p>
            <p className="text-[9px] font-black text-orange-400">
              {objective.progress}/{objective.required}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="border border-zinc-900 bg-black/45 p-1.5">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Credits
          </p>
          <p className="text-[10px] font-black text-orange-400">
            {formatCredits(task.rewardCredits)}
          </p>
        </div>

        <div className="border border-zinc-900 bg-black/45 p-1.5">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Items
          </p>
          <p className="text-[10px] font-black text-zinc-300">
            {task.rewardItemIds.length}
          </p>
        </div>
      </div>
    </Panel>
  );
}
