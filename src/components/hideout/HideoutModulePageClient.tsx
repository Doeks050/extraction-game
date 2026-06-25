"use client";

import {
  GENERATOR_LEVEL_ONE_DURATION_SECONDS,
  generatorLevelOneRequirements,
} from "../../data/hideout/generatorRequirements";
import {
  GROW_ROOM_LEVEL_ONE_DURATION_SECONDS,
  growRoomLevelOneRequirements,
} from "../../data/hideout/growRoomRequirements";
import {
  MINING_RIG_LEVEL_ONE_DURATION_SECONDS,
  miningRigLevelOneRequirements,
} from "../../data/hideout/miningRigRequirements";
import {
  THREE_D_PRINTER_LEVEL_ONE_DURATION_SECONDS,
  threeDPrinterLevelOneRequirements,
} from "../../data/hideout/threeDPrinterRequirements";
import {
  WORKBENCH_LEVEL_ONE_DURATION_SECONDS,
  workbenchLevelOneRequirements,
} from "../../data/hideout/workbenchRequirements";
import {
  insertGeneratorFuel,
  isGeneratorPowered,
  removeGeneratorFuel,
  toggleGeneratorPower,
} from "../../lib/generatorStation";
import {
  startGeneratorLevelOneInstallation,
  startGrowRoomLevelOneInstallation,
  startMiningRigLevelOneInstallation,
  startThreeDPrinterLevelOneInstallation,
  startWorkbenchLevelOneInstallation,
} from "../../lib/hideoutInstallation";
import { startThreeDPrinterCraft } from "../../lib/threeDPrinterCrafting";
import {
  insertPrinterFilament,
  insertPrinterUsb,
  removePrinterFilament,
  removePrinterUsb,
} from "../../lib/threeDPrinterSupplies";
import { startWorkbenchCraft } from "../../lib/workbenchCrafting";
import { useGameState } from "../state/GameStateProvider";
import { GeneratorStationPanel } from "./GeneratorStationPanel";
import { HideoutInstallationPanel } from "./HideoutInstallationPanel";
import { HideoutModuleNavigation } from "./HideoutModuleNavigation";
import { HideoutModuleProductionPanel } from "./HideoutModuleProductionPanel";
import { HideoutModuleUpgradePanel } from "./HideoutModuleUpgradePanel";
import { ThreeDPrinterCraftingPanel } from "./ThreeDPrinterCraftingPanel";
import { WorkbenchCraftingPanel } from "./WorkbenchCraftingPanel";

type HideoutModulePageClientProps = {
  moduleId: string;
};

export function HideoutModulePageClient({ moduleId }: HideoutModulePageClientProps) {
  const { state, setState } = useGameState();
  const module = state.hideoutModules.find((entry) => entry.id === moduleId);

  if (!module) {
    return null;
  }

  function handleInstallWorkbench() {
    const nextState = startWorkbenchLevelOneInstallation(state, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  function handleInstallGenerator() {
    const nextState = startGeneratorLevelOneInstallation(state, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  function handleInstallGrowRoom() {
    const nextState = startGrowRoomLevelOneInstallation(state, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  function handleInstallThreeDPrinter() {
    const nextState = startThreeDPrinterLevelOneInstallation(state, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  function handleInstallMiningRig() {
    const nextState = startMiningRigLevelOneInstallation(state, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  function handleWorkbenchCraft(recipeId: string) {
    const nextState = startWorkbenchCraft(state, recipeId, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  function handleThreeDPrinterCraft(recipeId: string) {
    const nextState = startThreeDPrinterCraft(state, recipeId, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  function handleInsertPrinterFilament(itemId: string) {
    const nextState = insertPrinterFilament(state, itemId);

    if (nextState) {
      setState(nextState);
    }
  }

  function handleRemovePrinterFilament() {
    const nextState = removePrinterFilament(state);

    if (nextState) {
      setState(nextState);
    }
  }

  function handleInsertPrinterUsb(itemId: string) {
    const nextState = insertPrinterUsb(state, itemId);

    if (nextState) {
      setState(nextState);
    }
  }

  function handleRemovePrinterUsb() {
    const nextState = removePrinterUsb(state);

    if (nextState) {
      setState(nextState);
    }
  }

  function handleInsertGeneratorFuel(slotIndex: number) {
    const nextState = insertGeneratorFuel(state, slotIndex);

    if (nextState) {
      setState(nextState);
    }
  }

  function handleRemoveGeneratorFuel(slotIndex: number) {
    const nextState = removeGeneratorFuel(state, slotIndex);

    if (nextState) {
      setState(nextState);
    }
  }

  function handleToggleGeneratorPower() {
    const nextState = toggleGeneratorPower(state, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  const generatorPoweredOn = isGeneratorPowered(state);
  const isWorkbench = module.id === "workshop";
  const isGenerator = module.id === "generator";
  const isGrowRoom = module.id === "grow_room";
  const isThreeDPrinter = module.id === "three_d_printer";
  const isMiningRig = module.id === "mining_rig";
  const isUninstalledWorkbench = isWorkbench && module.level === 0;
  const isUninstalledGenerator = isGenerator && module.level === 0;
  const isUninstalledGrowRoom = isGrowRoom && module.level === 0;
  const isUninstalledThreeDPrinter = isThreeDPrinter && module.level === 0;
  const isUninstalledMiningRig = isMiningRig && module.level === 0;

  return (
    <div className="grid h-full min-h-0 content-start gap-2 overflow-x-hidden overflow-y-auto overscroll-contain pb-2">
      <div className="flex h-11 items-center justify-between border border-zinc-800 bg-zinc-950 px-3">
        <h1 className="text-lg font-black uppercase tracking-tight text-orange-400">
          {module.name}
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-300">
          Level {module.level}
        </p>
      </div>

      {isUninstalledWorkbench ? (
        <HideoutInstallationPanel
          title="Install Workbench"
          module={module}
          stash={state.stash}
          requirements={workbenchLevelOneRequirements}
          durationSeconds={WORKBENCH_LEVEL_ONE_DURATION_SECONDS}
          onInstall={handleInstallWorkbench}
        />
      ) : isUninstalledGenerator ? (
        <HideoutInstallationPanel
          title="Install Generator"
          module={module}
          stash={state.stash}
          requirements={generatorLevelOneRequirements}
          durationSeconds={GENERATOR_LEVEL_ONE_DURATION_SECONDS}
          onInstall={handleInstallGenerator}
        />
      ) : isUninstalledGrowRoom ? (
        <HideoutInstallationPanel
          title="Install Grow Room"
          module={module}
          stash={state.stash}
          requirements={growRoomLevelOneRequirements}
          durationSeconds={GROW_ROOM_LEVEL_ONE_DURATION_SECONDS}
          onInstall={handleInstallGrowRoom}
        />
      ) : isUninstalledThreeDPrinter ? (
        <HideoutInstallationPanel
          title="Install 3D Printer"
          module={module}
          stash={state.stash}
          requirements={threeDPrinterLevelOneRequirements}
          durationSeconds={THREE_D_PRINTER_LEVEL_ONE_DURATION_SECONDS}
          onInstall={handleInstallThreeDPrinter}
        />
      ) : isUninstalledMiningRig ? (
        <HideoutInstallationPanel
          title="Install Crypto Mining Rig"
          module={module}
          stash={state.stash}
          requirements={miningRigLevelOneRequirements}
          durationSeconds={MINING_RIG_LEVEL_ONE_DURATION_SECONDS}
          onInstall={handleInstallMiningRig}
        />
      ) : isGenerator ? (
        <>
          <GeneratorStationPanel
            module={module}
            stash={state.stash}
            onInsertFuel={handleInsertGeneratorFuel}
            onRemoveFuel={handleRemoveGeneratorFuel}
            onTogglePower={handleToggleGeneratorPower}
          />
          <HideoutModuleUpgradePanel module={module} />
        </>
      ) : isWorkbench ? (
        <>
          <WorkbenchCraftingPanel
            module={module}
            stash={state.stash}
            generatorPoweredOn={generatorPoweredOn}
            onCraft={handleWorkbenchCraft}
          />
          <HideoutModuleUpgradePanel module={module} />
        </>
      ) : isThreeDPrinter ? (
        <>
          <ThreeDPrinterCraftingPanel
            module={module}
            stash={state.stash}
            generatorPoweredOn={generatorPoweredOn}
            onInsertFilament={handleInsertPrinterFilament}
            onRemoveFilament={handleRemovePrinterFilament}
            onInsertUsb={handleInsertPrinterUsb}
            onRemoveUsb={handleRemovePrinterUsb}
            onCraft={handleThreeDPrinterCraft}
          />
          <HideoutModuleUpgradePanel module={module} />
        </>
      ) : (
        <>
          <HideoutModuleProductionPanel module={module} />
          <HideoutModuleUpgradePanel module={module} />
        </>
      )}

      <HideoutModuleNavigation />
    </div>
  );
}
