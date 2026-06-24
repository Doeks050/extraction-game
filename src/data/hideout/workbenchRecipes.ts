import type { HideoutCraftingRecipe } from "../../types/hideoutCrafting";

export type WorkbenchRecipe = HideoutCraftingRecipe;

export const workbenchRecipes: WorkbenchRecipe[] = [
  {
    id: "craft_scrap_metal",
    name: "Scrap Metal",
    requiredLevel: 1,
    durationSeconds: 30,
    inputs: [
      { itemId: "part_bolt_pack", quantity: 1 },
      { itemId: "part_screw_pack", quantity: 1 },
    ],
    output: {
      itemId: "part_scrap_metal",
      quantity: 1,
    },
  },
  {
    id: "craft_mechanical_components",
    name: "Mechanical Components",
    requiredLevel: 1,
    durationSeconds: 300,
    inputs: [
      { itemId: "part_scrap_metal", quantity: 2 },
      { itemId: "part_bolt_pack", quantity: 1 },
      { itemId: "part_screw_pack", quantity: 1 },
    ],
    output: {
      itemId: "part_mechanical_components",
      quantity: 1,
    },
  },
  {
    id: "craft_wire_bundle",
    name: "Wire Bundle",
    requiredLevel: 1,
    durationSeconds: 180,
    inputs: [
      { itemId: "part_copper_wire", quantity: 2 },
      { itemId: "part_electrical_tape", quantity: 1 },
    ],
    output: {
      itemId: "part_wire_bundle",
      quantity: 1,
    },
  },
  {
    id: "craft_electrical_components",
    name: "Electrical Components",
    requiredLevel: 1,
    durationSeconds: 300,
    inputs: [
      { itemId: "part_copper_wire", quantity: 2 },
      { itemId: "part_circuit_board", quantity: 1 },
      { itemId: "part_electrical_tape", quantity: 1 },
    ],
    output: {
      itemId: "part_electrical_components",
      quantity: 1,
    },
  },
  {
    id: "craft_grow_light",
    name: "Grow Light",
    requiredLevel: 1,
    durationSeconds: 600,
    inputs: [
      { itemId: "part_bulb", quantity: 1 },
      { itemId: "part_electrical_components", quantity: 1 },
      { itemId: "part_wire_bundle", quantity: 1 },
    ],
    output: {
      itemId: "part_grow_light",
      quantity: 1,
    },
  },
  {
    id: "craft_water_pump",
    name: "Water Pump",
    requiredLevel: 1,
    durationSeconds: 600,
    inputs: [
      { itemId: "part_electric_motor", quantity: 1 },
      { itemId: "part_mechanical_components", quantity: 1 },
      { itemId: "part_rubber_hose", quantity: 1 },
    ],
    output: {
      itemId: "part_water_pump",
      quantity: 1,
    },
  },
  {
    id: "craft_printer_assembly",
    name: "Printer Assembly",
    requiredLevel: 1,
    durationSeconds: 1200,
    inputs: [
      { itemId: "part_mechanical_components", quantity: 2 },
      { itemId: "part_electrical_components", quantity: 2 },
      { itemId: "part_plastic_parts", quantity: 2 },
    ],
    output: {
      itemId: "part_printer_assembly",
      quantity: 1,
    },
  },
  {
    id: "craft_cooling_fan",
    name: "Cooling Fan",
    requiredLevel: 1,
    durationSeconds: 900,
    inputs: [
      { itemId: "part_electric_motor", quantity: 1 },
      { itemId: "part_wire_bundle", quantity: 1 },
      { itemId: "part_plastic_parts", quantity: 2 },
    ],
    output: {
      itemId: "part_cooling_fan",
      quantity: 1,
    },
  },
  {
    id: "craft_reinforced_equipment_rack",
    name: "Reinforced Equipment Rack",
    requiredLevel: 1,
    durationSeconds: 1800,
    inputs: [
      { itemId: "part_mechanical_components", quantity: 4 },
      { itemId: "part_scrap_metal", quantity: 4 },
      { itemId: "part_bolt_pack", quantity: 2 },
      { itemId: "part_screw_pack", quantity: 2 },
    ],
    output: {
      itemId: "part_reinforced_equipment_rack",
      quantity: 1,
    },
  },
];

export function getWorkbenchRecipeById(recipeId: string) {
  return workbenchRecipes.find((recipe) => recipe.id === recipeId);
}
