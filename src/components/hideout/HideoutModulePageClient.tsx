"use client";

import {
  GENERATOR_LEVEL_ONE_DURATION_SECONDS,
  generatorLevelOneRequirements,
} from "../../data/hideout/generatorRequirements";
import {
  WORKBENCH_LEVEL_ONE_DURATION_SECONDS,
  workbenchLevelOneRequirements,
} from "../../data/hideout/workbenchRequirements";
import {
  startGeneratorLevelOneInstallation,
  startWorkbenchLevelOneInstallation,
} from "../../lib/hideoutInstallation";
import { startWorkbenchCraft } from "../../lib/workbenchCrafting";
import { useGameState } from "../state/GameStateProvider";
import { HideoutInstallationPanel } from "./HideoutInstallationPanel";
import { HideoutModuleHeader } from "./HideoutModuleHeader";
import { HideoutModuleNavigation } from "./HideoutModuleNavigation";
import { HideoutModuleProductionPanel } from "./HideoutModuleProductionPanel";
import { HideoutModuleUpgradePanel } from "./HideoutModuleUpgradePanel";
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

  function handleCraft(recipeId: string) {
    const nextState = startWorkbenchCraft(state, recipeId, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  const isWorkbench = module.id === "workshop";
  const isGenerator = module.id === "generator";
  const isUninstalledWorkbench = isWorkbench && module.level === 0;
  const isUninstalledGenerator = isGenerator && module.level === 0;

  return (
    <div className="grid h-full content-start gap-2 overflow-y-auto">
      <HideoutModuleHeader module={module} />

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
      ) : isWorkbench ? (
        <>
          <WorkbenchCraftingPanel
            module={module}
            stash={state.stash}
            onCraft={handleCraft}
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
