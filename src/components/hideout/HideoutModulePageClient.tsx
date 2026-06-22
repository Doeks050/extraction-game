"use client";

import { startWorkbenchLevelOneInstallation } from "../../lib/hideoutInstallation";
import { startWorkbenchCraft } from "../../lib/workbenchCrafting";
import { useGameState } from "../state/GameStateProvider";
import { HideoutModuleHeader } from "./HideoutModuleHeader";
import { HideoutModuleNavigation } from "./HideoutModuleNavigation";
import { HideoutModuleProductionPanel } from "./HideoutModuleProductionPanel";
import { HideoutModuleUpgradePanel } from "./HideoutModuleUpgradePanel";
import { WorkbenchCraftingPanel } from "./WorkbenchCraftingPanel";
import { WorkbenchInstallationPanel } from "./WorkbenchInstallationPanel";

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

  function handleCraft(recipeId: string) {
    const nextState = startWorkbenchCraft(state, recipeId, Date.now());

    if (nextState) {
      setState(nextState);
    }
  }

  const isWorkbench = module.id === "workshop";
  const isUninstalledWorkbench = isWorkbench && module.level === 0;

  return (
    <div className="grid h-full content-start gap-2 overflow-y-auto">
      <HideoutModuleHeader module={module} />

      {isUninstalledWorkbench ? (
        <WorkbenchInstallationPanel
          module={module}
          stash={state.stash}
          onInstall={handleInstallWorkbench}
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
