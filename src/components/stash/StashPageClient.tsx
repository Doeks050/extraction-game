"use client";

import { useEffect, useMemo } from "react";
import { formatCredits } from "../../lib/items";
import {
  canPlaceStashSlot,
  canRotateStashSlot,
  layoutStashSlots,
} from "../../lib/stashGrid";
import { useGameState } from "../state/GameStateProvider";
import { StashClient } from "./StashClient";
import { StashStatsPanel } from "./StashStatsPanel";

export function StashPageClient() {
  const { state, setState } = useGameState();
  const positionedStash = useMemo(() => layoutStashSlots(state.stash), [state.stash]);
  const usedSlots = positionedStash.length;
  const maxSlots = 40;

  useEffect(() => {
    const hasPositionChanges = positionedStash.some((slot, index) => {
      const currentSlot = state.stash[index];

      return (
        !currentSlot?.gridPosition ||
        currentSlot.gridPosition.column !== slot.gridPosition?.column ||
        currentSlot.gridPosition.row !== slot.gridPosition?.row
      );
    });

    if (!hasPositionChanges) {
      return;
    }

    setState({
      ...state,
      stash: positionedStash,
    });
  }, [positionedStash, setState, state]);

  function handleMoveSlot(slotId: string, column: number, row: number) {
    if (!canPlaceStashSlot(positionedStash, slotId, column, row)) {
      return;
    }

    setState({
      ...state,
      stash: positionedStash.map((slot) =>
        slot.slotId === slotId
          ? {
              ...slot,
              gridPosition: { column, row },
            }
          : slot,
      ),
    });
  }

  function handleRotateSlot(slotId: string) {
    if (!canRotateStashSlot(positionedStash, slotId)) {
      return false;
    }

    setState({
      ...state,
      stash: positionedStash.map((slot) =>
        slot.slotId === slotId
          ? {
              ...slot,
              isRotated: !slot.isRotated,
            }
          : slot,
      ),
    });

    return true;
  }

  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-2">
      <StashStatsPanel
        usedSlots={usedSlots}
        maxSlots={maxSlots}
        credits={formatCredits(state.operator.credits)}
      />

      <StashClient
        slots={positionedStash}
        onMoveSlot={handleMoveSlot}
        onRotateSlot={handleRotateSlot}
      />
    </div>
  );
}
