"use client";

import { startWorkbenchLevelOneInstallation } from "../../lib/hideoutInstallation";
import { useGameState } from "../state/GameStateProvider";
import { HideoutModuleHeader } from "./HideoutModuleHeader";
import { HideoutModuleNavigation } from "./HideoutModuleNavigation";
import { HideoutModuleProductionPanel } from "./HideoutModuleProductionPanel";
import { HideoutModuleUpgradePanel } from "./HideoutModuleUpgradePanel";
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

  const isUninstalledWorkbench = module.id === "workshop" && module.level === 0;

  return (
    <div className="grid h-full grid-rows-[auto_auto_auto_1fr] gap-2 overflow-y-auto">
      <HideoutModuleHeader module={module} />

      {isUninstalledWorkbench ? (
        <WorkbenchInstallationPanel
          module={module}
          stash={state.stash}
          onInstall={handleInstallWorkbench}
        />
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
