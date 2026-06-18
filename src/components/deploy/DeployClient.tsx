"use client";

import { useState } from "react";
import { calculateLoadoutStats } from "../../lib/loadout";
import type { CurrentLoadout } from "../../types/loadout";
import type { RaidLocation } from "../../types/raid";
import { DeployLoadoutPanel } from "./DeployLoadoutPanel";
import { LocationDetailPanel } from "./LocationDetailPanel";
import { LocationGrid } from "./LocationGrid";

type DeployClientProps = {
  locations: RaidLocation[];
  loadout: CurrentLoadout;
};

export function DeployClient({ locations, loadout }: DeployClientProps) {
  const firstOpenLocation =
    locations.find((location) => location.status === "open") ?? locations[0];

  const [selectedLocationId, setSelectedLocationId] = useState(
    firstOpenLocation.id,
  );

  const selectedLocation =
    locations.find((location) => location.id === selectedLocationId) ??
    firstOpenLocation;

  const stats = calculateLoadoutStats(loadout);
  const canDeploy = stats.readinessScore >= 55;

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-2">
      <DeployLoadoutPanel stats={stats} />

      <LocationGrid
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={setSelectedLocationId}
      />

      <LocationDetailPanel location={selectedLocation} canDeploy={canDeploy} />
    </div>
  );
}
