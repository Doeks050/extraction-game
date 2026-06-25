import type { HideoutModule, OperatorProfile } from "./game";
import type { InventorySlot } from "./items";
import type { CurrentLoadout } from "./loadout";
import type { GameTask } from "./tasks";

export type GameState = {
  operator: OperatorProfile;
  hideoutModules: HideoutModule[];
  stash: InventorySlot[];
  loadout: CurrentLoadout;
  tasks: GameTask[];
  contentMigrationVersion?: number;
};