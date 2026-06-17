import { GameShell } from "../components/shell/GameShell";
import { ActiveTaskPanel } from "../components/hideout/ActiveTaskPanel";
import { HideoutModuleGrid } from "../components/hideout/HideoutModuleGrid";
import { LastRaidPanel } from "../components/hideout/LastRaidPanel";
import { OperatorPanel } from "../components/hideout/OperatorPanel";
import { SkillStrip } from "../components/hideout/SkillStrip";
import { hideoutModules } from "../data/hideoutModules";
import { operatorProfile } from "../data/operator";

export default function HomePage() {
  return (
    <GameShell title="Hideout" eyebrow="Home Base">
      <div className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-2">
        <OperatorPanel operator={operatorProfile} />
        <SkillStrip skills={operatorProfile.skills} />
        <HideoutModuleGrid modules={hideoutModules} />

        <div className="grid grid-cols-2 gap-2">
          <LastRaidPanel raid={operatorProfile.lastRaid} />
          <ActiveTaskPanel task={operatorProfile.activeTask} />
        </div>
      </div>
    </GameShell>
  );
}
