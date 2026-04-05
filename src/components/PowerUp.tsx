import type { PropsWithoutRef } from 'react';
import { powerUpTypes, type PowerUpValue } from '../types';

import mushroom from '../assets/m.png';
import fireFlower from '../assets/ff.png';
import propellerMushroom from '../assets/pm.png';
import iceFlower from '../assets/if.png';
import penguinSuit from '../assets/ps.png';
import miniMushroom from '../assets/mm.png';
import star from '../assets/s.png';
import bowserJunior from '../assets/bj.png'; // hehe
import bowser from '../assets/b.png';

type Props = {
  powerup: PowerUpValue;
};

export default function PowerUp({ powerup }: PropsWithoutRef<Props>) {
  let image;

  switch (powerup) {
    case powerUpTypes.mushroom:
      image = mushroom;
      break;
    case powerUpTypes.fireFlower:
      image = fireFlower;
      break;
    case powerUpTypes.propellerMushroom:
      image = propellerMushroom;
      break;
    case powerUpTypes.iceFlower:
      image = iceFlower;
      break;
    case powerUpTypes.penguinSuit:
      image = penguinSuit;
      break;
    case powerUpTypes.miniMushroom:
      image = miniMushroom;
      break;
    case powerUpTypes.star:
      image = star;
      break;
    case powerUpTypes.bowserJunior:
      image = bowserJunior;
      break;
    case powerUpTypes.bowser:
      image = bowser;
      break;
  }

  return <img src={image} alt={powerup} className="object-contain w-full h-full" />;
}
