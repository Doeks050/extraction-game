import type { HideoutModule } from "../../types/game";
import { HideoutModuleCard } from "./HideoutModuleCard";

type HideoutModuleGridProps = {
  modules: HideoutModule[];
};

export function HideoutModuleGrid({ modules }: HideoutModuleGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {modules.map((module) => (
        <HideoutModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}
