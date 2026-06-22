"use client";

import { formatCredits } from "../../lib/items";
import { useGameState } from "../state/GameStateProvider";
import { StashClient } from "./StashClient";
import { StashStatsPanel } from "./StashStatsPanel";

export function StashPageClient() {
  const { state, setState } = useGameState();
  const usedSlots = state.stash.length;
  const maxSlots = 40;

  function handleMoveSlot(sourceSlotId: string, targetSlotId: string) {
    if (sourceSlotId === targetSlotId) {
      return;
    }

    const sourceSlot = state.stash.find((slot) => slot.slotId === sourceSlotId);

    if (!sourceSlot) {
      return;
    }

    const stashWithoutSource = state.stash.filter((slot) => slot.slotId !== sourceSlotId);
    const targetIndex = stashWithoutSource.findIndex((slot) => slot.slotId === targetSlotId);

    if (targetIndex < 0) {
      return;
    }

    const reorderedStash = [...stashWithoutSource];
    reorderedStash.splice(targetIndex, 0, sourceSlot);

    setState({
      ...state,
      stash: reorderedStash,
    });
  }

  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-2">
      <StashStatsPanel
        usedSlots={usedSlots}
        maxSlots={maxSlots}
        credits={formatCredits(state.operator.credits)}
      />

      <StashClient slots={state.stash} onMoveSlot={handleMoveSlot} />
    </div>
  );
}
