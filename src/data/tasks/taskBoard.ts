import type { GameTask } from "../../types/tasks";

export const taskBoard: GameTask[] = [
  {
    id: "task_slot_01",
    title: "Task Slot 01",
    issuer: "Unassigned",
    status: "active",
    category: "general",
    summary: "Task details are not configured yet.",
    objectives: [
      {
        label: "Objective placeholder",
        progress: 0,
        required: 1,
      },
    ],
    rewardCredits: 0,
    rewardItemIds: [],
  },
];
