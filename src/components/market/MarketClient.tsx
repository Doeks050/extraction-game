"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCredits } from "../../lib/items";
import {
  formatMarketRefreshTime,
  getMarketItemValue,
  getTraderItems,
  getTraderRefreshRemainingSeconds,
  getTraderRotationKey,
} from "../../lib/market";
import type { MarketTrader } from "../../types/market";
import { useGameState } from "../state/GameStateProvider";
import { Panel } from "../ui/Panel";
import { MarketWeaponDetailPanel } from "./MarketWeaponDetailPanel";
import { MarketWeaponGrid } from "./MarketWeaponGrid";
import { TraderTabs } from "./TraderTabs";

type MarketClientProps = {
  traders: MarketTrader[];
};

export function MarketClient({ traders }: MarketClientProps) {
  const { state, setState } = useGameState();
  const [now, setNow] = useState<number | null>(null);
  const [activeTraderId, setActiveTraderId] = useState(traders[0]?.id ?? "");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const activeTrader =
    traders.find((trader) => trader.id === activeTraderId) ?? traders[0];

  useEffect(() => {
    setNow(Date.now());
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const traderItems = useMemo(
    () => (activeTrader && now !== null ? getTraderItems(activeTrader, now) : []),
    [activeTrader, now],
  );
  const rotationKey =
    activeTrader && now !== null
      ? getTraderRotationKey(activeTrader, now)
      : "loading";
  const refreshRemaining =
    activeTrader && now !== null
      ? getTraderRefreshRemainingSeconds(activeTrader, now)
      : 0;
  const soldItemIds = useMemo(() => {
    if (rotationKey === "loading") {
      return new Set<string>();
    }

    const prefix = `${rotationKey}:`;
    return new Set(
      (state.marketPurchaseKeys ?? [])
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.slice(prefix.length)),
    );
  }, [rotationKey, state.marketPurchaseKeys]);
  const selectedItem = selectedItemId
    ? traderItems.find((item) => item.id === selectedItemId)
    : undefined;

  useEffect(() => {
    setSelectedItemId(null);
    setPurchaseMessage(null);
  }, [activeTraderId, rotationKey]);

  if (!activeTrader) {
    return (
      <Panel className="p-3">
        <p className="text-xs font-black uppercase text-zinc-500">
          No traders available
        </p>
      </Panel>
    );
  }

  function handleTraderChange(traderId: string) {
    setActiveTraderId(traderId);
    setSelectedItemId(null);
    setPurchaseMessage(null);
  }

  function handleSelectItem(itemId: string) {
    setSelectedItemId(itemId);
    setPurchaseMessage(null);
  }

  function handleBuy() {
    if (!selectedItem || now === null) {
      return;
    }

    const price = getMarketItemValue(selectedItem);
    const purchaseKey = `${rotationKey}:${selectedItem.id}`;

    if (
      soldItemIds.has(selectedItem.id) ||
      state.operator.credits < price
    ) {
      return;
    }

    const retainedPurchaseKeys = (state.marketPurchaseKeys ?? []).filter(
      (key) =>
        !key.startsWith(`${activeTrader.id}:`) ||
        key.startsWith(`${rotationKey}:`),
    );

    setState({
      ...state,
      operator: {
        ...state.operator,
        credits: state.operator.credits - price,
      },
      stash: [
        ...state.stash,
        {
          slotId: `market_${Date.now()}_${selectedItem.id}`,
          itemId: selectedItem.id,
          quantity: 1,
          currentDurability: 100,
        },
      ],
      marketPurchaseKeys: [...retainedPurchaseKeys, purchaseKey].slice(-100),
    });
    setPurchaseMessage("Purchased · sent to stash");
  }

  if (selectedItem) {
    return (
      <MarketWeaponDetailPanel
        item={selectedItem}
        trader={activeTrader}
        credits={state.operator.credits}
        isSold={soldItemIds.has(selectedItem.id)}
        purchaseMessage={purchaseMessage}
        onBack={() => {
          setSelectedItemId(null);
          setPurchaseMessage(null);
        }}
        onBuy={handleBuy}
      />
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-2">
      <TraderTabs
        traders={traders}
        activeTraderId={activeTrader.id}
        onTraderChange={handleTraderChange}
      />

      <div className="grid grid-cols-[1fr_auto] items-center gap-2 border border-zinc-800 bg-zinc-950 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-black uppercase text-zinc-100">
            {activeTrader.name}
          </p>
          <p className="mt-0.5 truncate text-[7px] font-bold uppercase text-zinc-600">
            {activeTrader.description}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[7px] font-black uppercase tracking-[0.12em] text-zinc-600">
            Refresh
          </p>
          <p className="text-[11px] font-black text-cyan-300">
            {now === null ? "--:--" : formatMarketRefreshTime(refreshRemaining)}
          </p>
          <p className="mt-0.5 text-[7px] font-black uppercase text-orange-400">
            {formatCredits(state.operator.credits)} CR
          </p>
        </div>
      </div>

      <Panel
        title="Weapon Trader Stash"
        titleClassName="text-orange-300"
        className="min-h-0 overflow-y-auto p-2"
      >
        <p className="mb-2 text-[7px] font-black uppercase tracking-[0.12em] text-zinc-600">
          Tap a weapon to inspect the offer
        </p>

        {now === null ? (
          <p className="py-8 text-center text-[9px] font-black uppercase text-zinc-600">
            Loading trader stock
          </p>
        ) : traderItems.length > 0 ? (
          <MarketWeaponGrid
            items={traderItems}
            soldItemIds={soldItemIds}
            onSelectItem={handleSelectItem}
          />
        ) : (
          <p className="py-8 text-center text-[9px] font-black uppercase text-zinc-600">
            No weapons available
          </p>
        )}
      </Panel>
    </div>
  );
}
