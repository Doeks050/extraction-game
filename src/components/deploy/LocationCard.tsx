import type { RaidLocation } from "../../types/raid";

type LocationCardProps = {
  location: RaidLocation;
  isSelected: boolean;
  onSelect: (locationId: string) => void;
};

const dangerClassNames = {
  low: "text-emerald-300",
  medium: "text-yellow-300",
  high: "text-orange-300",
  extreme: "text-red-300",
};

export function LocationCard({
  location,
  isSelected,
  onSelect,
}: LocationCardProps) {
  const isLocked = location.status === "locked";

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={() => onSelect(location.id)}
      className={[
        "h-24 border bg-black/55 p-2 text-left active:scale-[0.98]",
        isSelected ? "border-orange-500 ring-1 ring-orange-400" : "border-zinc-800",
        isLocked ? "opacity-45" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-black uppercase text-zinc-100">
            {location.name}
          </p>
          <p className="truncate text-[8px] font-black uppercase tracking-[0.14em] text-zinc-600">
            {location.zone}
          </p>
        </div>

        <p
          className={[
            "shrink-0 text-[8px] font-black uppercase",
            dangerClassNames[location.danger],
          ].join(" ")}
        >
          {location.danger}
        </p>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1 text-center">
        <div className="border border-zinc-900 bg-zinc-950/80 p-1">
          <p className="text-[7px] font-black uppercase text-zinc-600">Cost</p>
          <p className="text-[8px] font-black text-orange-400">
            {location.entryCost}
          </p>
        </div>

        <div className="border border-zinc-900 bg-zinc-950/80 p-1">
          <p className="text-[7px] font-black uppercase text-zinc-600">Time</p>
          <p className="text-[8px] font-black text-zinc-300">
            {location.estimatedMinutes}m
          </p>
        </div>

        <div className="border border-zinc-900 bg-zinc-950/80 p-1">
          <p className="text-[7px] font-black uppercase text-zinc-600">Risk</p>
          <p className="text-[8px] font-black text-zinc-300">
            {location.extractionRisk}%
          </p>
        </div>
      </div>

      <p className="mt-1 truncate text-[8px] font-black uppercase text-zinc-600">
        {isLocked ? "Locked" : "Available"}
      </p>
    </button>
  );
}
