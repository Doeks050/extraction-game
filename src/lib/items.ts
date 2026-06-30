import { gameItems } from "../data/items/items";
import type { GameItem, InventorySlot, ItemCategory } from "../types/items";

export type HydratedInventorySlot = InventorySlot & {
  item: GameItem;
  totalWeightKg: number;
  totalValue: number;
};

export function getItemById(itemId: string) {
  return gameItems.find((item) => item.id === itemId);
}

export function getCompatibleMagazinesForWeapon(weaponId: string) {
  return gameItems.filter(
    (item) => item.category === "magazine" && item.compatibleWeaponIds?.includes(weaponId),
  );
}

export function isMagazineCompatibleWithWeapon(magazineId: string, weaponId: string) {
  const magazine = getItemById(magazineId);

  return magazine?.category === "magazine" && magazine.compatibleWeaponIds?.includes(weaponId) === true;
}

export function hydrateInventory(slots: InventorySlot[]): HydratedInventorySlot[] {
  return slots.flatMap((slot) => {
    const item = getItemById(slot.itemId);

    if (!item) {
      return [];
    }

    return {
      ...slot,
      item,
      totalWeightKg: item.weightKg * slot.quantity,
      totalValue: item.value * slot.quantity,
    };
  });
}

export function getInventoryValue(slots: InventorySlot[]) {
  return hydrateInventory(slots).reduce((total, slot) => total + slot.totalValue, 0);
}

export function getInventoryWeight(slots: InventorySlot[]) {
  return hydrateInventory(slots).reduce(
    (total, slot) => total + slot.totalWeightKg,
    0,
  );
}

export function getCategoryCount(slots: InventorySlot[], category: ItemCategory) {
  return hydrateInventory(slots)
    .filter((slot) => slot.item.category === category)
    .reduce((total, slot) => total + slot.quantity, 0);
}

export function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatWeight(value: number) {
  return `${value.toFixed(1)} kg`;
}
