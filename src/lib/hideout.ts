import { hideoutModules } from "../data/hideoutModules";
import type { HideoutModule, HideoutModuleStatus } from "../types/game";

export const hideoutStatusLabels: Record<HideoutModuleStatus, string> = {
  idle: "Idle",
  ready: "Ready",
  active: "Active",
  stable: "Stable",
  locked: "Locked",
};

export function getHideoutModuleById(moduleId: string): HideoutModule | undefined {
  return hideoutModules.find((module) => module.id === moduleId);
}

export function getHideoutModuleProgress(module: HideoutModule): number {
  if (module.status === "locked") {
    return 0;
  }

  return Math.min(100, module.level * 20);
}

export function getHideoutModuleRoute(module: HideoutModule): string {
  return `/hideout/${module.id}`;
}
