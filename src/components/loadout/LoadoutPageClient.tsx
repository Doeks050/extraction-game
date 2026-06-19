"use client";

import { useGameState } from "../state/GameStateProvider";
import { DeployButton } from "./DeployButton";
import { LoadoutEquipmentPanel } from "./LoadoutEquipmentPanel";
import { OperatorContainersPanel } from "./OperatorContainersPanel";

export function LoadoutPageClient() {
  const { state } = useGameState();

  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-2">
      <div className="grid min-h-0 gap-2 overflow-y-auto">
        <LoadoutEquipmentPanel slots={state.loadout.equipment} />
        <OperatorContainersPanel containers={state.operator.containers} />
      </div>

      <DeployButton />
    </div>
  );
}
