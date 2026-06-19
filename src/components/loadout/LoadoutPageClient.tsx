"use client";

import { useGameState } from "../state/GameStateProvider";
import { DeployButton } from "./DeployButton";
import { LoadoutEquipmentPanel } from "./LoadoutEquipmentPanel";

export function LoadoutPageClient() {
  const { state } = useGameState();

  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-2">
      <LoadoutEquipmentPanel
        slots={state.loadout.equipment}
        containers={state.operator.containers}
      />

      <DeployButton />
    </div>
  );
}
