import { notFound } from "next/navigation";
import { HideoutModuleHeader } from "../../../components/hideout/HideoutModuleHeader";
import { HideoutModuleNavigation } from "../../../components/hideout/HideoutModuleNavigation";
import { HideoutModuleProductionPanel } from "../../../components/hideout/HideoutModuleProductionPanel";
import { HideoutModuleUpgradePanel } from "../../../components/hideout/HideoutModuleUpgradePanel";
import { GameShell } from "../../../components/shell/GameShell";
import { hideoutModules } from "../../../data/hideoutModules";
import { getHideoutModuleById } from "../../../lib/hideout";

type HideoutModulePageProps = {
  params: Promise<{
    moduleId: string;
  }>;
};

export function generateStaticParams() {
  return hideoutModules.map((module) => ({
    moduleId: module.id,
  }));
}

export default async function HideoutModulePage({
  params,
}: HideoutModulePageProps) {
  const { moduleId } = await params;
  const module = getHideoutModuleById(moduleId);

  if (!module) {
    notFound();
  }

  return (
    <GameShell title={module.name} eyebrow="Hideout Module">
      <div className="grid h-full grid-rows-[auto_auto_auto_1fr] gap-2 overflow-y-auto">
        <HideoutModuleHeader module={module} />
        <HideoutModuleProductionPanel module={module} />
        <HideoutModuleUpgradePanel module={module} />
        <HideoutModuleNavigation />
      </div>
    </GameShell>
  );
}
