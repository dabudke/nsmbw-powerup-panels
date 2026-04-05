import type { PropsWithoutRef } from 'react';
import { powerUpTypes, type GridData, type Point } from './types';
import PowerUp from './components/PowerUp';
import Tile from './components/Tile';

type Props = {
  grid: GridData;
  selected?: Point;
  highlights?: Point[];
  onTileClick?: (row: number, col: number) => void;
};

export default function Grid({ grid, selected, highlights, onTileClick }: PropsWithoutRef<Props>) {
  return (
    <>
      <div className="grid grid-cols-6 grid-rows-3 mt-2 gap-2 max-md:gap-1.5 w-full mx-auto max-w-lg aspect-2/1">
        {grid.flatMap((rowVals, row) =>
          rowVals.map((val, col) => (
            <div key={row * 6 + col} className={`row-span-${row + 1} col-span-${col + 1}`}>
              <Tile
                onClick={onTileClick && (() => onTileClick(row, col))}
                selected={selected?.[0] == row && selected?.[1] == col}
                danger={val == powerUpTypes.bowser || val == powerUpTypes.bowserJunior}
                highlight={highlights?.some((v) => v[0] == row && v[1] == col) ?? false}
              >
                {val !== undefined && <PowerUp powerup={val} />}
              </Tile>
            </div>
          ))
        )}
      </div>
    </>
  );
}
