import { getReadinessLabel } from "../../lib/loadout";
import type { LoadoutStatSummary } from "../../types/loadout";
import { Panel } from "../ui/Panel";

type RaidReadinessPanelProps = {
  stats: LoadoutStatSummary;
};

const checks = [
  { key: "hasWeapon", label: "Weapon Check" },
  { key: "hasAmmo", label: "Ammo Check" },
  { key: "hasArmor", label: "Armor Check" },
  { key: "hasMedical", label: "Medical Check" },
] as const;

export function RaidReadinessPanel({ stats }: RaidReadinessPanelProps) {
  const label = getReadinessLabel(stats.readinessScore);

  return (
    <Panel className="p-2">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-600">
            Raid Readiness
          </p>
          <p className="text-lg font-black uppercase text-orange-400">
            {label}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center border border-orange-500/50 bg-orange-500/10 text-xl font-black text-orange-300">
          ✓
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1">
        {checks.map((check) => {
          const passed = stats[check.key];

          return (
            <div
              key={check.key}
              className="flex items-center justify-between gap-1 border border-zinc-900 bg-black/45 px-2 py-1"
            >
              <p className="text-[8px] font-black uppercase text-zinc-500">
                {check.label}
              </p>
              <p className="text-[8px] font-black uppercase text-orange-400">
                {passed ? "OK" : "MISS"}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
