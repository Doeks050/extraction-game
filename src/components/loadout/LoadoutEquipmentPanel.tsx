import type { LoadoutSlot } from "../../types/loadout";
import { Panel } from "../ui/Panel";
import { LoadoutSlotCard } from "./LoadoutSlotCard";

type LoadoutEquipmentPanelProps = {
  slots: LoadoutSlot[];
};

export function LoadoutEquipmentPanel({ slots }: LoadoutEquipmentPanelProps) {
  return (
    <Panel title="Equipment" className="min-h-0 overflow-hidden p-2">
      <div className="grid gap-1.5">
        {slots.map((slot) => (
          <LoadoutSlotCard key={slot.id} slot={slot} />
        ))}
      </div>
    </Panel>
  );
}
