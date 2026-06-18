import { LoadoutPageClient } from "../../components/loadout/LoadoutPageClient";
import { GameShell } from "../../components/shell/GameShell";

export default function LoadoutPage() {
  return (
    <GameShell title="Loadout" eyebrow="Deployment Prep">
      <LoadoutPageClient />
    </GameShell>
  );
}
