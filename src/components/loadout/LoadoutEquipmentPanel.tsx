import type { OperatorContainer } from "../../types/game";
import type { LoadoutSlot } from "../../types/loadout";
import { getItemById } from "../../lib/items";
import { Panel } from "../ui/Panel";

type LoadoutEquipmentPanelProps = {
  slots: LoadoutSlot[];
  containers: OperatorContainer[];
};

type EquipmentRow = {
  id: string;
  label: string;
  itemName: string;
  meta: string;
  marker: string;
  rightText?: string;
};

function buildSlotRow(slot: LoadoutSlot): EquipmentRow {
  const item = slot.itemId ? getItemById(slot.itemId) : undefined;

  return {
    id: slot.id,
    label: slot.label,
    itemName: item?.name ?? "Empty Slot",
    meta: item?.tags.join(" · ") ?? "Tap to select from stash",
    marker: item ? item.name.slice(0, 2) : "--",
    rightText: slot.quantity ? `x${slot.quantity}` : undefined,
  };
}

function buildContainerRow(container: OperatorContainer): EquipmentRow {
  return {
    id: container.id,
    label: container.id === "medical_pouch" ? "Medical Pouch" : "Pouch",
    itemName: container.name,
    meta: "Standard operator gear · Upgradeable",
    marker: container.id === "medical_pouch" ? "MP" : "PO",
    rightText: `LV ${container.level}`,
  };
}

export function LoadoutEquipmentPanel({ slots, containers }: LoadoutEquipmentPanelProps) {
  const rows = [...slots.map(buildSlotRow), ...containers.map(buildContainerRow)];

  return (
    <Panel className="h-full min-h-0 p-2">
      <div className="grid h-full grid-rows-7 gap-1.5">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid min-h-0 grid-cols-[3rem_1fr_auto] items-center gap-2 border border-zinc-800 bg-black/55 px-2"
          >
            <div className="flex h-11 w-12 items-center justify-center border border-zinc-900 bg-zinc-950 text-sm font-black uppercase text-zinc-500">
              {row.marker}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase leading-4 tracking-[0.16em] text-orange-400">
                {row.label}
              </p>
              <p className="truncate text-[13px] font-black uppercase leading-4 text-zinc-100">
                {row.itemName}
              </p>
              <p className="truncate text-[9px] font-bold uppercase leading-3 text-zinc-500">
                {row.meta}
              </p>
            </div>

            <p className="min-w-8 text-right text-[9px] font-black uppercase text-orange-400">
              {row.rightText ?? ""}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
