import Link from "next/link";
import type { OperatorProfile } from "../../types/game";
import { Panel } from "../ui/Panel";

type OperatorPanelProps = {
  operator: OperatorProfile;
  generatorPoweredOn: boolean;
};

function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function OperatorPanel({
  operator,
  generatorPoweredOn,
}: OperatorPanelProps) {
  const xpPercent = Math.round((operator.xp / operator.nextXp) * 100);

  return (
    <Link href="/operator" className="block active:scale-[0.98]">
      <Panel className="p-2">
        <div className="grid grid-cols-[auto_1fr_auto] gap-2">
          <div className="h-12 w-12 border border-orange-500/50 bg-orange-500/10">
            <div className="flex h-full items-center justify-center text-sm font-black uppercase text-orange-300">
              OP
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Operator
            </p>
            <h2 className="truncate text-base font-black uppercase leading-tight text-zinc-100">
              Player Profile
            </h2>
            <p className="text-[10px] font-bold uppercase text-zinc-500">
              Lv. {operator.level} · View skills
            </p>

            <div className="mt-1 h-1.5 border border-zinc-800 bg-black">
              <div
                className="h-full bg-orange-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          <div className="text-right">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Credits
            </p>
            <p className="text-base font-black leading-tight text-orange-400">
              {formatCredits(operator.credits)}
            </p>
            <div
              className={`mt-1 inline-flex items-center gap-1 border px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.12em] ${
                generatorPoweredOn
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-800 bg-black text-zinc-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  generatorPoweredOn ? "bg-emerald-400" : "bg-zinc-700"
                }`}
              />
              Power {generatorPoweredOn ? "On" : "Off"}
            </div>
          </div>
        </div>
      </Panel>
    </Link>
  );
}
