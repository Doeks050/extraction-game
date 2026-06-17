import {
  getHideoutModuleProgress,
  hideoutStatusLabels,
} from "../../lib/hideout";
import type { HideoutModule } from "../../types/game";
import { Panel } from "../ui/Panel";

type HideoutModuleHeaderProps = {
  module: HideoutModule;
};

export function HideoutModuleHeader({ module }: HideoutModuleHeaderProps) {
  const progress = getHideoutModuleProgress(module);

  return (
    <Panel className="p-3">
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Hideout Module
          </p>
          <h2 className="truncate text-xl font-black uppercase text-zinc-100">
            {module.name}
          </h2>
          <p className="mt-1 text-xs font-bold uppercase text-zinc-500">
            {module.detail}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Level
          </p>
          <p className="text-xl font-black text-orange-400">{module.level}</p>
          <p className="text-[9px] font-black uppercase text-zinc-500">
            {hideoutStatusLabels[module.status]}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 border border-zinc-800 bg-black">
        <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
      </div>
    </Panel>
  );
}
