import { GameShell } from "../components/shell/GameShell";
import { Panel } from "../components/ui/Panel";

const modules = [
  { name: "Grow Room", level: 1, status: "Idle" },
  { name: "Workshop", level: 1, status: "Ready" },
  { name: "Generator", level: 1, status: "Stable" },
  { name: "Storage", level: 1, status: "24/40" },
];

export default function HomePage() {
  return (
    <GameShell title="Hideout" eyebrow="Home Base">
      <div className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-2">
        <Panel>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Operator
              </p>
              <h2 className="mt-1 text-lg font-black uppercase">Nick</h2>
              <p className="text-xs font-bold text-zinc-500">Level 1 · Rookie</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Credits
              </p>
              <p className="mt-1 text-lg font-black text-orange-400">12,450</p>
            </div>
          </div>
        </Panel>

        <div className="grid grid-cols-4 gap-2">
          <Panel className="p-2">
            <p className="text-[9px] font-black uppercase text-zinc-500">Combat</p>
            <p className="text-base font-black">1</p>
          </Panel>
          <Panel className="p-2">
            <p className="text-[9px] font-black uppercase text-zinc-500">Scav</p>
            <p className="text-base font-black">1</p>
          </Panel>
          <Panel className="p-2">
            <p className="text-[9px] font-black uppercase text-zinc-500">Eng</p>
            <p className="text-base font-black">1</p>
          </Panel>
          <Panel className="p-2">
            <p className="text-[9px] font-black uppercase text-zinc-500">Stealth</p>
            <p className="text-base font-black">1</p>
          </Panel>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {modules.map((module) => (
            <Panel key={module.name} className="p-2">
              <p className="text-[10px] font-black uppercase text-zinc-100">
                {module.name}
              </p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-400">
                  Lv {module.level}
                </p>
                <p className="text-[9px] font-bold uppercase text-zinc-500">
                  {module.status}
                </p>
              </div>
            </Panel>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Panel title="Last Raid" className="p-2">
            <p className="text-xs font-black uppercase">No raid yet</p>
            <p className="mt-1 text-[10px] text-zinc-500">Deploy from loadout.</p>
          </Panel>

          <Panel title="Active Task" className="p-2">
            <p className="text-xs font-black uppercase">Find supplies</p>
            <p className="mt-1 text-[10px] text-zinc-500">Progress 0/3</p>
          </Panel>
        </div>
      </div>
    </GameShell>
  );
}
