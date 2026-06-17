import { GameShell } from "../../components/shell/GameShell";
import { Panel } from "../../components/ui/Panel";

export default function MarketPage() {
  return (
    <GameShell title="Market" eyebrow="Traders">
      <Panel title="Market">
        <p className="text-sm text-zinc-400">
          Traders, parts and upgrade items come later.
        </p>
      </Panel>
    </GameShell>
  );
}
