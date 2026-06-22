"use client";

import { useEffect, useMemo, useState } from "react";
import {
  workbenchRecipes,
  type WorkbenchRecipe,
} from "../../data/hideout/workbenchRecipes";
import { countInventoryItem } from "../../lib/hideoutInstallation";
import { getItemById } from "../../lib/items";
import type { HideoutModule } from "../../types/game";
import type { GameItem, InventorySlot } from "../../types/items";
import { ItemImage } from "../items/ItemImage";
import { Panel } from "../ui/Panel";

type WorkbenchCraftingPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  onCraft: (recipeId: string) => void;
};

type RecipeItemTileProps = {
  item: GameItem;
  quantity: number;
  owned?: number;
  complete?: boolean;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getFallback(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

function RecipeItemTile({
  item,
  quantity,
  owned,
  complete = true,
}: RecipeItemTileProps) {
  return (
    <div
      title={item.name}
      className={`w-14 shrink-0 border bg-black/60 p-1 ${
        complete ? "border-zinc-700" : "border-red-500/55"
      }`}
    >
      <ItemImage
        src={item.image}
        alt={item.name}
        fallback={getFallback(item.name)}
        className="h-10 w-full"
        imageClassName="p-0.5 opacity-100"
      />
      <p className="mt-0.5 truncate text-center text-[7px] font-black uppercase text-zinc-300">
        {item.name}
      </p>
      <p
        className={`text-center text-[8px] font-black ${
          complete ? "text-orange-300" : "text-red-400"
        }`}
      >
        {owned === undefined ? `x${quantity}` : `${owned}/${quantity}`}
      </p>
    </div>
  );
}

function ClockTile({ seconds }: { seconds: number }) {
  return (
    <div className="flex w-14 shrink-0 flex-col items-center justify-center border border-zinc-800 bg-zinc-950/80 px-1 py-2">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 fill-none stroke-zinc-400 stroke-2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <span className="mt-1 text-[9px] font-black text-zinc-300">
        {formatTime(seconds)}
      </span>
    </div>
  );
}

function getRecipeItems(recipe: WorkbenchRecipe) {
  const inputs = recipe.inputs.flatMap((input) => {
    const item = getItemById(input.itemId);
    return item ? [{ ...input, item }] : [];
  });
  const outputItem = getItemById(recipe.output.itemId);

  return { inputs, outputItem };
}

export function WorkbenchCraftingPanel({
  module,
  stash,
  onCraft,
}: WorkbenchCraftingPanelProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());

    if (!module.craftingEndsAt) {
      return;
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [module.craftingEndsAt]);

  const recipes = useMemo(
    () =>
      workbenchRecipes.map((recipe) => ({
        recipe,
        ...getRecipeItems(recipe),
      })),
    [],
  );

  return (
    <Panel title="Crafting Recipes" className="p-2">
      <div className="grid gap-2">
        {recipes.map(({ recipe, inputs, outputItem }) => {
          if (!outputItem || inputs.length !== recipe.inputs.length) {
            return null;
          }

          const isActive = module.craftingRecipeId === recipe.id;
          const isBusy = Boolean(module.craftingRecipeId || module.craftingEndsAt);
          const levelLocked = module.level < recipe.requiredLevel;
          const requirements = inputs.map((input) => {
            const owned = countInventoryItem(stash, input.itemId);
            return {
              ...input,
              owned,
              complete: isActive || owned >= input.quantity,
            };
          });
          const hasItems = requirements.every((input) => input.complete);
          const remainingSeconds =
            isActive && module.craftingEndsAt && now !== null
              ? Math.max(0, Math.ceil((module.craftingEndsAt - now) / 1000))
              : recipe.durationSeconds;
          const canCraft = !isBusy && !levelLocked && hasItems;

          return (
            <div
              key={recipe.id}
              className={`border p-2 ${
                isActive
                  ? "border-orange-500/60 bg-orange-500/5"
                  : "border-zinc-800 bg-black/35"
              }`}
            >
              <div className="flex items-center gap-1 overflow-hidden">
                <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
                  {requirements.map((input, index) => (
                    <div key={input.itemId} className="flex items-center gap-1">
                      {index > 0 ? (
                        <span className="text-sm font-black text-zinc-600">+</span>
                      ) : null}
                      <RecipeItemTile
                        item={input.item}
                        quantity={input.quantity}
                        owned={isActive ? input.quantity : input.owned}
                        complete={input.complete}
                      />
                    </div>
                  ))}
                </div>

                <ClockTile seconds={remainingSeconds} />
                <span className="shrink-0 text-lg font-black text-orange-400">=</span>
                <RecipeItemTile
                  item={outputItem}
                  quantity={recipe.output.quantity}
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 border-t border-zinc-800 pt-2">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black uppercase text-zinc-100">
                    {recipe.name}
                  </p>
                  <p className="text-[8px] font-bold uppercase text-zinc-600">
                    Workbench Level {recipe.requiredLevel}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!canCraft}
                  onClick={() => onCraft(recipe.id)}
                  className={`h-10 min-w-24 border px-3 text-[9px] font-black uppercase tracking-[0.12em] ${
                    canCraft
                      ? "border-orange-500/60 bg-orange-500/15 text-orange-300 active:scale-[0.98]"
                      : "border-zinc-800 bg-zinc-950 text-zinc-600"
                  }`}
                >
                  {isActive
                    ? formatTime(remainingSeconds)
                    : levelLocked
                      ? `Level ${recipe.requiredLevel}`
                      : isBusy
                        ? "Workbench Busy"
                        : hasItems
                          ? "Craft"
                          : "Missing Items"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
