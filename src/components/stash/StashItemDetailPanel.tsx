import { getInventoryFuelPercentage } from "../../lib/generatorStation";
import type { HydratedInventorySlot } from "../../lib/items";
import { formatWeight } from "../../lib/items";
import { getInventoryFilamentState } from "../../lib/threeDPrinterSupplies";
import { Panel } from "../ui/Panel";

type StashItemDetailPanelProps = {
  slot?: HydratedInventorySlot;
  onBack?: () => void;
};

type DetailStat = {
  label: string;
  value: number;
  displayValue?: string;
};

type StatBarProps = DetailStat;

const categoryLabels = {
  ammo: "Ammo",
  magazine: "Magazine",
  attachment: "Attachment",
  chest_gear: "Chest Gear",
  helmet: "Helmet",
  backpack: "Backpack",
  medical: "Medical",
  valuable: "Valuable",
  hideout_material: "Material",
  data: "Data",
  container: "Container",
  quest: "Quest",
  key: "Key",
  weapon: "Weapon",
};

function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

function StatBar({ label, value, displayValue }: StatBarProps) {
  const safeValue = clampStat(value);

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-zinc-400">
          {label}
        </p>
        <p className="text-[8px] font-black uppercase text-orange-400">
          {displayValue ?? safeValue}
        </p>
      </div>
      <div className="h-1.5 overflow-hidden bg-zinc-900">
        <div className="h-full bg-orange-400" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function getItemImageClassName(slot: HydratedInventorySlot) {
  if (slot.item.id === "tool_toolbox") {
    return "h-[82%] w-[82%] max-h-none max-w-none object-contain object-center opacity-95";
  }

  if (slot.item.gridSize?.width === 1 && slot.item.gridSize?.height === 1) {
    return "h-[88%] w-[88%] max-h-none max-w-none object-contain object-center opacity-95";
  }

  return "h-[88%] w-[88%] max-h-none max-w-none object-contain object-center opacity-95";
}

function getCategoryLabel(slot: HydratedInventorySlot) {
  return categoryLabels[slot.item.category] ?? slot.item.category.replace("_", " ");
}

function getStats(slot: HydratedInventorySlot): DetailStat[] {
  const stats = slot.item.stats ?? {};
  const details: DetailStat[] = [];

  if (stats.armorClass) {
    details.push({
      label: "Armor Class",
      value: stats.armorClass * 20,
      displayValue: `Class ${stats.armorClass}`,
    });
  }

  if (stats.capacity) {
    details.push({
      label: "Storage Capacity",
      value: Math.min(100, stats.capacity * 4),
      displayValue: `${stats.capacity} slots`,
    });
  }

  if (slot.item.filamentPrintCapacity) {
    details.push({
      label: "Print Capacity",
      value: Math.min(100, slot.item.filamentPrintCapacity * 8),
      displayValue: `${slot.item.filamentPrintCapacity} prints`,
    });
  }

  if (slot.item.containerGridSize) {
    details.push({
      label: "Internal Grid",
      value: Math.min(
        100,
        slot.item.containerGridSize.width * slot.item.containerGridSize.height * 10,
      ),
      displayValue: `${slot.item.containerGridSize.width}x${slot.item.containerGridSize.height}`,
    });
  }

  if (details.length === 0) {
    details.push({
      label: "Category",
      value: 50,
      displayValue: getCategoryLabel(slot),
    });
  }

  return details;
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

  const isAmmo = slot.item.category === "ammo";
  const fuelPercentage = getInventoryFuelPercentage(
    slot.itemId,
    slot.fuelRemainingSeconds,
  );
  const filamentState = getInventoryFilamentState(
    slot.itemId,
    slot.filamentPrintsRemaining,
    slot.filamentRemainingUnits,
  );
  const containerCapacity = slot.item.containerGridSize
    ? slot.item.containerGridSize.width * slot.item.containerGridSize.height
    : null;
  const containerUsed = slot.containedSlots?.length ?? 0;
  const detailStats = getStats(slot);

  const resourceLabel =
    fuelPercentage !== null
      ? "Fuel"
      : filamentState
        ? "Prints"
        : containerCapacity !== null
          ? "USB Slots"
          : isAmmo
            ? "Stack"
            : "Type";
  const resourceValue =
    fuelPercentage !== null
      ? `${fuelPercentage}%`
      : filamentState
        ? `${filamentState.filamentPrintsRemaining}/${filamentState.filamentPrintCapacity}`
        : containerCapacity !== null
          ? `${containerUsed}/${containerCapacity}`
          : isAmmo
            ? `${slot.quantity}/${slot.item.maxStack}`
            : getCategoryLabel(slot);
  const progressPercentage =
    fuelPercentage !== null
      ? fuelPercentage
      : filamentState
        ? (filamentState.filamentPrintsRemaining /
            filamentState.filamentPrintCapacity) *
          100
        : containerCapacity
          ? (containerUsed / containerCapacity) * 100
          : null;

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1.15fr_auto_auto_1fr] gap-1.5 overflow-y-auto">
      <div className="flex h-8 items-center justify-between gap-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
            Item Detail
          </p>
          <p className="text-[7px] font-black uppercase text-zinc-600">
            Stash Inventory
          </p>
        </div>
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

      <div className="relative min-h-40 overflow-hidden border border-zinc-800 bg-black/60">
        <div className="absolute inset-1 border border-zinc-900 bg-zinc-950/80" />

        {slot.item.image ? (
          <div className="absolute inset-x-3 bottom-7 top-5 flex items-center justify-center overflow-hidden">
            <img
              src={slot.item.image}
              alt={slot.item.name}
              draggable={false}
              className={getItemImageClassName(slot)}
            />
          </div>
        ) : (
          <div className="relative flex h-full items-center justify-center text-3xl font-black uppercase text-zinc-600">
            {slot.item.name.slice(0, 2)}
          </div>
        )}

        <div className="absolute left-1.5 top-1.5 bg-black/75 px-1.5 py-0.5">
          <p className="text-[9px] font-black uppercase leading-3 text-zinc-100">
            {slot.item.name}
          </p>
        </div>

        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-2 bg-black/80 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-500">
            {getCategoryLabel(slot)}
          </p>
          <p className="text-[10px] font-black uppercase text-orange-400">
            {isAmmo ? `x${slot.quantity}` : slot.item.rarity}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            {isAmmo ? "Quantity" : "Rarity"}
          </p>
          <p className="text-[10px] font-black uppercase leading-3 text-orange-400">
            {isAmmo ? `x${slot.quantity}` : slot.item.rarity}
          </p>
        </div>
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            Weight
          </p>
          <p className="text-[10px] font-black uppercase leading-3 text-zinc-100">
            {formatWeight(slot.totalWeightKg)}
          </p>
        </div>
        <div className="border border-zinc-800 bg-black/55 px-2 py-1">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            {resourceLabel}
          </p>
          <p className="truncate text-[10px] font-black uppercase leading-3 text-zinc-100">
            {resourceValue}
          </p>
        </div>
      </div>

      {progressPercentage !== null ? (
        <div className="h-2 border border-zinc-800 bg-black">
          <div
            className="h-full bg-orange-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      ) : null}

      <div className="border border-zinc-800 bg-black/55 p-2">
        <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
          Description
        </p>
        <p className="mt-1 text-[10px] leading-4 text-zinc-300">
          {slot.item.description}
        </p>
      </div>

      <div className="grid content-start gap-2 border border-zinc-800 bg-black/45 p-2">
        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-300">
          Item Info
        </p>
        {detailStats.map((stat) => (
          <StatBar
            key={stat.label}
            label={stat.label}
            value={stat.value}
            displayValue={stat.displayValue}
          />
        ))}
      </div>
    </div>
  );
}
