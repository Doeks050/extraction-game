"use client";

import {
  GENERATOR_ROOM_BACKGROUND_IMAGE,
  getGeneratorFuelSlotCount,
} from "../../data/hideout/generatorConfig";
import {
  GENERATOR_FUEL_ITEM_ID,
  getFuelPercentage,
} from "../../lib/generatorStation";
import { countInventoryItem } from "../../lib/hideoutInstallation";
import { getItemById } from "../../lib/items";
import type { HideoutModule } from "../../types/game";
import type { InventorySlot } from "../../types/items";
import { ItemImage } from "../items/ItemImage";

type GeneratorStationPanelProps = {
  module: HideoutModule;
  stash: InventorySlot[];
  onInsertFuel: (slotIndex: number) => void;
  onRemoveFuel: (slotIndex: number) => void;
  onTogglePower: () => void;
};

function formatFuelTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function GeneratorStationPanel({
  module,
  stash,
  onInsertFuel,
  onRemoveFuel,
  onTogglePower,
}: GeneratorStationPanelProps) {
  const defaultFuelItem = getItemById(GENERATOR_FUEL_ITEM_ID);
  const slotCount = getGeneratorFuelSlotCount(module.level);
  const fuelSlots = Array.from(
    { length: slotCount },
    (_, index) => module.generatorFuelSlots?.[index] ?? null,
  );
  const poweredOn = Boolean(module.generatorPoweredOn);
  const loadedCount = fuelSlots.filter(Boolean).length;
  const fuelInStash = countInventoryItem(stash, GENERATOR_FUEL_ITEM_ID);
  const activeFuel = fuelSlots.find(
    (slot) => slot && slot.fuelRemainingSeconds > 0,
  );
  const fuelPercentage = activeFuel
    ? getFuelPercentage(
        activeFuel.fuelRemainingSeconds,
        activeFuel.fuelCapacitySeconds,
      )
    : 0;
  const canTurnOn = Boolean(activeFuel);

  return (
    <section className="relative min-h-[520px] overflow-hidden border border-zinc-800 bg-zinc-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${GENERATOR_ROOM_BACKGROUND_IMAGE}")`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/90"
      />

      <div className="relative z-10 flex min-h-[520px] flex-col">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-black/72 px-3 py-2 backdrop-blur-sm">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Generator Status
            </p>
            <p
              className={`mt-0.5 text-sm font-black uppercase ${
                poweredOn ? "text-emerald-300" : "text-zinc-300"
              }`}
            >
              {poweredOn ? "Online" : "Offline"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Fuel Remaining
            </p>
            <p
              className={`mt-0.5 text-sm font-black ${
                fuelPercentage > 0 ? "text-orange-300" : "text-zinc-600"
              }`}
            >
              {fuelPercentage}%
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-end justify-center px-3 pb-4">
          <div className="w-full max-w-[310px] border border-zinc-800 bg-black/70 px-3 py-2 text-center backdrop-blur-sm">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Output
            </p>
            <p className="mt-1 text-xs font-black uppercase text-zinc-100">
              {poweredOn ? "Hideout power active" : module.detail}
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 bg-zinc-950/94 p-3 backdrop-blur-sm">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-300">
                Fuel Slot
              </p>
              <p className="mt-0.5 text-[8px] font-bold uppercase text-zinc-600">
                Level {module.level} capacity · {loadedCount}/{slotCount}
              </p>
            </div>
            <p className="text-[8px] font-black uppercase text-zinc-500">
              Stash: {fuelInStash}
            </p>
          </div>

          <div className="grid gap-2">
            {fuelSlots.map((fuelSlot, slotIndex) => {
              const isFilled = Boolean(fuelSlot);
              const slotDisabled = poweredOn || (!isFilled && fuelInStash <= 0);
              const fuelItem = fuelSlot
                ? getItemById(fuelSlot.itemId)
                : defaultFuelItem;
              const slotFuelPercentage = fuelSlot
                ? getFuelPercentage(
                    fuelSlot.fuelRemainingSeconds,
                    fuelSlot.fuelCapacitySeconds,
                  )
                : 0;

              return (
                <button
                  key={slotIndex}
                  type="button"
                  disabled={slotDisabled}
                  onClick={() =>
                    isFilled ? onRemoveFuel(slotIndex) : onInsertFuel(slotIndex)
                  }
                  className={`relative min-h-28 overflow-hidden border p-2 text-left transition active:scale-[0.98] ${
                    isFilled
                      ? "border-orange-500/55 bg-orange-500/8"
                      : "border-zinc-700 bg-black/65"
                  } ${slotDisabled ? "cursor-not-allowed opacity-65" : "cursor-pointer"}`}
                >
                  <span className="absolute left-2 top-1.5 text-[7px] font-black uppercase tracking-[0.16em] text-zinc-600">
                    Fuel Slot {slotIndex + 1}
                  </span>

                  {fuelSlot && fuelItem ? (
                    <div className="mt-3 grid grid-cols-[60px_1fr] items-center gap-3">
                      <ItemImage
                        src={fuelItem.image}
                        alt={fuelItem.name}
                        fallback="FJ"
                        className="h-16 w-14"
                        imageClassName="p-0.5"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[10px] font-black uppercase text-zinc-100">
                            {fuelItem.name}
                          </p>
                          <p className="shrink-0 text-sm font-black text-orange-300">
                            {slotFuelPercentage}%
                          </p>
                        </div>

                        <div className="mt-1.5 h-2 border border-zinc-800 bg-black">
                          <div
                            className="h-full bg-orange-500 transition-[width] duration-500"
                            style={{ width: `${slotFuelPercentage}%` }}
                          />
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-2 text-[7px] font-black uppercase">
                          <span className="text-zinc-500">
                            {formatFuelTime(fuelSlot.fuelRemainingSeconds)} remaining
                          </span>
                          <span className="text-zinc-600">
                            {poweredOn ? "Running" : "Tap to remove"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex h-20 items-center justify-center border border-dashed border-zinc-800 bg-black/35 text-center">
                      <div>
                        <p className="text-[9px] font-black uppercase text-zinc-400">
                          Empty Fuel Slot
                        </p>
                        <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                          {fuelInStash > 0
                            ? "Tap to insert Jerrycan"
                            : "No Jerrycan in stash"}
                        </p>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!poweredOn && !canTurnOn}
            onClick={onTogglePower}
            className={`mt-3 h-12 w-full border text-[11px] font-black uppercase tracking-[0.2em] transition active:scale-[0.99] ${
              poweredOn
                ? "border-red-500/70 bg-red-500/12 text-red-300"
                : canTurnOn
                  ? "border-emerald-500/70 bg-emerald-500/12 text-emerald-300"
                  : "cursor-not-allowed border-zinc-800 bg-black text-zinc-700"
            }`}
          >
            {poweredOn ? "Turn Off" : "Turn On"}
          </button>
        </div>
      </div>
    </section>
  );
}
