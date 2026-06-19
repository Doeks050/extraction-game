import type { OperatorContainer } from "../../types/game";
import { Panel } from "../ui/Panel";

type OperatorContainersPanelProps = {
  containers: OperatorContainer[];
};

export function OperatorContainersPanel({ containers }: OperatorContainersPanelProps) {
  return (
    <Panel title="Operator Containers" className="p-2">
      <div className="grid grid-cols-2 gap-1.5">
        {containers.map((container) => (
          <div
            key={container.id}
            className="border border-zinc-800 bg-black/55 p-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-600">
                  Standard
                </p>
                <p className="truncate text-[11px] font-black uppercase text-zinc-100">
                  {container.name}
                </p>
              </div>
              <p className="text-[9px] font-black uppercase text-orange-400">
                LV {container.level}
              </p>
            </div>
            <p className="mt-1 line-clamp-2 text-[9px] font-bold uppercase leading-3 text-zinc-500">
              {container.description}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
