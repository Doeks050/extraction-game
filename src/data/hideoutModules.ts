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
    id: "three_d_printer",
    name: "3D Printer",
    level: 0,
    status: "locked",
    detail: "Not installed",
  },
  {
    id: "mining_rig",
    name: "Crypto Mining Rig",
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