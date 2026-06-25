export type SkillProgress = {
  id: string;
  name: string;
  shortName: string;
  level: number;
  xp: number;
  nextXp: number;
  description: string;
};

export type OperatorSkill = SkillProgress;
export type PlayerSkill = OperatorSkill;

export type WeaponClassSkill = SkillProgress;

export type WeaponMastery = {
  id: string;
  weaponId: string;
  weaponName: string;
  xp: number;
  maxXp: number;
  isMastered: boolean;
  description: string;
};

export type OperatorContainer = {
  id: "normal_pouch" | "medical_pouch";
  name: string;
  level: number;
  isStandard: boolean;
  description: string;
};

export type LastRaidResult = {
  location: string;
  outcome: "extracted" | "dead" | "missing";
  creditsEarned: number;
  itemsFound: number;
  durationMinutes: number;
};

export type ActiveTask = {
  title: string;
  trader: string;
  progress: number;
  required: number;
  rewardCredits: number;
};

export type OperatorProfile = {
  level: number;
  rank: string;
  xp: number;
  nextXp: number;
  credits: number;
  containers: OperatorContainer[];
  operatorSkills: OperatorSkill[];
  weaponClassSkills: WeaponClassSkill[];
  weaponMasteries: WeaponMastery[];
  lastRaid: LastRaidResult;
  activeTask: ActiveTask;
};

export type HideoutModuleStatus =
  | "idle"
  | "ready"
  | "active"
  | "stable"
  | "locked";

export type HideoutModule = {
  id: string;
  name: string;
  level: number;
  status: HideoutModuleStatus;
  detail: string;
  installationEndsAt?: number;
  installationTargetLevel?: number;
  craftingRecipeId?: string;
  craftingEndsAt?: number;
  generatorFuelSlots?: Array<string | null>;
  generatorPoweredOn?: boolean;
};