import type { TaskStatus } from "../../types/tasks";

type TaskStatusTabsProps = {
  activeStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
};

const statuses: TaskStatus[] = ["active", "available", "completed"];

export function TaskStatusTabs({
  activeStatus,
  onStatusChange,
}: TaskStatusTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {statuses.map((status) => {
        const isActive = activeStatus === status;

        return (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={[
              "h-8 border text-[8px] font-black uppercase tracking-[0.16em]",
              isActive
                ? "border-orange-500 bg-orange-500/15 text-orange-300"
                : "border-zinc-800 bg-zinc-950 text-zinc-500 active:border-orange-500/60 active:text-orange-300",
            ].join(" ")}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}
