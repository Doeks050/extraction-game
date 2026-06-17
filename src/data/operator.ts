import type { OperatorProfile } from "../types/game";

export const operatorProfile: OperatorProfile = {
  name: "Ghostline",
  level: 1,
  rank: "Rookie",
  xp: 120,
  nextXp: 500,
  credits: 12450,
  skills: [
    {
      id: "combat",
      name: "Combat",
      shortName: "CMB",
      level: 1,
      xp: 40,
      nextXp: 100,
    },
    {
      id: "scavenging",
      name: "Scavenging",
      shortName: "SCV",
      level: 1,
      xp: 65,
      nextXp: 100,
    },
    {
      id: "engineering",
      name: "Engineering",
      shortName: "ENG",
      level: 1,
      xp: 20,
      nextXp: 100,
    },
    {
      id: "stealth",
      name: "Stealth",
      shortName: "STL",
      level: 1,
      xp: 15,
      nextXp: 100,
    },
  ],
  lastRaid: {
    location: "No deployment",
    outcome: "missing",
    creditsEarned: 0,
    itemsFound: 0,
    durationMinutes: 0,
  },
  activeTask: {
    title: "Find Supplies",
    trader: "Quartermaster",
    progress: 0,
    required: 3,
    rewardCredits: 2500,
  },
};
