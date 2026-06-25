import type { HideoutModule } from "../types/game";

export const hideoutModules: HideoutModule[] = [
  {
    id: "workshop",
    name: "Workbench",
    level: 1,
    status: "ready",
    detail: "Crafting ready",
  },
  {
    id: "generator",
    name: "Generator",
    level: 1,
    status: "idle",
    detail: "No fuel",
    generatorFuelSlots: [null],
    generatorPoweredOn: false,
  },
  {
    id: "grow_room",
    name: "Grow Room",
    level: 1,
    status: "idle",
    detail: "No crop",
  },
  {
    id: "three_d_printer",
    name: "3D Printer",
    level: 1,
    status: "idle",
    detail: "No print job",
    printerFilamentSlot: null,
    printerUsbItemId: null,
  },
  {
    id: "mining_rig",
    name: "Crypto Mining Rig",
    level: 1,
    status: "idle",
    detail: "0 / 1 GPU installed",
  },
  {
    id: "storage",
    name: "Storage",
    level: 1,
    status: "active",
    detail: "24 / 40 slots",
  },
];