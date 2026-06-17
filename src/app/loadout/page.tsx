import { GameShell } from "../../components/shell/GameShell";
import { Panel } from "../../components/ui/Panel";

export default function LoadoutPage() {
  return (
    <GameShell title="Loadout" eyebrow="Deployment Prep">
      <Panel title="Loadout">
        <p className="text-sm text-zinc-400">
          Equipment slots and deploy flow come later.
        </p>
      </Panel>
    </GameShell>
  );
}
