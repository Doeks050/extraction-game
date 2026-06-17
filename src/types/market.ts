import type { ItemCategory } from "./items";

export type MarketMode = "buy" | "sell";

export type TraderStatus = "available" | "locked";

export type MarketTrader = {
  id: string;
  name: string;
  role: string;
  status: TraderStatus;
  reputationLevel: number;
  categoryFilters: ItemCategory[];
  description: string;
};
