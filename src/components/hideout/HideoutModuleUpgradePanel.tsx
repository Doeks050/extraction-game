import type { HideoutModule } from "../../types/game";
import { Panel } from "../ui/Panel";

type HideoutModuleUpgradePanelProps = {
  module: HideoutModule;
};

export function HideoutModuleUpgradePanel({ module }: HideoutModuleUpgradePanelProps) {
  return (
    <Panel title="Upgrade" className="p-2">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase text-zinc-100">
            {module.name} Lv {module.level + 1}
          </p>
          <p className="mt-1 text-[10px] leading-4 text-zinc-500">
            Upgrade requirements are not configured yet. Later this panel will use
            parts from raids, traders and crafting recipes.
          </p>
        </div>

        <button
          type="button"
          disabled
          className="h-12 border border-zinc-800 bg-zinc-950 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600"
        >
          Locked
        </button>
      </div>
    </Panel>
  );
}
