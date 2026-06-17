import { hideoutModules } from "./hideoutModules";
import { starterStash } from "./items/stash";
import { currentLoadout } from "./loadout/currentLoadout";
import { operatorProfile } from "./operator";
import { taskBoard } from "./tasks/taskBoard";
import type { GameState } from "../types/state";

export const gameState: GameState = {
  operator: operatorProfile,
  hideoutModules,
  stash: starterStash,
  loadout: currentLoadout,
  tasks: taskBoard,
};
