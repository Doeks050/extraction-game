import { AmmoReservePanel } from "../../components/loadout/AmmoReservePanel";
import { DeployButton } from "../../components/loadout/DeployButton";
import { LoadoutEquipmentPanel } from "../../components/loadout/LoadoutEquipmentPanel";
import { LoadoutStatsPanel } from "../../components/loadout/LoadoutStatsPanel";
import { QuickUsePanel } from "../../components/loadout/QuickUsePanel";
import { RaidReadinessPanel } from "../../components/loadout/RaidReadinessPanel";
import { GameShell } from "../../components/shell/GameShell";
import { currentLoadout } from "../../data/loadout/currentLoadout";
import { calculateLoadoutStats } from "../../lib/loadout";

export default function LoadoutPage() {
  const stats = calculateLoadoutStats(currentLoadout);

  return (
    <GameShell title="Loadout" eyebrow="Deployment Prep">
      <div className="grid h-full grid-rows-[1fr_auto] gap-2">
        <div className="grid min-h-0 grid-cols-[1.25fr_0.95fr] gap-2">
          <LoadoutEquipmentPanel slots={currentLoadout.equipment} />

          <div className="grid min-h-0 grid-rows-[auto_auto_1fr] gap-2">
            <LoadoutStatsPanel stats={stats} />
            <AmmoReservePanel ammoReserve={currentLoadout.ammoReserve} />
            <RaidReadinessPanel stats={stats} />
          </div>
        </div>

        <div className="grid gap-2">
          <QuickUsePanel quickSlots={currentLoadout.quickSlots} />
          <DeployButton />
        </div>
      </div>
    </GameShell>
  );
}
