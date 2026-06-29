import { gameItems } from "../data/items/items";
import { getWeaponClassFromTags } from "../data/weapons/weaponClasses";
import type { GameItem } from "../types/items";
import type { MarketMode, MarketTrader } from "../types/market";

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleItems(items: GameItem[], random: () => number) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function getTraderStockRange(trader: MarketTrader, poolSize: number) {
  const maxStockSize = Math.max(0, Math.min(trader.stockSize, poolSize));
  const configuredMinStockSize = trader.minStockSize ?? maxStockSize;
  const minStockSize = Math.max(
    0,
    Math.min(configuredMinStockSize, maxStockSize),
  );

  return {
    min: minStockSize,
    max: maxStockSize,
  };
}

function getRandomStockSize(
  trader: MarketTrader,
  poolSize: number,
  random: () => number,
) {
  const stockRange = getTraderStockRange(trader, poolSize);

  if (stockRange.max <= stockRange.min) {
    return stockRange.max;
  }

  return stockRange.min + Math.floor(random() * (stockRange.max - stockRange.min + 1));
}

function isPistol(item: GameItem) {
  return getWeaponClassFromTags(item.tags)?.id === "pistol";
}

function pickSparseWeaponStock(
  shuffled: GameItem[],
  stockSize: number,
): GameItem[] {
  if (stockSize !== 2) {
    return shuffled.slice(0, stockSize);
  }

  const pistol = shuffled.find(isPistol);
  const longGun = shuffled.find((item) => !isPistol(item));

  if (!pistol || !longGun) {
    return shuffled.slice(0, stockSize);
  }

  return shuffled.indexOf(pistol) < shuffled.indexOf(longGun)
    ? [pistol, longGun]
    : [longGun, pistol];
}

export function getTraderRotationId(trader: MarketTrader, now: number) {
  const refreshMilliseconds = Math.max(1, trader.refreshSeconds) * 1000;
  return Math.floor(now / refreshMilliseconds);
}

export function getTraderRotationKey(trader: MarketTrader, now: number) {
  return `${trader.id}:${getTraderRotationId(trader, now)}`;
}

export function getTraderRefreshRemainingSeconds(
  trader: MarketTrader,
  now: number,
) {
  const refreshMilliseconds = Math.max(1, trader.refreshSeconds) * 1000;
  const elapsed = now % refreshMilliseconds;
  return Math.max(0, Math.ceil((refreshMilliseconds - elapsed) / 1000));
}

export function formatMarketRefreshTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getTraderItemPool(trader: MarketTrader): GameItem[] {
  const configuredIds = new Set(trader.stockItemIds);

  return gameItems.filter(
    (item) =>
      configuredIds.has(item.id) &&
      trader.categoryFilters.includes(item.category),
  );
}

export function getTraderItems(
  trader: MarketTrader,
  now = 0,
): GameItem[] {
  const pool = getTraderItemPool(trader);
  const rotationId = getTraderRotationId(trader, now);
  const random = createRandom(hashString(`${trader.id}:${rotationId}`));
  const stockSize = getRandomStockSize(trader, pool.length, random);
  const shuffled = shuffleItems(pool, random);

  if (trader.kind === "weapon") {
    return pickSparseWeaponStock(shuffled, stockSize);
  }

  return shuffled.slice(0, stockSize);
}

export function getMarketItemValue(item: GameItem, mode: MarketMode = "buy") {
  if (mode === "sell") {
    return Math.round(item.value * 0.55);
  }

  return item.value;
}

export function getTraderStockCount(trader: MarketTrader) {
  return Math.min(trader.stockSize, getTraderItemPool(trader).length);
}

export function getTraderStockLabel(trader: MarketTrader) {
  const poolSize = getTraderItemPool(trader).length;
  const stockRange = getTraderStockRange(trader, poolSize);

  if (stockRange.min === stockRange.max) {
    return `${stockRange.max}`;
  }

  return `${stockRange.min}-${stockRange.max}`;
}
