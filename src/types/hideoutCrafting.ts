export type HideoutCraftingInput = {
  itemId: string;
  quantity: number;
};

export type HideoutCraftingRecipe = {
  id: string;
  name: string;
  requiredLevel: number;
  durationSeconds: number;
  inputs: HideoutCraftingInput[];
  output: {
    itemId: string;
    quantity: number;
  };
  requiredUsbItemId?: string;
};