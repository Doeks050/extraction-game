export type TaskStatus = "active" | "available" | "completed";

export type TaskCategory = "general" | "trader" | "daily" | "weekly";

export type TaskObjective = {
  label: string;
  progress: number;
  required: number;
};

export type GameTask = {
  id: string;
  title: string;
  issuer: string;
  status: TaskStatus;
  category: TaskCategory;
  summary: string;
  objectives: TaskObjective[];
  rewardCredits: number;
  rewardItemIds: string[];
};
