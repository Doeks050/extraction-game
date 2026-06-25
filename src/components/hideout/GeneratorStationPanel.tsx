"use client";

import { GENERATOR_FUEL_ITEM_ID } from "../../lib/generatorStation";
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

function GeneratorMachine({ poweredOn }: { poweredOn: boolean }) {
  return (
    <div className="relative mx-auto mt-7 h-48 w-[82%] max-w-[310px]">
      <div className="absolute left-4 top-4 h-32 w-4 border border-zinc-700 bg-zinc-900 shadow-[0_0_18px_rgba(0,0,0,0.9)]" />
      <div className="absolute right-4 top-4 h-32 w-4 border border-zinc-700 bg-zinc-900 shadow-[0_0_18px_rgba(0,0,0,0.9)]" />

      <div className="absolute inset-x-8 top-3 h-36 border border-zinc-700 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-[0_16px_28px_rgba(0,0,0,0.85)]">
        <div className="absolute inset-x-3 top-3 flex h-8 items-center justify-between border border-zinc-700 bg-black/80 px-2">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Power Unit
          </span>
          <span
            className={`h-2.5 w-2.5 rounded-full border ${
              poweredOn
                ? "border-emerald-300 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.95)]"
                : "border-red-900 bg-red-950"
            }`}
          />
        </div>

        <div className="absolute bottom-4 left-3 right-3 grid grid-cols-6 gap-1">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className={`h-1 border border-zinc-800 ${
                poweredOn && index % 5 === 0 ? "bg-orange-500/60" : "bg-zinc-950"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-12 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full border-4 border-zinc-700 bg-black shadow-inner">
          <div
            className={`absolute inset-2 rounded-full border border-zinc-700 ${
              poweredOn
                ? "bg-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                : "bg-zinc-950"
            }`}
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-10 right-10 h-5 border border-zinc-700 bg-zinc-900" />
      <div className="absolute bottom-0 left-14 h-7 w-5 border border-zinc-700 bg-zinc-950" />
      <div className="absolute bottom-0 right-14 h-7 w-5 border border-zinc-700 bg-zinc-950" />
    </div>
  );
}

export function GeneratorStationPanel({
  module,
  stash,
  onInsertFuel,
  onRemoveFuel,
  onTogglePower,
}: GeneratorStationPanelProps) {
  const fuelItem = getItemById(GENERATOR_FUEL_ITEM_ID);
  const fuelSlots = [
    module.generatorFuelSlots?.[0] ?? null,
    module.generatorFuelSlots?.[1] ?? null,
  ];
  const poweredOn = Boolean(module.generatorPoweredOn);
  const loadedCount = fuelSlots.filter(Boolean).length;
  const fuelInStash = countInventoryItem(stash, GENERATOR_FUEL_ITEM_ID);
  const canTurnOn = loadedCount > 0;

  return (
    <section className="relative min-h-[520px] overflow-hidden border border-zinc-800 bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(87,83,78,0.2),transparent_28%),linear-gradient(180deg,rgba(10,10,10,0.25),rgba(0,0,0,0.95)),linear-gradient(90deg,#050505_0%,#111_18%,#070707_50%,#111_82%,#050505_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-16 border-b border-zinc-800/80 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(82,82,91,0.28)_39px,rgba(82,82,91,0.28)_41px)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[190px] left-0 right-0 h-px bg-zinc-800"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[190px] left-0 right-0 h-32 bg-[linear-gradient(135deg,rgba(39,39,42,0.14)_25%,transparent_25%,transparent_50%,rgba(39,39,42,0.14)_50%,rgba(39,39,42,0.14)_75%,transparent_75%,transparent)] bg-[length:24px_24px]"
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
              Fuel Loaded
            </p>
            <p className="mt-0.5 text-sm font-black text-orange-300">
              {loadedCount} / 2
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 px-3 pt-1">
          <GeneratorMachine poweredOn={poweredOn} />

          <div className="mx-auto mt-1 max-w-[310px] border border-zinc-800 bg-black/65 px-3 py-2 text-center backdrop-blur-sm">
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
                Fuel Slots
              </p>
              <p className="mt-0.5 text-[8px] font-bold uppercase text-zinc-600">
                Level 1 capacity
              </p>
            </div>
            <p className="text-[8px] font-black uppercase text-zinc-500">
              Stash: {fuelInStash}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {fuelSlots.map((itemId, slotIndex) => {
              const isFilled = Boolean(itemId);
              const slotDisabled = poweredOn || (!isFilled && fuelInStash <= 0);

              return (
                <button
                  key={slotIndex}
                  type="button"
                  disabled={slotDisabled}
                  onClick={() =>
                    isFilled ? onRemoveFuel(slotIndex) : onInsertFuel(slotIndex)
                  }
                  className={`relative min-h-24 overflow-hidden border p-2 text-left transition active:scale-[0.98] ${
                    isFilled
                      ? "border-orange-500/55 bg-orange-500/8"
                      : "border-zinc-700 bg-black/65"
                  } ${slotDisabled ? "cursor-not-allowed opacity-65" : "cursor-pointer"}`}
                >
                  <span className="absolute left-2 top-1.5 text-[7px] font-black uppercase tracking-[0.16em] text-zinc-600">
                    Slot {slotIndex + 1}
                  </span>

                  {isFilled && fuelItem ? (
                    <div className="mt-3 grid grid-cols-[52px_1fr] items-center gap-2">
                      <ItemImage
                        src={fuelItem.image}
                        alt={fuelItem.name}
                        fallback="FJ"
                        className="h-14 w-12"
                        imageClassName="p-0.5"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[9px] font-black uppercase text-zinc-100">
                          {fuelItem.name}
                        </p>
                        <p className="mt-1 text-[8px] font-black uppercase text-orange-300">
                          60 min fuel
                        </p>
                        <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                          {poweredOn ? "Generator running" : "Tap to remove"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex h-16 items-center justify-center border border-dashed border-zinc-800 bg-black/35 text-center">
                      <div>
                        <p className="text-[9px] font-black uppercase text-zinc-400">
                          Empty Fuel Slot
                        </p>
                        <p className="mt-1 text-[7px] font-bold uppercase text-zinc-600">
                          {fuelInStash > 0 ? "Tap to insert Jerrycan" : "No Jerrycan in stash"}
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
