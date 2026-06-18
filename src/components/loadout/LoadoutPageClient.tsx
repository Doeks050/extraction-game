"use client";

import { calculateLoadoutStats } from "../../lib/loadout";
import { useGameState } from "../state/GameStateProvider";
import { AmmoReservePanel } from "./AmmoReservePanel";
import { DeployButton } from "./DeployButton";
import { LoadoutEquipmentPanel } from "./LoadoutEquipmentPanel";
import { LoadoutStatsPanel } from "./LoadoutStatsPanel";
import { QuickUsePanel } from "./QuickUsePanel";
import { RaidReadinessPanel } from "./RaidReadinessPanel";

export function LoadoutPageClient() {
  const { state } = useGameState();
  const stats = calculateLoadoutStats(state.loadout);

  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-2">
      <div className="grid min-h-0 grid-cols-[1.25fr_0.95fr] gap-2">
        <LoadoutEquipmentPanel slots={state.loadout.equipment} />

        <div className="grid min-h-0 grid-rows-[auto_auto_1fr] gap-2">
          <LoadoutStatsPanel stats={stats} />
          <AmmoReservePanel ammoReserve={state.loadout.ammoReserve} />
          <RaidReadinessPanel stats={stats} />
        </div>
      </div>

      <div className="grid gap-2">
        <QuickUsePanel quickSlots={state.loadout.quickSlots} />
        <DeployButton />
      </div>
    </div>
  );
}
