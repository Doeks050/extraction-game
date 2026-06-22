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
];

export function getWorkbenchRecipeById(recipeId: string) {
  return workbenchRecipes.find((recipe) => recipe.id === recipeId);
}
