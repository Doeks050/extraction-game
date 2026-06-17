import { GameShell } from "../../components/shell/GameShell";
import { TaskClient } from "../../components/tasks/TaskClient";
import { gameState } from "../../data/gameState";

export default function TasksPage() {
  return (
    <GameShell title="Tasks" eyebrow="Contracts">
      <TaskClient tasks={gameState.tasks} />
    </GameShell>
  );
}
