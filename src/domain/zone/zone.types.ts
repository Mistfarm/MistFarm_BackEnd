export const PLANTS = ['gosary', 'lettuce', 'none'] as const;
export type PlantType = (typeof PLANTS)[number];