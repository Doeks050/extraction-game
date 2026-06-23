import type { HideoutItemRequirement } from "./workbenchRequirements";

export type WorkbenchRecipe = {
  id: string;
  name: string;
  requiredLevel: number;
  durationSeconds: number;
  inputs: HideoutItemRequirement[];
  output: {
    itemId: string;
    quantity: number;
  };
};

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
];

export function getWorkbenchRecipeById(recipeId: string) {
  return workbenchRecipes.find((recipe) => recipe.id === recipeId);
}
