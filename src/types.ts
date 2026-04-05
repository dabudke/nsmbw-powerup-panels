export const powerUpTypes = {
  mushroom: 'Super Mushroom',
  fireFlower: 'Fire Flower',
  propellerMushroom: 'Propeller Mushroom',
  iceFlower: 'Ice Flower',
  penguinSuit: 'Penguin Suit',
  miniMushroom: 'Mini Mushroom',
  star: 'Star',
  bowserJunior: 'Bowser Junior',
  bowser: 'Bowser'
} as const;
export type PowerUpValue = (typeof powerUpTypes)[keyof typeof powerUpTypes];

export type GridData = (PowerUpValue | undefined)[][];

export type Point = [number, number];

export type World = {
  determiners: [number, number][];
  currentGrid: number;
  grids: GridData[];
};
