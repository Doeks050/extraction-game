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
  {
    id: "print_ak_556_drum_magazine",
    name: "AK 5.56 Drum Magazine",
    requiredLevel: 1,
    durationSeconds: 1200,
    requiredUsbItemId: "printer_usb_drummer",
    inputs: [
      { itemId: "part_plastic_parts", quantity: 3 },
      { itemId: "part_mechanical_components", quantity: 1 },
      { itemId: "part_scrap_metal", quantity: 1 },
    ],
    output: {
      itemId: "mag_ak_556_drum",
      quantity: 1,
    },
  },
  {
    id: "print_ak_545_drum_magazine",
    name: "AK 5.45 Drum Magazine",
    requiredLevel: 1,
    durationSeconds: 1200,
    requiredUsbItemId: "printer_usb_drummer",
    inputs: [
      { itemId: "part_plastic_parts", quantity: 3 },
      { itemId: "part_mechanical_components", quantity: 1 },
      { itemId: "part_scrap_metal", quantity: 1 },
    ],
    output: {
      itemId: "mag_ak_545_drum",
      quantity: 1,
    },
  },
  {
    id: "print_ak_762_drum_magazine",
    name: "AK 7.62 Drum Magazine",
    requiredLevel: 1,
    durationSeconds: 1500,
    requiredUsbItemId: "printer_usb_drummer",
    inputs: [
      { itemId: "part_plastic_parts", quantity: 3 },
      { itemId: "part_mechanical_components", quantity: 2 },
      { itemId: "part_scrap_metal", quantity: 2 },
    ],
    output: {
      itemId: "mag_ak_762_drum",
      quantity: 1,
    },
  },
  {
    id: "print_suppressor_9mm",
    name: "9mm Suppressor",
    requiredLevel: 1,
    durationSeconds: 1200,
    requiredUsbItemId: "printer_usb_ghost",
    inputs: [
      { itemId: "part_mechanical_components", quantity: 2 },
      { itemId: "part_scrap_metal", quantity: 2 },
      { itemId: "part_screw_pack", quantity: 1 },
    ],
    output: {
      itemId: "att_suppressor_9mm",
      quantity: 1,
    },
  },
  {
    id: "print_suppressor_556",
    name: "5.56 Suppressor",
    requiredLevel: 1,
    durationSeconds: 1500,
    requiredUsbItemId: "printer_usb_ghost",
    inputs: [
      { itemId: "part_mechanical_components", quantity: 2 },
      { itemId: "part_scrap_metal", quantity: 3 },
      { itemId: "part_screw_pack", quantity: 1 },
    ],
    output: {
      itemId: "att_suppressor_556",
      quantity: 1,
    },
  },
  {
    id: "print_suppressor_45",
    name: ".45 Suppressor",
    requiredLevel: 1,
    durationSeconds: 1350,
    requiredUsbItemId: "printer_usb_ghost",
    inputs: [
      { itemId: "part_mechanical_components", quantity: 2 },
      { itemId: "part_scrap_metal", quantity: 2 },
      { itemId: "part_screw_pack", quantity: 1 },
    ],
    output: {
      itemId: "att_suppressor_45",
      quantity: 1,
    },
  },
  {
    id: "print_micro_red_dot",
    name: "Micro Red Dot",
    requiredLevel: 1,
    durationSeconds: 900,
    requiredUsbItemId: "printer_usb_sentry",
    inputs: [
      { itemId: "part_circuit_board", quantity: 1 },
      { itemId: "part_electrical_components", quantity: 1 },
      { itemId: "part_plastic_parts", quantity: 2 },
    ],
    output: {
      itemId: "att_micro_red_dot",
      quantity: 1,
    },
  },
  {
    id: "print_holographic_sight",
    name: "Holographic Sight",
    requiredLevel: 1,
    durationSeconds: 1200,
    requiredUsbItemId: "printer_usb_sentry",
    inputs: [
      { itemId: "part_circuit_board", quantity: 1 },
      { itemId: "part_electrical_components", quantity: 1 },
      { itemId: "part_plastic_parts", quantity: 2 },
      { itemId: "part_battery", quantity: 1 },
    ],
    output: {
      itemId: "att_holographic_sight",
      quantity: 1,
    },
  },
  {
    id: "print_combat_scope_1_4x",
    name: "1-4x Combat Scope",
    requiredLevel: 1,
    durationSeconds: 1800,
    requiredUsbItemId: "printer_usb_sentry",
    inputs: [
      { itemId: "part_circuit_board", quantity: 2 },
      { itemId: "part_electrical_components", quantity: 2 },
      { itemId: "part_plastic_parts", quantity: 3 },
      { itemId: "part_battery", quantity: 1 },
    ],
    output: {
      itemId: "att_combat_scope_1_4x",
      quantity: 1,
    },
  },
];

export function getThreeDPrinterRecipeById(recipeId: string) {
  return threeDPrinterRecipes.find((recipe) => recipe.id === recipeId);
}
