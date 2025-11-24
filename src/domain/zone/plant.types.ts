export const PLANT_TYPES = ['gosary', 'lettuce', 'none'] as const;
export type PlantType = (typeof PLANT_TYPES)[number];