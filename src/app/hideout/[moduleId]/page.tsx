import { notFound } from "next/navigation";
import { HideoutModulePageClient } from "../../../components/hideout/HideoutModulePageClient";
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
  const moduleDefinition = getHideoutModuleById(moduleId);

  if (!moduleDefinition) {
    notFound();
  }

  return (
    <GameShell title={moduleDefinition.name} showHeader={false}>
      <HideoutModulePageClient moduleId={moduleId} />
    </GameShell>
  );
}
