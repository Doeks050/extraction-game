"use client";

import { useGameState } from "./GameStateProvider";

const statusLabels = {
  loading: "Loading",
  ready: "Saved",
  error: "Error",
};

export function SaveStatusPill() {
  const { saveStatus } = useGameState();

  return (
    <div className="border border-orange-500/50 bg-orange-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-orange-300">
      {statusLabels[saveStatus]}
    </div>
  );
}
