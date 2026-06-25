import Link from "next/link";
import { getHideoutUpgradeRequirements } from "../../data/hideout/hideoutUpgradeRequirements";
import { getHideoutModuleRoute } from "../../lib/hideout";
import { getItemById } from "../../lib/items";
import type { HideoutModule } from "../../types/game";
import { ItemImage } from "../items/ItemImage";
import { Panel } from "../ui/Panel";

type HideoutModuleCardProps = {
  module: HideoutModule;
};

function getItemFallback(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function HideoutModuleCard({ module }: HideoutModuleCardProps) {
  const requirements = getHideoutUpgradeRequirements(module).flatMap(
    (requirement) => {
      const item = getItemById(requirement.itemId);

      return item ? [{ ...requirement, item }] : [];
    },
  );

  return (
    <Link
      href={getHideoutModuleRoute(module)}
      className="block h-full active:scale-[0.98]"
    >
      <Panel className="h-full border-0 p-2">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate text-[11px] font-black uppercase text-zinc-100">
            {module.name}
          </p>

          <p className="shrink-0 border border-orange-500/40 bg-orange-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase text-orange-300">
            Lv {module.level}
          </p>
        </div>

        {requirements.length > 0 ? (
          <div
            className={`mt-2 grid gap-1 ${
              requirements.length === 3 ? "grid-cols-3" : "grid-cols-4"
            }`}
          >
            {requirements.map((requirement) => (
              <div
                key={requirement.itemId}
                title={`${requirement.item.name} x${requirement.quantity}`}
                className="relative h-9 overflow-hidden border border-zinc-800 bg-black/55"
              >
                <ItemImage
                  src={requirement.item.image}
                  alt={requirement.item.name}
                  fallback={getItemFallback(requirement.item.name)}
                  className="h-full w-full"
                  imageClassName="p-1 opacity-90"
                />
                <span className="absolute bottom-0 right-0 border-l border-t border-zinc-800 bg-black/90 px-1 text-[7px] font-black text-orange-300">
                  x{requirement.quantity}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </Panel>
    </Link>
  );
}
