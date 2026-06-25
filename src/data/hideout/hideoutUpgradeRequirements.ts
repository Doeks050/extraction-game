import { generatorLevelOneRequirements } from "./generatorRequirements";
import { growRoomLevelOneRequirements } from "./growRoomRequirements";
import { miningRigLevelOneRequirements } from "./miningRigRequirements";
import { threeDPrinterLevelOneRequirements } from "./threeDPrinterRequirements";
import {
  workbenchLevelOneRequirements,
  type HideoutItemRequirement,
} from "./workbenchRequirements";
import type { HideoutModule } from "../../types/game";

const requirementsByModuleAndCurrentLevel: Record<
  string,
  Record<number, HideoutItemRequirement[]>
> = {
  workshop: {
    0: workbenchLevelOneRequirements,
  },
  generator: {
    0: generatorLevelOneRequirements,
  },
  grow_room: {
    0: growRoomLevelOneRequirements,
  },
  three_d_printer: {
    0: threeDPrinterLevelOneRequirements,
  },
  mining_rig: {
    0: miningRigLevelOneRequirements,
  },
};

export function getHideoutUpgradeRequirements(module: HideoutModule) {
  return requirementsByModuleAndCurrentLevel[module.id]?.[module.level] ?? [];
}
