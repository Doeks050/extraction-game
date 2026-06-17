import type { MarketMode } from "../../types/market";

type MarketActionPanelProps = {
  mode: MarketMode;
};

export function MarketActionPanel({ mode }: MarketActionPanelProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-2">
      <button
        type="button"
        disabled
        className="h-11 border border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600"
      >
        {mode === "buy" ? "Buy Later" : "Sell Later"}
      </button>

      <button
        type="button"
        disabled
        className="h-11 border border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600"
      >
        Inspect Later
      </button>
    </div>
  );
}
