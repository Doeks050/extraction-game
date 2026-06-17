import { GameShell } from "../components/shell/GameShell";
import { ActiveTaskPanel } from "../components/hideout/ActiveTaskPanel";
import { HideoutModuleGrid } from "../components/hideout/HideoutModuleGrid";
import { LastRaidPanel } from "../components/hideout/LastRaidPanel";
import { OperatorPanel } from "../components/hideout/OperatorPanel";
import { SkillStrip } from "../components/hideout/SkillStrip";
import { gameState } from "../data/gameState";

export default function HomePage() {
  return (
    <GameShell title="Hideout" eyebrow="Home Base">
      <div className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-2">
        <OperatorPanel operator={gameState.operator} />
        <SkillStrip skills={gameState.operator.skills} />
        <HideoutModuleGrid modules={gameState.hideoutModules} />

        <div className="grid grid-cols-2 gap-2">
          <LastRaidPanel raid={gameState.operator.lastRaid} />
          <ActiveTaskPanel task={gameState.operator.activeTask} />
        </div>
      </div>
    </GameShell>
  );
}
