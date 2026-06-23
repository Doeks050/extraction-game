import type { HideoutModule } from "../types/game";

export const hideoutModules: HideoutModule[] = [
  {
    id: "workshop",
    name: "Workbench",
    level: 0,
    status: "locked",
    detail: "Not installed",
  },
  {
    id: "generator",
    name: "Generator",
    level: 0,
    status: "locked",
    detail: "Not installed",
  },
  {
    id: "grow_room",
    name: "Grow Room",
    level: 0,
    status: "locked",
    detail: "Not installed",
  },
  {
    id: "storage",
    name: "Storage",
    level: 1,
    status: "active",
    detail: "24 / 40 slots",
  },
];