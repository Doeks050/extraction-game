import { getTraderStockCount } from "../../lib/market";
import type { MarketTrader } from "../../types/market";

type TraderTabsProps = {
  traders: MarketTrader[];
  activeTraderId: string;
  onTraderChange: (traderId: string) => void;
};

export function TraderTabs({
  traders,
  activeTraderId,
  onTraderChange,
}: TraderTabsProps) {
  return (
    <div className={`grid gap-1.5 ${traders.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {traders.map((trader) => {
        const isActive = trader.id === activeTraderId;

        return (
          <button
            key={trader.id}
            type="button"
            disabled={trader.status === "locked"}
            onClick={() => onTraderChange(trader.id)}
            className={[
              "h-12 border p-1.5 text-left active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
              isActive
                ? "border-orange-500 bg-orange-500/15"
                : "border-zinc-800 bg-zinc-950",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-1">
              <p className="truncate text-[10px] font-black uppercase text-zinc-100">
                {trader.name}
              </p>
              <p className="text-[8px] font-black uppercase text-orange-400">
                Lv {trader.reputationLevel}
              </p>
            </div>

            <div className="mt-1 flex items-center justify-between gap-1">
              <p className="truncate text-[8px] font-bold uppercase text-zinc-600">
                {trader.role}
              </p>
              <p className="text-[8px] font-black uppercase text-zinc-500">
                {getTraderStockCount(trader)} offers
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
