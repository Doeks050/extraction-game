"use client";

import {
  formatCredits,
  formatWeight,
  getInventoryValue,
  getInventoryWeight,
} from "../../lib/items";
import { useGameState } from "../state/GameStateProvider";
import { StashClient } from "./StashClient";
import { StashStatsPanel } from "./StashStatsPanel";

export function StashPageClient() {
  const { state } = useGameState();
  const totalValue = getInventoryValue(state.stash);
  const totalWeight = getInventoryWeight(state.stash);
  const usedSlots = state.stash.length;
  const maxSlots = 40;

  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-2">
      <StashStatsPanel
        usedSlots={usedSlots}
        maxSlots={maxSlots}
        totalValue={formatCredits(totalValue)}
        totalWeight={formatWeight(totalWeight)}
      />

      <StashClient slots={state.stash} />
    </div>
  );
}
