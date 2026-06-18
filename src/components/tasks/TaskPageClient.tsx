"use client";

import { useGameState } from "../state/GameStateProvider";
import { TaskClient } from "./TaskClient";

export function TaskPageClient() {
  const { state } = useGameState();

  return <TaskClient tasks={state.tasks} />;
}
