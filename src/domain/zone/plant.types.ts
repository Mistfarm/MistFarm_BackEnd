export const PLANT_TYPES = ['gosary', 'hub', 'none'] as const;
export type PlantType = (typeof PLANT_TYPES)[number];