"use client";

import { useEffect, useMemo, useState } from "react";
import {
  WORKBENCH_LEVEL_ONE_DURATION_SECONDS,
  workbenchLevelOneRequirements,
} from "../../data/hideout/workbenchRequirements";
import { countInventoryItem } from "../../lib/hideoutInstallation";
import { getItemById } from "../../lib/items";
import type { HideoutModule } from "../../types/game";
import type { InventorySlot } from "../../types/items";
import { ItemImage } from "../items/ItemImage";
import { Panel } from "../ui/Panel";

type Props = {
  module: HideoutModule;
  stash: InventorySlot[];
  onInstall: () => void;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function fallback(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function WorkbenchInstallationPanel({ module, stash, onInstall }: Props) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (!module.installationEndsAt) return;

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [module.installationEndsAt]);

  const requirements = useMemo(
    () =>
      workbenchLevelOneRequirements.flatMap((requirement) => {
        const item = getItemById(requirement.itemId);
        return item
          ? [{ ...requirement, item, owned: countInventoryItem(stash, requirement.itemId) }]
          : [];
      }),
    [stash],
  );

  const isInstalling = Boolean(module.installationEndsAt);
  const canInstall = requirements.every((entry) => entry.owned >= entry.quantity);
  const remaining =
    module.installationEndsAt && now !== null
      ? Math.max(0, Math.ceil((module.installationEndsAt - now) / 1000))
      : null;

  return (
    <Panel title="Install Workbench" className="p-2">
      <div className="grid grid-cols-4 gap-1.5">
        {requirements.map((entry) => {
          const complete = entry.owned >= entry.quantity;

          return (
            <div
              key={entry.itemId}
              className={`min-w-0 border bg-black/55 p-1 ${
                complete ? "border-emerald-500/45" : "border-red-500/45"
              }`}
            >
              <ItemImage
                src={entry.item.image}
                alt={entry.item.name}
                fallback={fallback(entry.item.name)}
                className="h-12 w-full"
                imageClassName="p-0.5 opacity-100"
              />
              <p className="mt-1 truncate text-center text-[7px] font-black uppercase text-zinc-300">
                {entry.item.name}
              </p>
              <p className={`text-center text-[9px] font-black ${
                complete ? "text-emerald-400" : "text-red-400"
              }`}>
                {entry.owned}/{entry.quantity}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2 border-t border-zinc-800 pt-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Installation time
          </p>
          <p className="mt-0.5 text-sm font-black text-zinc-100">
            {isInstalling
              ? remaining === null
                ? "Starting..."
                : formatTime(remaining)
              : formatTime(WORKBENCH_LEVEL_ONE_DURATION_SECONDS)}
          </p>
        </div>

        <button
          type="button"
          disabled={isInstalling || !canInstall}
          onClick={onInstall}
          className={`h-12 min-w-28 border px-3 text-[9px] font-black uppercase tracking-[0.14em] ${
            isInstalling || !canInstall
              ? "border-zinc-800 bg-zinc-950 text-zinc-600"
              : "border-orange-500/60 bg-orange-500/15 text-orange-300 active:scale-[0.98]"
          }`}
        >
          {isInstalling
            ? remaining === null
              ? "Installing"
              : formatTime(remaining)
            : canInstall
              ? "Install"
              : "Missing Items"}
        </button>
      </div>
    </Panel>
  );
}
