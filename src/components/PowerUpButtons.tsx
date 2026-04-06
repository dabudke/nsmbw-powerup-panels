import type { PropsWithoutRef } from 'react';
import type { PowerUpValue } from '../types';
import Button from './Button';
import PowerUp from './PowerUp';
import ButtonRow from './ButtonRow';

type Props = {
  powerUps: PowerUpValue[];
  disabled?: boolean;
  onClick: (powerUp: PowerUpValue) => void;
};

export default function PowerUpButtons({
  powerUps,
  disabled = false,
  onClick
}: PropsWithoutRef<Props>) {
  return (
    powerUps.length > 0 && (
      <ButtonRow>
        {powerUps.map((powerUp, i) => (
          <Button key={i} square disabled={disabled} onClick={() => onClick(powerUp)}>
            <PowerUp powerup={powerUp} />
          </Button>
        ))}
      </ButtonRow>
    )
  );
}
