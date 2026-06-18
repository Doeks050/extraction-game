import type { RaidLocation } from "../../types/raid";
import { Panel } from "../ui/Panel";
import { LocationCard } from "./LocationCard";

type LocationGridProps = {
  locations: RaidLocation[];
  selectedLocationId: string;
  onSelectLocation: (locationId: string) => void;
};

export function LocationGrid({
  locations,
  selectedLocationId,
  onSelectLocation,
}: LocationGridProps) {
  return (
    <Panel title="Select Location" className="p-2">
      <div className="grid grid-cols-2 gap-2">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            isSelected={selectedLocationId === location.id}
            onSelect={onSelectLocation}
          />
        ))}
      </div>
    </Panel>
  );
}
