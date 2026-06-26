"use client";

import { getThreeDPrinterRecipeById } from "../../data/hideout/threeDPrinterRecipes";
import { getItemById, type HydratedInventorySlot } from "../../lib/items";
import { ItemImage } from "../items/ItemImage";

type UsbBlueprintDetailPanelProps = {
  slot: HydratedInventorySlot;
  onClose: () => void;
  onMoveToStash: () => void;
};

const rarityTextClassNames = {
  common: "text-zinc-300",
  uncommon: "text-emerald-300",
  rare: "text-sky-300",
  epic: "text-purple-300",
  legendary: "text-orange-300",
};

export function UsbBlueprintDetailPanel({
  slot,
  onClose,
  onMoveToStash,
}: UsbBlueprintDetailPanelProps) {
  const blueprintOutputs = (slot.item.printerRecipeIds ?? []).map((recipeId) => {
    const recipe = getThreeDPrinterRecipeById(recipeId);
    const outputItem = recipe ? getItemById(recipe.output.itemId) : undefined;

    return {
      id: recipeId,
      name: outputItem?.name ?? recipe?.name ?? recipeId.replaceAll("_", " "),
      image: outputItem?.image,
      rarity: outputItem?.rarity,
      quantity: recipe?.output.quantity ?? 1,
    };
  });

  return (
    <div className="absolute inset-0 z-30 overflow-y-auto bg-black/90 p-2">
      <div className="grid min-h-full content-start gap-2 border border-zinc-700 bg-zinc-950 p-2">
        <div className="flex h-8 items-center justify-between gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">
            USB Blueprint Data
          </p>

          <button
            type="button"
            onClick={onClose}
            className="h-7 border border-zinc-800 bg-black/60 px-3 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-300 active:border-orange-500 active:text-orange-300"
          >
            Back
          </button>
        </div>

        <div className="relative h-40 overflow-hidden border border-zinc-800 bg-black/60">
          <div className="absolute inset-1 border border-zinc-900 bg-zinc-950/80" />

          <ItemImage
            src={slot.item.image}
            alt={slot.item.name}
            fallback={slot.item.name.slice(0, 2)}
            className="absolute inset-x-8 bottom-8 top-5 flex items-center justify-center"
            imageClassName="p-2 opacity-95"
          />

          <div className="absolute left-1.5 top-1.5 bg-black/75 px-1.5 py-0.5">
            <p className="text-[9px] font-black uppercase leading-3 text-zinc-100">
              {slot.item.name}
            </p>
          </div>

          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-2 bg-black/75 px-2 py-1">
            <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-500">
              Recipe USB
            </p>
            <p
              className={`text-[7px] font-black uppercase tracking-[0.14em] ${rarityTextClassNames[slot.item.rarity]}`}
            >
              {slot.item.rarity}
            </p>
          </div>
        </div>

        <div className="border border-zinc-800 bg-black/55 p-2">
          <p className="text-[7px] font-black uppercase tracking-[0.14em] text-zinc-600">
            Description
          </p>
          <p className="mt-1 text-[10px] leading-4 text-zinc-300">
            Contains fabrication blueprints and can be used with the 3D Printer.
          </p>
        </div>

        <div className="border border-zinc-800 bg-black/45 p-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-cyan-300">
              Stored Blueprints
            </p>
            <p className="text-[7px] font-black uppercase text-zinc-600">
              {blueprintOutputs.length} total
            </p>
          </div>

          {blueprintOutputs.length > 0 ? (
            <div className="mt-2 grid gap-1.5">
              {blueprintOutputs.map((output) => (
                <div
                  key={output.id}
                  className="grid min-h-12 grid-cols-[42px_1fr_auto] items-center gap-2 border border-zinc-800 bg-zinc-950/80 p-1.5"
                >
                  <ItemImage
                    src={output.image}
                    alt={output.name}
                    fallback={output.name.slice(0, 2)}
                    className="h-9 w-10"
                    imageClassName="p-0.5"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-[8px] font-black uppercase text-zinc-100">
                      {output.name}
                    </p>
                    {output.rarity ? (
                      <p
                        className={`mt-0.5 text-[6px] font-black uppercase ${rarityTextClassNames[output.rarity]}`}
                      >
                        {output.rarity} blueprint
                      </p>
                    ) : null}
                  </div>

                  <p className="text-[8px] font-black uppercase text-orange-300">
                    x{output.quantity}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 border border-zinc-800 bg-zinc-950/80 py-4 text-center text-[8px] font-black uppercase text-zinc-600">
              No blueprints stored
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onMoveToStash}
          className="h-10 w-full border border-orange-500/55 bg-orange-500/10 text-[8px] font-black uppercase tracking-[0.14em] text-orange-300 active:bg-orange-500/20"
        >
          Move USB to Main Stash
        </button>
      </div>
    </div>
  );
}
