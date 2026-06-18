import Link from "next/link";
import type { RaidLocation } from "../../types/raid";
import { Panel } from "../ui/Panel";

type LocationDetailPanelProps = {
  location: RaidLocation;
  canDeploy: boolean;
};

export function LocationDetailPanel({
  location,
  canDeploy,
}: LocationDetailPanelProps) {
  const isLocked = location.status === "locked";

  return (
    <Panel className="p-2">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div className="min-w-0">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-600">
            Selected Route
          </p>
          <p className="truncate text-sm font-black uppercase text-zinc-100">
            {location.name}
          </p>
          <p className="line-clamp-2 text-[10px] leading-4 text-zinc-500">
            {location.description}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Entry
          </p>
          <p className="text-sm font-black text-orange-400">
            {location.entryCost}
          </p>
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Credits
          </p>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="border border-zinc-900 bg-black/50 p-1.5">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Loot Focus
          </p>
          <p className="truncate text-[9px] font-bold uppercase text-zinc-300">
            {location.lootFocus.join(" · ")}
          </p>
        </div>

        <div className="border border-zinc-900 bg-black/50 p-1.5">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Recommended
          </p>
          <p className="truncate text-[9px] font-bold uppercase text-zinc-300">
            {location.recommendedGear.join(" · ")}
          </p>
        </div>
      </div>

      <Link
        href={canDeploy && !isLocked ? `/raid?location=${location.id}` : "#"}
        className={[
          "mt-2 block h-12 border text-center active:scale-[0.99]",
          canDeploy && !isLocked
            ? "border-orange-500/70 bg-orange-500/20 shadow-[0_0_18px_rgba(249,115,22,0.22)]"
            : "pointer-events-none border-zinc-800 bg-zinc-950 opacity-50",
        ].join(" ")}
      >
        <p className="pt-2 text-xl font-black uppercase tracking-[0.22em] text-orange-200">
          Start Raid
        </p>
        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-orange-500">
          Text raid engine next
        </p>
      </Link>
    </Panel>
  );
}
