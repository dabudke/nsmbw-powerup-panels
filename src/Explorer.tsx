import { useState, type PropsWithoutRef } from 'react';
import type { GridData, Point } from './types';
import Grid from './Grid';
import worlds from './assets/worlds.json';
import Button from './components/Button';
import ButtonRow from './components/ButtonRow';
import { MiniGrid } from './components/GridMiniView';

const blankGrid = [
  [undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined]
];

function WorldNumbers({
  selected,
  changeWorld
}: PropsWithoutRef<{ selected: number | undefined; changeWorld: (world: number) => void }>) {
  return (
    <span className="mt-2">
      <ButtonRow>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <span key={i} className="contents">
            <Button onClick={() => changeWorld(i - 1)} active={selected == i - 1}>
              W{i}
            </Button>
          </span>
        ))}
      </ButtonRow>
    </span>
  );
}

function GridSelect({
  possibleGrids,
  determiners,
  selected,
  changeGrid
}: PropsWithoutRef<{
  possibleGrids: GridData[];
  determiners: Point[];
  selected: number | undefined;
  changeGrid: React.Dispatch<React.SetStateAction<number | undefined>>;
}>) {
  return (
    <span className="mt-2 flex flex-wrap gap-1 p-1 rounded-md bg-gray-100 dark:bg-gray-900 justify-center">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <button className="contents" key={i} onClick={() => changeGrid(i)}>
          <MiniGrid
            showCompleted={false}
            selected={selected == i}
            grid={possibleGrids[i]}
            determiners={determiners}
          />
        </button>
      ))}
    </span>
  );
}

export default function Viewer() {
  const [worldNumber, changeWorld] = useState<number | undefined>();
  const [gridNumber, changeGrid] = useState<number | undefined>();

  const world = worldNumber !== undefined ? worlds[worldNumber] : undefined;
  const grids = world?.grids as GridData[],
    determiners = world?.determiners as Point[];
  const grid = gridNumber !== undefined ? grids?.[gridNumber] ?? blankGrid : blankGrid;

  return (
    <>
      <WorldNumbers
        changeWorld={(w) => {
          changeWorld(w);
          changeGrid(undefined);
        }}
        selected={worldNumber}
      />
      <Grid grid={grid} highlights={determiners} />
      {worldNumber !== undefined && (
        <GridSelect
          selected={gridNumber}
          changeGrid={changeGrid}
          possibleGrids={grids}
          determiners={determiners}
        />
      )}
      <ButtonRow>
        <Button href="/nsmbw-powerup-panels/">Back to app</Button>
      </ButtonRow>
    </>
  );
}
