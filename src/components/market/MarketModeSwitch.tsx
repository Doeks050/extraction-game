import type { MarketMode } from "../../types/market";

type MarketModeSwitchProps = {
  mode: MarketMode;
  onModeChange: (mode: MarketMode) => void;
};

export function MarketModeSwitch({ mode, onModeChange }: MarketModeSwitchProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {(["buy", "sell"] as const).map((marketMode) => {
        const isActive = mode === marketMode;

        return (
          <button
            key={marketMode}
            type="button"
            onClick={() => onModeChange(marketMode)}
            className={[
              "h-8 border text-[9px] font-black uppercase tracking-[0.18em]",
              isActive
                ? "border-orange-500 bg-orange-500/15 text-orange-300"
                : "border-zinc-800 bg-zinc-950 text-zinc-500 active:border-orange-500/60 active:text-orange-300",
            ].join(" ")}
          >
            {marketMode}
          </button>
        );
      })}
    </div>
  );
}
