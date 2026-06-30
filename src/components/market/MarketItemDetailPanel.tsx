import { formatCredits, formatWeight, getItemById } from "../../lib/items";
import { getMarketItemValue } from "../../lib/market";
import type { GameItem } from "../../types/items";
import type { MarketMode, MarketTrader } from "../../types/market";
import { Panel } from "../ui/Panel";

type MarketItemDetailPanelProps = {
  item?: GameItem;
  mode: MarketMode;
  trader: MarketTrader;
};

function getPrimaryStatText(item: GameItem) {
  if (!item.stats) {
    return "No stats";
  }

  return Object.entries(item.stats)
    .slice(0, 3)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")} ${value}`)
    .join(" · ");
}

function getCompatibilityText(item: GameItem) {
  if (!item.compatibleWeaponIds?.length) {
    return null;
  }

  const weaponNames = item.compatibleWeaponIds
    .map((weaponId) => getItemById(weaponId)?.name ?? weaponId)
    .join(" · ");

  return `Fits: ${weaponNames}`;
}

function getAmmoCompatibilityText(item: GameItem) {
  if (!item.compatibleAmmoCaliber && !item.compatibleAmmoIds?.length) {
    return null;
  }

  const ammoNames = item.compatibleAmmoIds?.length
    ? item.compatibleAmmoIds
        .map((ammoId) => getItemById(ammoId)?.name ?? ammoId)
        .join(" · ")
    : item.compatibleAmmoCaliber;

  return `Ammo: ${item.compatibleAmmoCaliber ?? "Any"} · ${ammoNames}`;
}

export function MarketItemDetailPanel({
  item,
  mode,
  trader,
}: MarketItemDetailPanelProps) {
  if (!item) {
    return (
      <Panel title="Trader Detail" className="p-2">
        <p className="text-xs font-bold uppercase text-zinc-500">
          No item selected
        </p>
      </Panel>
    );
  }

  const value = getMarketItemValue(item, mode);
  const compatibilityText = getCompatibilityText(item);
  const ammoCompatibilityText = getAmmoCompatibilityText(item);

  return (
    <Panel title="Trader Detail" className="p-2">
      <div className="grid grid-cols-[3rem_1fr_auto] gap-2">
        <div className="flex h-12 items-center justify-center border border-zinc-800 bg-black text-lg font-black uppercase text-zinc-500">
          {item.name.slice(0, 2)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black uppercase text-zinc-100">
            {item.name}
          </p>
          <p className="text-[9px] font-black uppercase text-orange-400">
            {trader.name} · {mode}
          </p>
          <p className="line-clamp-2 text-[10px] leading-4 text-zinc-500">
            {item.description}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[8px] font-black uppercase text-zinc-600">
            Price
          </p>
          <p className="text-sm font-black text-orange-400">
            {formatCredits(value)}
          </p>
          <p className="text-[8px] font-black uppercase text-zinc-600">cr</p>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1 text-center">
        <div className="border border-zinc-900 bg-black/50 p-1">
          <p className="text-[8px] font-black uppercase text-zinc-600">Weight</p>
          <p className="text-[9px] font-black text-zinc-300">
            {formatWeight(item.weightKg)}
          </p>
        </div>

        <div className="border border-zinc-900 bg-black/50 p-1">
          <p className="text-[8px] font-black uppercase text-zinc-600">Stack</p>
          <p className="text-[9px] font-black text-zinc-300">
            {item.maxStack}
          </p>
        </div>

        <div className="border border-zinc-900 bg-black/50 p-1">
          <p className="text-[8px] font-black uppercase text-zinc-600">Rarity</p>
          <p className="text-[9px] font-black uppercase text-zinc-300">
            {item.rarity}
          </p>
        </div>
      </div>

      <p className="mt-2 truncate text-[9px] font-bold uppercase text-zinc-600">
        {getPrimaryStatText(item)}
      </p>

      {ammoCompatibilityText ? (
        <p className="mt-1 truncate text-[9px] font-bold uppercase text-orange-300">
          {ammoCompatibilityText}
        </p>
      ) : null}

      {compatibilityText ? (
        <p className="mt-1 truncate text-[9px] font-bold uppercase text-zinc-500">
          {compatibilityText}
        </p>
      ) : null}
    </Panel>
  );
}
