"use client";

import { isGeneratorPowered } from "../../lib/generatorStation";
import { useGameState } from "../state/GameStateProvider";
import { ActiveTaskPanel } from "./ActiveTaskPanel";
import { HideoutModuleGrid } from "./HideoutModuleGrid";
import { LastRaidPanel } from "./LastRaidPanel";
import { OperatorPanel } from "./OperatorPanel";

export function HideoutPageClient() {
  const { state } = useGameState();
  const generatorPoweredOn = isGeneratorPowered(state);

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-2">
      <OperatorPanel
        operator={state.operator}
        generatorPoweredOn={generatorPoweredOn}
      />
      <HideoutModuleGrid modules={state.hideoutModules} />

      <div className="grid grid-cols-2 gap-2">
        <LastRaidPanel raid={state.operator.lastRaid} />
        <ActiveTaskPanel task={state.operator.activeTask} />
      </div>
    </div>
  );
}
