"use client";

import Link from "next/link";
import { useGameState } from "../state/GameStateProvider";
import { OperatorStatusPanel } from "./OperatorStatusPanel";
import { SkillSection } from "./SkillSection";
import { WeaponMasterySection } from "./WeaponMasterySection";

export function OperatorProfileClient() {
  const { state } = useGameState();

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-2">
      <OperatorStatusPanel operator={state.operator} />

      <div className="min-h-0 overflow-y-auto">
        <div className="grid gap-2 pb-1">
          <SkillSection
            title="Operator Skills"
            skills={state.operator.operatorSkills}
          />
          <SkillSection
            title="Weapon Class Skills"
            skills={state.operator.weaponClassSkills}
          />
          <WeaponMasterySection masteries={state.operator.weaponMasteries} />
        </div>
      </div>

      <Link
        href="/"
        className="block border border-zinc-800 bg-zinc-950 px-3 py-3 text-center text-[10px] font-black uppercase tracking-[0.18em] text-zinc-300 active:border-orange-500/60 active:text-orange-300"
      >
        Back to Hideout
      </Link>
    </div>
  );
}
