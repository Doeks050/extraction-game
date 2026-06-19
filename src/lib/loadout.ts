import { getItemById } from "./items";
import type { CurrentLoadout, LoadoutStatSummary } from "../types/loadout";

export function calculateLoadoutStats(loadout: CurrentLoadout): LoadoutStatSummary {
  const equippedItems = [
    ...loadout.equipment.map((slot) => ({
      item: slot.itemId ? getItemById(slot.itemId) : undefined,
      quantity: slot.quantity ?? 1,
    })),
    ...loadout.quickSlots.map((slot) => ({
      item: slot.itemId ? getItemById(slot.itemId) : undefined,
      quantity: slot.quantity ?? 1,
    })),
    ...loadout.ammoReserve.map((reserve) => ({
      item: getItemById(reserve.itemId),
      quantity: reserve.quantity,
    })),
  ].filter((entry) => entry.item);

  const weightKg = equippedItems.reduce((total, entry) => {
    if (!entry.item) {
      return total;
    }

    return total + entry.item.weightKg * entry.quantity;
  }, 0);

  const protectionItems = loadout.equipment
    .map((slot) => (slot.itemId ? getItemById(slot.itemId) : undefined))
    .filter((item) => item?.category === "chest_gear" || item?.category === "helmet");

  const weaponItems = loadout.equipment
    .map((slot) => (slot.itemId ? getItemById(slot.itemId) : undefined))
    .filter((item) => item?.category === "weapon");

  const medicalItems = loadout.quickSlots
    .map((slot) => (slot.itemId ? getItemById(slot.itemId) : undefined))
    .filter((item) => item?.category === "medical");

  const protection = protectionItems.reduce((total, item) => {
    return total + (item?.stats?.armorClass ?? 0) * 25;
  }, 0);

  const ergonomics = weaponItems.reduce((total, item) => {
    return total + (item?.stats?.ergonomics ?? 0);
  }, 0);

  const hasWeapon = weaponItems.length > 0;
  const hasArmor = protectionItems.length > 0;
  const hasMedical = medicalItems.length > 0;
  const hasAmmo = loadout.ammoReserve.length > 0;

  const weightPenalty = Math.min(40, Math.round(weightKg * 1.3));
  const mobility = Math.max(25, 100 - weightPenalty);
  const readinessScore = Math.min(
    100,
    (hasWeapon ? 30 : 0) +
      (hasArmor ? 25 : 0) +
      (hasMedical ? 20 : 0) +
      (hasAmmo ? 15 : 0) +
      Math.round(mobility / 10),
  );

  return {
    weightKg,
    protection: Math.min(100, protection),
    mobility,
    ergonomics: Math.min(100, Math.round(ergonomics / Math.max(1, weaponItems.length))),
    readinessScore,
    hasWeapon,
    hasArmor,
    hasMedical,
    hasAmmo,
  };
}

export function getReadinessLabel(score: number) {
  if (score >= 80) {
    return "Ready";
  }

  if (score >= 55) {
    return "Partial";
  }

  return "Not Ready";
}
