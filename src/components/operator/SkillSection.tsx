import type { SkillProgress } from "../../types/game";
import { Panel } from "../ui/Panel";
import { SkillProgressBar } from "./SkillProgressBar";

type SkillSectionProps = {
  title: string;
  skills: SkillProgress[];
};

function getProgressPercent(xp: number, maxXp: number) {
  if (maxXp <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((xp / maxXp) * 100));
}

export function SkillSection({ title, skills }: SkillSectionProps) {
  return (
    <Panel title={title} className="p-2">
      <div className="grid gap-1.5">
        {skills.map((skill) => (
          <SkillProgressBar
            key={skill.id}
            label={skill.name}
            level={skill.level}
            progress={getProgressPercent(skill.xp, skill.nextXp)}
            description={skill.description}
          />
        ))}
      </div>
    </Panel>
  );
}
