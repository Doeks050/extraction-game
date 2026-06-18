export type RaidDangerLevel = "low" | "medium" | "high" | "extreme";

export type RaidLocationStatus = "open" | "locked";

export type RaidLocation = {
  id: string;
  name: string;
  zone: string;
  danger: RaidDangerLevel;
  status: RaidLocationStatus;
  entryCost: number;
  estimatedMinutes: number;
  extractionRisk: number;
  description: string;
  lootFocus: string[];
  recommendedGear: string[];
};
