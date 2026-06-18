import { GameShell } from "../../components/shell/GameShell";
import { TaskPageClient } from "../../components/tasks/TaskPageClient";

export default function TasksPage() {
  return (
    <GameShell title="Tasks" eyebrow="Contracts">
      <TaskPageClient />
    </GameShell>
  );
}
