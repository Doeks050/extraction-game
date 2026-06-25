"use client";

import { useEffect, useMemo } from "react";
import { formatCredits } from "../../lib/items";
import {
  canPlaceStashSlotWithRotation,
  layoutStashSlots,
} from "../../lib/stashGrid";
import {
  removeUsbFromCase,
  storeUsbInCase,
} from "../../lib/usbCaseStorage";
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

  function handleMoveSlot(
    slotId: string,
    column: number,
    row: number,
    isRotated: boolean,
  ) {
    if (
      !canPlaceStashSlotWithRotation(
        positionedStash,
        slotId,
        column,
        row,
        isRotated,
      )
    ) {
      return;
    }

    setState({
      ...state,
      stash: positionedStash.map((slot) =>
        slot.slotId === slotId
          ? {
              ...slot,
              gridPosition: { column, row },
              isRotated,
            }
          : slot,
      ),
    });
  }

  function handleStoreUsb(caseSlotId: string, usbSlotId: string) {
    const nextState = storeUsbInCase(state, caseSlotId, usbSlotId);

    if (nextState) {
      setState(nextState);
    }
  }

  function handleRemoveUsb(caseSlotId: string, usbSlotId: string) {
    const nextState = removeUsbFromCase(state, caseSlotId, usbSlotId);

    if (nextState) {
      setState(nextState);
    }
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
        onStoreUsb={handleStoreUsb}
        onRemoveUsb={handleRemoveUsb}
      />
    </div>
  );
}
