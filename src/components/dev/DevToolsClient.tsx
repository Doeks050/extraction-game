"use client";

import Link from "next/link";
import { useGameState } from "../state/GameStateProvider";
import { Panel } from "../ui/Panel";
import { DevStatCard } from "./DevStatCard";

export function DevToolsClient() {
  const { state, saveStatus, resetState } = useGameState();

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-2">
      <Panel className="p-2">
        <div className="grid grid-cols-3 gap-2">
          <DevStatCard label="Save" value={saveStatus} />
          <DevStatCard label="Credits" value={state.operator.credits} />
          <DevStatCard label="Level" value={state.operator.level} />
        </div>
      </Panel>

      <Panel title="State Overview" className="p-2">
        <div className="grid grid-cols-4 gap-2">
          <DevStatCard label="Stash" value={state.stash.length} />
          <DevStatCard label="Loadout" value={state.loadout.equipment.length} />
          <DevStatCard label="Modules" value={state.hideoutModules.length} />
          <DevStatCard label="Tasks" value={state.tasks.length} />
        </div>
      </Panel>

      <Panel title="Developer Notes" className="min-h-0 overflow-y-auto p-2">
        <p className="text-xs leading-5 text-zinc-400">
          This page is only a development tool. It is not part of the main
          bottom navigation. Use it to confirm that the save-state foundation is
          connected and to reset local save data during testing.
        </p>
      </Panel>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={resetState}
          className="h-12 border border-red-500/50 bg-red-500/10 text-[10px] font-black uppercase tracking-[0.16em] text-red-300 active:scale-[0.98]"
        >
          Reset Save
        </button>

        <Link
          href="/"
          className="flex h-12 items-center justify-center border border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500/60 active:text-orange-300"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
