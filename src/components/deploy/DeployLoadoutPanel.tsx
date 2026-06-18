import { formatWeight } from "../../lib/items";
import { getReadinessLabel } from "../../lib/loadout";
import type { LoadoutStatSummary } from "../../types/loadout";
import { Panel } from "../ui/Panel";

type DeployLoadoutPanelProps = {
  stats: LoadoutStatSummary;
};

export function DeployLoadoutPanel({ stats }: DeployLoadoutPanelProps) {
  return (
    <Panel title="Loadout Check" className="p-2">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Status
          </p>
          <p className="text-[10px] font-black uppercase text-orange-400">
            {getReadinessLabel(stats.readinessScore)}
          </p>
        </div>

        <div>
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Score
          </p>
          <p className="text-[10px] font-black text-zinc-100">
            {stats.readinessScore}
          </p>
        </div>

        <div>
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Armor
          </p>
          <p className="text-[10px] font-black text-zinc-100">
            {stats.protection}
          </p>
        </div>

        <div>
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Weight
          </p>
          <p className="text-[10px] font-black text-zinc-100">
            {formatWeight(stats.weightKg)}
          </p>
        </div>
      </div>
    </Panel>
  );
}
