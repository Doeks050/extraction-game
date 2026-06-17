import { gameItems } from "../data/items/items";
import type { GameItem } from "../types/items";
import type { MarketMode, MarketTrader } from "../types/market";

export function getTraderItems(trader: MarketTrader): GameItem[] {
  return gameItems.filter((item) => trader.categoryFilters.includes(item.category));
}

export function getMarketItemValue(item: GameItem, mode: MarketMode) {
  if (mode === "sell") {
    return Math.round(item.value * 0.55);
  }

  return item.value;
}

export function getTraderStockCount(trader: MarketTrader) {
  return getTraderItems(trader).length;
}
