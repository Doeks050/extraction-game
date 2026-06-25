import { getInventoryFuelPercentage } from "../../lib/generatorStation";
import type { HydratedInventorySlot } from "../../lib/items";
import { formatCredits, formatWeight } from "../../lib/items";
import { Panel } from "../ui/Panel";

type StashItemDetailPanelProps = {
  slot?: HydratedInventorySlot;
  onBack?: () => void;
};

function getStatText(slot: HydratedInventorySlot) {
  const stats = slot.item.stats;

  if (!stats) {
    return "No combat stats";
  }

  const statEntries = Object.entries(stats).slice(0, 3);

  return statEntries
    .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")} ${value}`)
    .join(" · ");
}

export function StashItemDetailPanel({ slot, onBack }: StashItemDetailPanelProps) {
  if (!slot) {
    return (
      <Panel title="Item Detail" className="p-2">
        <p className="text-xs font-bold uppercase text-zinc-500">
          No item selected
        </p>
      </Panel>
    );
  }

  const fuelPercentage = getInventoryFuelPercentage(
    slot.itemId,
    slot.fuelRemainingSeconds,
  );

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
          Item Detail
        </p>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="h-7 border border-zinc-800 bg-black/60 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
          >
            Back
          </button>
        ) : null}
      </div>

      <Panel className="p-2">
        <div className="grid grid-cols-[3rem_1fr] gap-2">
          <div className="flex h-12 items-center justify-center border border-zinc-800 bg-black text-lg font-black uppercase text-zinc-500">
            {slot.item.name.slice(0, 2)}
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase text-zinc-100">
                  {slot.item.name}
                </p>
                <p className="text-[9px] font-black uppercase text-orange-400">
                  {slot.item.category.replace("_", " ")} · {slot.item.rarity}
                </p>
              </div>

              <p className="shrink-0 text-right text-[9px] font-black uppercase text-zinc-500">
                x{slot.quantity}
              </p>
            </div>

            <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-zinc-500">
              {slot.item.description}
            </p>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1 text-center">
          <div className="border border-zinc-900 bg-black/50 p-1">
            <p className="text-[8px] font-black uppercase text-zinc-600">Value</p>
            <p className="text-[9px] font-black text-orange-400">
              {formatCredits(slot.totalValue)}
            </p>
          </div>

          <div className="border border-zinc-900 bg-black/50 p-1">
            <p className="text-[8px] font-black uppercase text-zinc-600">Weight</p>
            <p className="text-[9px] font-black text-zinc-300">
              {formatWeight(slot.totalWeightKg)}
            </p>
          </div>

          <div className="border border-zinc-900 bg-black/50 p-1">
            <p className="text-[8px] font-black uppercase text-zinc-600">
              {fuelPercentage === null ? "Stack" : "Fuel"}
            </p>
            <p
              className={`text-[9px] font-black ${
                fuelPercentage === null ? "text-zinc-300" : "text-orange-300"
              }`}
            >
              {fuelPercentage === null ? slot.item.maxStack : `${fuelPercentage}%`}
            </p>
          </div>
        </div>

        {fuelPercentage !== null ? (
          <div className="mt-2 h-2 border border-zinc-800 bg-black">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${fuelPercentage}%` }}
            />
          </div>
        ) : null}

        <p className="mt-2 truncate text-[9px] font-bold uppercase text-zinc-600">
          {fuelPercentage === null
            ? getStatText(slot)
            : "Looted fuel containers are always found full"}
        </p>
      </Panel>
    </div>
  );
}
