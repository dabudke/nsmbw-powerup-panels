/* These images are property of Nintendo. I do not own any of these images. */
import mushroom from './assets/m.png';
import fireflower from './assets/ff.png';
import propellermushroom from './assets/pm.png';
import iceflower from './assets/if.png';
import penguinsuit from './assets/ps.png';
import minimushroom from './assets/mm.png';
import star from './assets/s.png';
import bowserjunior from './assets/bj.png';
import bowser from './assets/b.png';

import worlds from './assets/worlds.json';

export enum PowerUp {
	Mushroom,
	FireFlower,
	PropellerMushroom,
	IceFlower,
	PenguinSuit,
	MiniMushroom,
	Star,
	BowserJunior,
	Bowser
}

export const PowerUpImages: Record<PowerUp, string> = {
	[PowerUp.Mushroom]: mushroom,
	[PowerUp.FireFlower]: fireflower,
	[PowerUp.PropellerMushroom]: propellermushroom,
	[PowerUp.IceFlower]: iceflower,
	[PowerUp.PenguinSuit]: penguinsuit,
	[PowerUp.MiniMushroom]: minimushroom,
	[PowerUp.Star]: star,
	[PowerUp.BowserJunior]: bowserjunior,
	[PowerUp.Bowser]: bowser
};
export const PowerUpAlt: Record<PowerUp, string> = {
	[PowerUp.Mushroom]: 'mushroom',
	[PowerUp.FireFlower]: 'fire flower',
	[PowerUp.PropellerMushroom]: 'propeller mushroom',
	[PowerUp.IceFlower]: 'ice flower',
	[PowerUp.PenguinSuit]: 'penguin suit',
	[PowerUp.MiniMushroom]: 'mini mushroom',
	[PowerUp.Star]: 'star',
	[PowerUp.BowserJunior]: 'bowser junior',
	[PowerUp.Bowser]: 'bowser'
};

export interface World {
	determiners: number[][];
	grids: Grid[];
}
export type Grid = PowerUp[][];
export type WorkingGrid = (PowerUp | undefined)[][];

export { worlds };
