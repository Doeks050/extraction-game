import type { PlayerSkill } from "../../types/game";
import { Panel } from "../ui/Panel";

type SkillStripProps = {
  skills: PlayerSkill[];
};

export function SkillStrip({ skills }: SkillStripProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {skills.map((skill) => {
        const progress = Math.round((skill.xp / skill.nextXp) * 100);

        return (
          <Panel key={skill.id} className="p-2">
            <div className="flex items-center justify-between gap-1">
              <p className="text-[8px] font-black uppercase text-zinc-500">
                {skill.shortName}
              </p>
              <p className="text-[8px] font-black uppercase text-orange-400">
                Lv {skill.level}
              </p>
            </div>

            <p className="mt-1 truncate text-[10px] font-black uppercase text-zinc-200">
              {skill.name}
            </p>

            <div className="mt-1 h-1 border border-zinc-800 bg-black">
              <div
                className="h-full bg-orange-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
