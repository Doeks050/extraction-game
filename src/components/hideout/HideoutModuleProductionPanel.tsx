import type { HideoutModule } from "../../types/game";
import { Panel } from "../ui/Panel";

type HideoutModuleProductionPanelProps = {
  module: HideoutModule;
};

export function HideoutModuleProductionPanel({
  module,
}: HideoutModuleProductionPanelProps) {
  return (
    <Panel title="Module Activity" className="p-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-zinc-900 bg-black/45 p-2">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Current
          </p>
          <p className="mt-1 truncate text-xs font-black uppercase text-zinc-100">
            {module.detail}
          </p>
        </div>

        <div className="border border-zinc-900 bg-black/45 p-2">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Queue
          </p>
          <p className="mt-1 truncate text-xs font-black uppercase text-zinc-100">
            Empty
          </p>
        </div>
      </div>

      <p className="mt-2 text-[10px] leading-4 text-zinc-500">
        This detail page is ready for production, crafting or storage logic once
        the exact module rules are chosen.
      </p>
    </Panel>
  );
}
