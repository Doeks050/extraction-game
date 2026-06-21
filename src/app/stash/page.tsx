import { GameShell } from "../../components/shell/GameShell";
import { StashPageClient } from "../../components/stash/StashPageClient";

export default function StashPage() {
  return (
    <GameShell
      title="Stash"
      eyebrow=""
      showSaveStatus={false}
      compactHeader
      titleClassName="text-orange-400"
    >
      <StashPageClient />
    </GameShell>
  );
}
