export type PlayerSkill = {
  id: string;
  name: string;
  shortName: string;
  level: number;
  xp: number;
  nextXp: number;
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
  name: string;
  level: number;
  rank: string;
  xp: number;
  nextXp: number;
  credits: number;
  skills: PlayerSkill[];
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
};
