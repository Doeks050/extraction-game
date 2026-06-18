import { DeployClient } from "../../components/deploy/DeployClient";
import { GameShell } from "../../components/shell/GameShell";
import { currentLoadout } from "../../data/loadout/currentLoadout";
import { raidLocations } from "../../data/raid/locations";

export default function DeployPage() {
  return (
    <GameShell title="Deploy" eyebrow="Location Select">
      <DeployClient locations={raidLocations} loadout={currentLoadout} />
    </GameShell>
  );
}
