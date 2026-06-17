import { getTaskProgress, getTaskStatusLabel } from "../../lib/tasks";
import type { GameTask } from "../../types/tasks";

type TaskListProps = {
  tasks: GameTask[];
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
};

export function TaskList({ tasks, selectedTaskId, onSelectTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-xs font-bold uppercase text-zinc-500">
        No tasks in this section
      </p>
    );
  }

  return (
    <div className="grid gap-1.5">
      {tasks.map((task) => {
        const isSelected = task.id === selectedTaskId;
        const progress = getTaskProgress(task);

        return (
          <button
            key={task.id}
            type="button"
            onClick={() => onSelectTask(task.id)}
            className={[
              "border bg-black/55 p-2 text-left active:scale-[0.98]",
              isSelected ? "border-orange-500 ring-1 ring-orange-400" : "border-zinc-800",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase text-zinc-100">
                  {task.title}
                </p>
                <p className="mt-1 truncate text-[9px] font-bold uppercase text-zinc-600">
                  {task.issuer} · {getTaskStatusLabel(task.status)}
                </p>
              </div>

              <p className="shrink-0 text-[9px] font-black uppercase text-orange-400">
                {progress}%
              </p>
            </div>

            <div className="mt-2 h-1.5 border border-zinc-800 bg-black">
              <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
