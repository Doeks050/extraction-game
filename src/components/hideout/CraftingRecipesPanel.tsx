"use client";

import { useEffect, useMemo, useState } from "react";
import { countInventoryItem } from "../../lib/hideoutInstallation";
import { getItemById } from "../../lib/items";
import type { HideoutCraftingRecipe } from "../../types/hideoutCrafting";
import type { HideoutModule } from "../../types/game";
import type { GameItem, InventorySlot } from "../../types/items";
import { ItemImage } from "../items/ItemImage";
import { Panel } from "../ui/Panel";

type CraftingRecipesPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  recipes: HideoutCraftingRecipe[];
  onCraft: (recipeId: string) => void;
};

type RecipeItemTileProps = {
  item: GameItem;
  quantity: number;
  owned?: number;
  complete?: boolean;
  isOutput?: boolean;
};

type ClockButtonProps = {
  seconds: number;
  disabled: boolean;
  active: boolean;
  ready: boolean;
  onClick: () => void;
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
  isOutput = false,
}: RecipeItemTileProps) {
  const borderClass = isOutput
    ? "border-orange-500/45"
    : complete
      ? "border-emerald-500/55"
      : "border-red-500/55";
  const quantityClass = isOutput
    ? "text-orange-300"
    : complete
      ? "text-emerald-400"
      : "text-red-400";

  return (
    <div
      title={item.name}
      className={`min-w-0 overflow-hidden border bg-black/60 p-1 ${borderClass}`}
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
      <p className={`text-center text-[8px] font-black ${quantityClass}`}>
        {owned === undefined ? `x${quantity}` : `${owned}/${quantity}`}
      </p>
    </div>
  );
}

function ClockButton({
  seconds,
  disabled,
  active,
  ready,
  onClick,
}: ClockButtonProps) {
  const visualClass = active
    ? "border-orange-500/70 bg-orange-500/15 text-orange-300"
    : ready
      ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-300 active:scale-[0.96]"
      : "border-zinc-800 bg-zinc-950/80 text-zinc-600";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={active ? "Crafting in progress" : "Start crafting"}
      title={active ? "Crafting in progress" : ready ? "Start crafting" : "Requirements not met"}
      className={`flex w-16 shrink-0 flex-col items-center justify-center border px-1 py-2 ${visualClass}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 fill-none stroke-current stroke-2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <span className="mt-1 text-[9px] font-black">{formatTime(seconds)}</span>
    </button>
  );
}

function getRecipeItems(recipe: HideoutCraftingRecipe) {
  const inputs = recipe.inputs.flatMap((input) => {
    const item = getItemById(input.itemId);
    return item ? [{ ...input, item }] : [];
  });
  const outputItem = getItemById(recipe.output.itemId);

  return { inputs, outputItem };
}

export function CraftingRecipesPanel({
  module,
  stash,
  recipes,
  onCraft,
}: CraftingRecipesPanelProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());

    if (!module.craftingEndsAt) {
      return;
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [module.craftingEndsAt]);

  const resolvedRecipes = useMemo(
    () =>
      recipes.map((recipe) => ({
        recipe,
        ...getRecipeItems(recipe),
      })),
    [recipes],
  );

  return (
    <Panel
      title="Crafting Recipes"
      titleClassName="text-orange-300"
      className="min-w-0 p-2"
    >
      <div className="grid min-w-0 gap-2">
        {resolvedRecipes.map(({ recipe, inputs, outputItem }) => {
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
          const recipeReady = !levelLocked && hasItems;
          const recipeClass = isActive
            ? "border-orange-500/70 bg-orange-500/10"
            : recipeReady
              ? "border-emerald-500/60 bg-emerald-500/10"
              : "border-zinc-800 bg-black/35";

          return (
            <div
              key={recipe.id}
              className={`min-w-0 overflow-hidden border p-2 ${recipeClass}`}
            >
              <p
                className={`mb-2 truncate text-[9px] font-black uppercase tracking-[0.12em] ${
                  isActive
                    ? "text-orange-300"
                    : recipeReady
                      ? "text-emerald-300"
                      : "text-zinc-500"
                }`}
              >
                {recipe.name}
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                {requirements.map((input) => (
                  <RecipeItemTile
                    key={input.itemId}
                    item={input.item}
                    quantity={input.quantity}
                    owned={isActive ? input.quantity : input.owned}
                    complete={input.complete}
                  />
                ))}
              </div>

              <div className="mt-2 flex min-w-0 items-stretch justify-end gap-2">
                <ClockButton
                  seconds={remainingSeconds}
                  disabled={!canCraft}
                  active={isActive}
                  ready={canCraft}
                  onClick={() => onCraft(recipe.id)}
                />

                <div className="flex shrink-0 items-center text-lg font-black text-orange-400">
                  =
                </div>

                <div className="w-20 shrink-0">
                  <RecipeItemTile
                    item={outputItem}
                    quantity={recipe.output.quantity}
                    isOutput
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
