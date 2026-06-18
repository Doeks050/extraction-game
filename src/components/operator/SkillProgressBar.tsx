type SkillProgressBarProps = {
  label: string;
  level?: number;
  progress: number;
  description: string;
  mastered?: boolean;
};

export function SkillProgressBar({
  label,
  level,
  progress,
  description,
  mastered = false,
}: SkillProgressBarProps) {
  return (
    <div className="border border-zinc-800 bg-black/55 p-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-black uppercase text-zinc-100">
            {label}
          </p>
          <p className="mt-0.5 truncate text-[8px] font-bold uppercase text-zinc-600">
            {description}
          </p>
        </div>

        <p className="shrink-0 text-[9px] font-black uppercase text-orange-400">
          {mastered ? "Mastered" : level ? `Lv ${level}` : "Mastery"}
        </p>
      </div>

      <div className="mt-2 h-1.5 border border-zinc-800 bg-black">
        <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
