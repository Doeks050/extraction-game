import { formatWeight } from "../../lib/items";
import type { LoadoutStatSummary } from "../../types/loadout";
import { Panel } from "../ui/Panel";

type LoadoutStatsPanelProps = {
  stats: LoadoutStatSummary;
};

const statRows = [
  { key: "protection", label: "Armor" },
  { key: "mobility", label: "Mobility" },
  { key: "ergonomics", label: "Ergo" },
] as const;

export function LoadoutStatsPanel({ stats }: LoadoutStatsPanelProps) {
  return (
    <Panel title="Operator Stats" className="p-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[8px] font-black uppercase text-zinc-600">Weight</p>
          <p className="text-sm font-black text-zinc-100">
            {formatWeight(stats.weightKg)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Readiness
          </p>
          <p className="text-sm font-black text-orange-400">
            {stats.readinessScore}/100
          </p>
        </div>
      </div>

      <div className="mt-2 grid gap-1.5">
        {statRows.map((row) => {
          const value = stats[row.key];

          return (
            <div key={row.key} className="grid grid-cols-[4.5rem_1fr_2rem] gap-2">
              <p className="text-[8px] font-black uppercase text-zinc-500">
                {row.label}
              </p>
              <div className="mt-1 h-1.5 border border-zinc-800 bg-black">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${value}%` }}
                />
              </div>
              <p className="text-right text-[8px] font-black text-zinc-400">
                {value}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
