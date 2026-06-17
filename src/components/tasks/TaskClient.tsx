"use client";

import { useState } from "react";
import { getTasksByStatus } from "../../lib/tasks";
import type { GameTask, TaskStatus } from "../../types/tasks";
import { Panel } from "../ui/Panel";
import { TaskDetailPanel } from "./TaskDetailPanel";
import { TaskList } from "./TaskList";
import { TaskStatusTabs } from "./TaskStatusTabs";

type TaskClientProps = {
  tasks: GameTask[];
};

export function TaskClient({ tasks }: TaskClientProps) {
  const [activeStatus, setActiveStatus] = useState<TaskStatus>("active");
  const activeTasks = getTasksByStatus(tasks, activeStatus);
  const [selectedTaskId, setSelectedTaskId] = useState(activeTasks[0]?.id ?? "");

  const selectedTask =
    activeTasks.find((task) => task.id === selectedTaskId) ?? activeTasks[0];

  function handleStatusChange(status: TaskStatus) {
    const nextTasks = getTasksByStatus(tasks, status);

    setActiveStatus(status);
    setSelectedTaskId(nextTasks[0]?.id ?? "");
  }

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-2">
      <TaskStatusTabs
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
      />

      <Panel title="Task Board" className="min-h-0 overflow-y-auto p-2">
        <TaskList
          tasks={activeTasks}
          selectedTaskId={selectedTask?.id ?? ""}
          onSelectTask={setSelectedTaskId}
        />
      </Panel>

      <TaskDetailPanel task={selectedTask} />
    </div>
  );
}
