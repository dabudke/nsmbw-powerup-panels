import { useEffect, useMemo, useReducer, useState } from 'react';
import { powerUpTypes, type Point, type PowerUpValue, type World } from './types';
import Grid from './Grid';
import PowerUpButtons from './components/PowerUpButtons';
import Button from './components/Button';
import ButtonRow from './components/ButtonRow';
import BuilderMiniView from './components/GridMiniView';
import z from 'zod';

const blankWorld: World = {
  determiners: [],
  grids: [
    [
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined]
    ],
    [
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined]
    ],
    [
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined]
    ],
    [
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined]
    ],
    [
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined]
    ],
    [
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined]
    ]
  ],
  currentGrid: 0
};

type WorldUpdateReducerArgs = [
  | {
      action: 'toggleDeterminer';
      determiner: [number, number];
    }
  | {
      action: 'pushToGrid';
      powerUp: PowerUpValue;
    }
  | {
      action: 'popFromGrid';
    }
  | {
      action: 'resetGrid';
    }
  | {
      action: 'setCurrentGrid';
      currentGrid: number;
    }
];

export default function Builder() {
  const [currentWorld, setCurrentWorld] = useState<number>(() => {
    const prevWorld = window.localStorage.getItem('currentWorld');
    if (prevWorld) {
      const data = z.safeParse(z.number(), JSON.parse(prevWorld));
      if (data.success) return data.data;
    }
    return 0;
  });
  useEffect(() => {
    window.localStorage.setItem('currentWorld', JSON.stringify(currentWorld));
  }, [currentWorld]);

  const [worlds, updateWorld] = useReducer<World[], WorldUpdateReducerArgs>(
    (prevState, data) => {
      // destructure previous state for mutation
      let { determiners, grids, currentGrid } = structuredClone(prevState[currentWorld]);

      switch (data.action) {
        case 'toggleDeterminer': {
          // toggle whether a square is a determiner or not
          const {
            determiner: [row, col]
          } = data;
          const exists = determiners.some(
            ([existingRow, existingCol]) => existingRow == row && existingCol == col
          );
          if (exists) {
            determiners = determiners.filter(
              ([existingRow, existingCol]) => !(existingRow == row && existingCol == col)
            );
          } else {
            determiners.push([row, col]);
          }
          break;
        }

        case 'pushToGrid': {
          // push a powerup to the grid
          const row = grids[currentGrid].findIndex((row) => row.includes(undefined));
          if (row != -1) {
            const col = grids[currentGrid][row].indexOf(undefined);
            grids[currentGrid][row][col] = data.powerUp;
          }
          break;
        }

        case 'popFromGrid': {
          // pop the latest powerup from the grid
          const emptyRow = grids[currentGrid].findIndex((row) => row.includes(undefined));
          const emptyCol = grids[currentGrid][emptyRow == -1 ? 2 : emptyRow].indexOf(undefined);

          if (emptyCol > 0) {
            const row = emptyRow,
              col = emptyCol - 1;
            grids[currentGrid][row][col] = undefined;
          } else if (emptyRow > 0) {
            const row = emptyRow - 1,
              col = 5;
            grids[currentGrid][row][col] = undefined;
          } else {
            grids[currentGrid][2][5] = undefined;
          }
          break;
        }

        case 'resetGrid': {
          // clear the grid
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 6; col++) {
              grids[currentGrid][row][col] = undefined;
            }
          }
          break;
        }

        case 'setCurrentGrid':
          // change the current grid number
          currentGrid = data.currentGrid;
          break;
      }

      return prevState.map((old, worldIndex) =>
        worldIndex == currentWorld ? { determiners, grids, currentGrid } : old
      );
    },
    (() => {
      const prevState = window.localStorage.getItem('worlds');
      if (prevState) {
        const result = z.safeParse(
          z
            .array(
              z.object({
                determiners: z.array(z.tuple([z.number(), z.number()])),
                grids: z
                  .array(z.array(z.array(z.nullable(z.string())).length(6)).length(3))
                  .length(6),
                currentGrid: z.number().max(5).min(0).default(0)
              })
            )
            .length(9),
          JSON.parse(prevState)
        );
        if (result.success) {
          return result.data.map(({ determiners, grids, currentGrid }) => ({
            determiners,
            currentGrid,
            grids: grids.map((grid) =>
              grid.map((row) => row.map((val) => (val == null ? undefined : (val as PowerUpValue))))
            )
          }));
        }
      }
      return [
        structuredClone(blankWorld),
        structuredClone(blankWorld),
        structuredClone(blankWorld),
        structuredClone(blankWorld),
        structuredClone(blankWorld),
        structuredClone(blankWorld),
        structuredClone(blankWorld),
        structuredClone(blankWorld),
        structuredClone(blankWorld)
      ];
    })()
  );

  useEffect(() => {
    window.localStorage.setItem('worlds', JSON.stringify(worlds));
  }, [worlds]);

  const { grids, determiners, currentGrid } = worlds[currentWorld];

  const currentSquare: Point | undefined = useMemo<Point | undefined>(() => {
    const grid = grids[currentGrid];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        if (grid[row][col] == undefined) return [row, col];
      }
    }
    return undefined;
  }, [currentWorld, grids[currentGrid]]);

  return (
    <>
      <Grid
        grid={grids[currentGrid]}
        selected={currentSquare}
        highlights={determiners}
        onTileClick={(row, col) =>
          updateWorld({ action: 'toggleDeterminer', determiner: [row, col] })
        }
      />
      <PowerUpButtons
        powerUps={Object.values(powerUpTypes)}
        onClick={(powerUp) => {
          updateWorld({ action: 'pushToGrid', powerUp });
        }}
      />
      <ButtonRow>
        <Button
          onClick={() => {
            updateWorld({ action: 'popFromGrid' });
          }}
        >
          Undo
        </Button>
        <Button onClick={() => updateWorld({ action: 'resetGrid' })}>Clear</Button>
        <Button
          onClick={() => updateWorld({ action: 'setCurrentGrid', currentGrid: currentGrid - 1 })}
          disabled={currentGrid <= 0}
        >
          Previous Grid
        </Button>
        <Button
          onClick={() => updateWorld({ action: 'setCurrentGrid', currentGrid: currentGrid + 1 })}
          disabled={currentGrid >= 5}
        >
          Next Grid
        </Button>
      </ButtonRow>
      <p>Grid {currentGrid + 1} / 6</p>
      <ButtonRow>
        <Button onClick={() => setCurrentWorld((c) => c - 1)} disabled={currentWorld <= 0}>
          Prev World
        </Button>
        <Button onClick={() => setCurrentWorld((c) => c + 1)} disabled={currentWorld >= 8}>
          Next World
        </Button>
        <Button
          onClick={() => {
            console.log(
              JSON.stringify(
                worlds.map(
                  (world) => world && { determiners: world.determiners, grids: world.grids }
                )
              )
            );
          }}
        >
          Export
        </Button>
      </ButtonRow>
      <p>World {currentWorld + 1} / 9</p>
      <BuilderMiniView worlds={worlds} selectedWorld={currentWorld} selectedGrid={currentGrid} />
      <ButtonRow>
        <Button href="/">Back to app</Button>
      </ButtonRow>
    </>
  );
}
