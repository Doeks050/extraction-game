import { GameShell } from "../../components/shell/GameShell";
import { StashPageClient } from "../../components/stash/StashPageClient";

export default function StashPage() {
  return (
    <GameShell title="Stash" eyebrow="" showSaveStatus={false} compactHeader>
      <StashPageClient />
    </GameShell>
  );
}
