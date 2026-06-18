import Link from "next/link";
import { GameShell } from "../../components/shell/GameShell";
import { Panel } from "../../components/ui/Panel";

export default function RaidPage() {
  return (
    <GameShell title="Active Raid" eyebrow="Deployment">
      <div className="grid h-full grid-rows-[1fr_auto] gap-2">
        <Panel title="Raid Engine" className="p-3">
          <div className="flex h-full flex-col justify-center">
            <p className="text-xl font-black uppercase text-orange-400">
              Raid initialized
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              The text-based raid engine, loot events, combat events and
              extraction choices will be built in the next phase.
            </p>
          </div>
        </Panel>

        <Link
          href="/loadout"
          className="block border border-zinc-800 bg-zinc-950 px-3 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-zinc-300 active:border-orange-500/60 active:text-orange-300"
        >
          Return to Loadout
        </Link>
      </div>
    </GameShell>
  );
}
