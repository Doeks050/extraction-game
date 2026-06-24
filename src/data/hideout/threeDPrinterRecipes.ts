import type { HideoutCraftingRecipe } from "../../types/hideoutCrafting";

export const threeDPrinterRecipes: HideoutCraftingRecipe[] = [
  {
    id: "print_power_distribution_unit",
    name: "Power Distribution Unit",
    requiredLevel: 1,
    durationSeconds: 2400,
    inputs: [
      { itemId: "part_electrical_components", quantity: 3 },
      { itemId: "part_circuit_board", quantity: 2 },
      { itemId: "part_wire_bundle", quantity: 2 },
      { itemId: "part_plastic_parts", quantity: 3 },
    ],
    output: {
      itemId: "part_power_distribution_unit",
      quantity: 1,
    },
  },
  {
    id: "print_thermal_management_unit",
    name: "Thermal Management Unit",
    requiredLevel: 1,
    durationSeconds: 2100,
    inputs: [
      { itemId: "part_cooling_fan", quantity: 2 },
      { itemId: "part_electrical_components", quantity: 1 },
      { itemId: "part_wire_bundle", quantity: 1 },
      { itemId: "part_mechanical_components", quantity: 1 },
      { itemId: "part_plastic_parts", quantity: 3 },
    ],
    output: {
      itemId: "part_thermal_management_unit",
      quantity: 1,
    },
  },
];

export function getThreeDPrinterRecipeById(recipeId: string) {
  return threeDPrinterRecipes.find((recipe) => recipe.id === recipeId);
}
