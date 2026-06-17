import { GameShell } from "../../components/shell/GameShell";
import { StashCategorySummary } from "../../components/stash/StashCategorySummary";
import { StashItemGrid } from "../../components/stash/StashItemGrid";
import { Panel } from "../../components/ui/Panel";
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
      <div className="grid h-full grid-rows-[auto_auto_1fr] gap-2">
        <Panel className="p-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-500">
                Slots
              </p>
              <p className="mt-1 text-sm font-black text-zinc-100">
                {usedSlots}/{maxSlots}
              </p>
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-500">
                Value
              </p>
              <p className="mt-1 text-sm font-black text-orange-400">
                {formatCredits(totalValue)}
              </p>
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-500">
                Weight
              </p>
              <p className="mt-1 text-sm font-black text-zinc-100">
                {formatWeight(totalWeight)}
              </p>
            </div>
          </div>
        </Panel>

        <StashCategorySummary slots={starterStash} />
        <StashItemGrid slots={starterStash} />
      </div>
    </GameShell>
  );
}
