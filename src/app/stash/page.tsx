import { GameShell } from "../../components/shell/GameShell";
import { StashClient } from "../../components/stash/StashClient";
import { StashStatsPanel } from "../../components/stash/StashStatsPanel";
import { starterStash } from "../../data/items/stash";
import {
  formatCredits,
  formatWeight,
  getInventoryValue,
  getInventoryWeight,
} from "../../lib/items";

export default function StashPage() {
  const totalValue = getInventoryValue(starterStash);
  const totalWeight = getInventoryWeight(starterStash);
  const usedSlots = starterStash.length;
  const maxSlots = 40;

  return (
    <GameShell title="Stash" eyebrow="Storage">
      <div className="grid h-full grid-rows-[auto_1fr] gap-2">
        <StashStatsPanel
          usedSlots={usedSlots}
          maxSlots={maxSlots}
          totalValue={formatCredits(totalValue)}
          totalWeight={formatWeight(totalWeight)}
        />

        <StashClient slots={starterStash} />
      </div>
    </GameShell>
  );
}
