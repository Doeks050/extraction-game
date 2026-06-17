import { GameShell } from "../../components/shell/GameShell";
import { TaskClient } from "../../components/tasks/TaskClient";
import { taskBoard } from "../../data/tasks/taskBoard";

export default function TasksPage() {
  return (
    <GameShell title="Tasks" eyebrow="Contracts">
      <TaskClient tasks={taskBoard} />
    </GameShell>
  );
}
