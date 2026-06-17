import type { LastRaidResult } from "../../types/game";
import { Panel } from "../ui/Panel";

type LastRaidPanelProps = {
  raid: LastRaidResult;
};

function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function LastRaidPanel({ raid }: LastRaidPanelProps) {
  const hasRaid = raid.outcome !== "missing";

  return (
    <Panel title="Last Raid" className="p-2">
      <p className="truncate text-xs font-black uppercase text-zinc-100">
        {raid.location}
      </p>

      {hasRaid ? (
        <div className="mt-1 grid grid-cols-3 gap-1 text-[9px] font-bold uppercase text-zinc-500">
          <p>{raid.outcome}</p>
          <p>+{formatCredits(raid.creditsEarned)}</p>
          <p>{raid.itemsFound} items</p>
        </div>
      ) : (
        <p className="mt-1 text-[10px] font-bold uppercase text-zinc-500">
          Deploy from loadout
        </p>
      )}
    </Panel>
  );
}
