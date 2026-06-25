import type { HideoutModule } from "../../types/game";
import { HideoutModuleCard } from "./HideoutModuleCard";

type HideoutModuleGridProps = {
  modules: HideoutModule[];
};

export function HideoutModuleGrid({ modules }: HideoutModuleGridProps) {
  return (
    <div className="grid grid-cols-2 gap-px border border-zinc-800 bg-zinc-800">
      {modules.map((module) => (
        <HideoutModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}
