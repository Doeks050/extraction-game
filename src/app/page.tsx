import { HideoutPageClient } from "../components/hideout/HideoutPageClient";
import { GameShell } from "../components/shell/GameShell";

export default function HomePage() {
  return (
    <GameShell title="Hideout" eyebrow="Home Base">
      <HideoutPageClient />
    </GameShell>
  );
}
