import type { WeaponMastery } from "../../types/game";
import { Panel } from "../ui/Panel";
import { SkillProgressBar } from "./SkillProgressBar";

type WeaponMasterySectionProps = {
  masteries: WeaponMastery[];
};

function getProgressPercent(xp: number, maxXp: number) {
  if (maxXp <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((xp / maxXp) * 100));
}

export function WeaponMasterySection({ masteries }: WeaponMasterySectionProps) {
  return (
    <Panel title="Weapon Mastery" className="p-2">
      <div className="grid gap-1.5">
        {masteries.map((mastery) => (
          <SkillProgressBar
            key={mastery.id}
            label={mastery.weaponName}
            progress={getProgressPercent(mastery.xp, mastery.maxXp)}
            description={mastery.description}
            mastered={mastery.isMastered}
          />
        ))}
      </div>
    </Panel>
  );
}
