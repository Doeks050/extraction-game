"use client";

import { useMemo, useState } from "react";
import { getTraderItems } from "../../lib/market";
import type { MarketMode, MarketTrader } from "../../types/market";
import { Panel } from "../ui/Panel";
import { MarketActionPanel } from "./MarketActionPanel";
import { MarketItemDetailPanel } from "./MarketItemDetailPanel";
import { MarketItemList } from "./MarketItemList";
import { MarketModeSwitch } from "./MarketModeSwitch";
import { TraderTabs } from "./TraderTabs";

type MarketClientProps = {
  traders: MarketTrader[];
};

export function MarketClient({ traders }: MarketClientProps) {
  const [mode, setMode] = useState<MarketMode>("buy");
  const [activeTraderId, setActiveTraderId] = useState(traders[0]?.id ?? "");

  const activeTrader =
    traders.find((trader) => trader.id === activeTraderId) ?? traders[0];

  const traderItems = useMemo(() => getTraderItems(activeTrader), [activeTrader]);
  const [selectedItemId, setSelectedItemId] = useState(traderItems[0]?.id ?? "");

  const selectedItem =
    traderItems.find((item) => item.id === selectedItemId) ?? traderItems[0];

  function handleTraderChange(traderId: string) {
    const nextTrader = traders.find((trader) => trader.id === traderId);
    const nextItems = nextTrader ? getTraderItems(nextTrader) : [];

    setActiveTraderId(traderId);
    setSelectedItemId(nextItems[0]?.id ?? "");
  }

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr_auto_auto] gap-2">
      <MarketModeSwitch mode={mode} onModeChange={setMode} />
      <TraderTabs
        traders={traders}
        activeTraderId={activeTrader.id}
        onTraderChange={handleTraderChange}
      />

      <Panel title="Trader Stock" className="min-h-0 overflow-hidden p-2">
        {traderItems.length > 0 ? (
          <MarketItemList
            items={traderItems}
            mode={mode}
            selectedItemId={selectedItem?.id ?? ""}
            onSelectItem={setSelectedItemId}
          />
        ) : (
          <p className="text-xs font-bold uppercase text-zinc-500">
            No items available
          </p>
        )}
      </Panel>

      <MarketItemDetailPanel item={selectedItem} mode={mode} trader={activeTrader} />
      <MarketActionPanel mode={mode} />
    </div>
  );
}
