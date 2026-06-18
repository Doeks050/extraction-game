import { DevToolsClient } from "../../components/dev/DevToolsClient";
import { GameShell } from "../../components/shell/GameShell";

export default function DevPage() {
  return (
    <GameShell title="Dev Tools" eyebrow="Local Testing">
      <DevToolsClient />
    </GameShell>
  );
}
