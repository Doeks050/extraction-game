export const GENERATOR_ROOM_BACKGROUND_IMAGE =
  "/hideout/generator-room-level-1.webp";

export const GENERATOR_FUEL_SLOT_COUNT_BY_LEVEL: Record<number, number> = {
  1: 1,
};

export function getGeneratorFuelSlotCount(level: number) {
  const configuredLevels = Object.keys(GENERATOR_FUEL_SLOT_COUNT_BY_LEVEL)
    .map(Number)
    .filter((configuredLevel) => configuredLevel <= level)
    .sort((a, b) => b - a);

  const matchingLevel = configuredLevels[0];

  return matchingLevel
    ? GENERATOR_FUEL_SLOT_COUNT_BY_LEVEL[matchingLevel]
    : 0;
}
