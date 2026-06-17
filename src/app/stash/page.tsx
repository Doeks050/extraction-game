import { GameShell } from "../../components/shell/GameShell";
import { Panel } from "../../components/ui/Panel";

export default function StashPage() {
  return (
    <GameShell title="Stash" eyebrow="Storage">
      <Panel title="Stash">
        <p className="text-sm text-zinc-400">
          Storage management comes in the next phases.
        </p>
      </Panel>
    </GameShell>
  );
}
