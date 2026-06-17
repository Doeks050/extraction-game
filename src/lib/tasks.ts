import type { GameTask, TaskStatus } from "../types/tasks";

export function getTasksByStatus(tasks: GameTask[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status);
}

export function getTaskProgress(task: GameTask) {
  const totalRequired = task.objectives.reduce(
    (total, objective) => total + objective.required,
    0,
  );

  if (totalRequired <= 0) {
    return 0;
  }

  const totalProgress = task.objectives.reduce(
    (total, objective) => total + objective.progress,
    0,
  );

  return Math.min(100, Math.round((totalProgress / totalRequired) * 100));
}

export function getTaskStatusLabel(status: TaskStatus) {
  if (status === "active") {
    return "Active";
  }

  if (status === "available") {
    return "Available";
  }

  return "Completed";
}
