import type { ItemCategory } from "./items";

export type MarketMode = "buy" | "sell";

export type TraderStatus = "available" | "locked";

export type MarketTraderKind = "weapon" | "black_market" | "general";

export type MarketTrader = {
  id: string;
  name: string;
  role: string;
  kind: MarketTraderKind;
  status: TraderStatus;
  reputationLevel: number;
  categoryFilters: ItemCategory[];
  description: string;
  stockItemIds: string[];
  stockSize: number;
  refreshSeconds: number;
};
