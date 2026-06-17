import { GameShell } from "../../components/shell/GameShell";
import { Panel } from "../../components/ui/Panel";

export default function TasksPage() {
  return (
    <GameShell title="Tasks" eyebrow="Contracts">
      <Panel title="Tasks">
        <p className="text-sm text-zinc-400">
          Missions, objectives and rewards come later.
        </p>
      </Panel>
    </GameShell>
  );
}
