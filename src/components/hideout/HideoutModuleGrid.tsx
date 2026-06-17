import type { HideoutModule, HideoutModuleStatus } from "../../types/game";
import { Panel } from "../ui/Panel";

type HideoutModuleGridProps = {
  modules: HideoutModule[];
};

const statusLabels: Record<HideoutModuleStatus, string> = {
  idle: "Idle",
  ready: "Ready",
  active: "Active",
  stable: "Stable",
  locked: "Locked",
};

export function HideoutModuleGrid({ modules }: HideoutModuleGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {modules.map((module) => (
        <Panel key={module.id} className="p-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-black uppercase text-zinc-100">
                {module.name}
              </p>
              <p className="mt-1 truncate text-[9px] font-bold uppercase text-zinc-500">
                {module.detail}
              </p>
            </div>

            <p className="shrink-0 border border-orange-500/40 bg-orange-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase text-orange-300">
              Lv {module.level}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="h-1.5 flex-1 border border-zinc-800 bg-black">
              <div className="h-full w-1/3 bg-orange-500" />
            </div>

            <p className="text-[8px] font-black uppercase text-zinc-500">
              {statusLabels[module.status]}
            </p>
          </div>
        </Panel>
      ))}
    </div>
  );
}
