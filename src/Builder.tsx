import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { powerUpTypes, type GridData, type Point, type PowerUpValue, type World } from './types';
import Grid from './Grid';
import PowerUpButtons from './components/PowerUpButtons';
import Button from './components/Button';
import ButtonRow from './components/ButtonRow';
import BuilderMiniView from './components/BuilderMiniView';

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
  const [currentWorld, setCurrentWorld] = useState<number>(0);

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
    [
      structuredClone(blankWorld),
      structuredClone(blankWorld),
      structuredClone(blankWorld),
      structuredClone(blankWorld),
      structuredClone(blankWorld),
      structuredClone(blankWorld),
      structuredClone(blankWorld),
      structuredClone(blankWorld),
      structuredClone(blankWorld)
    ]
  );

  const { grids, determiners, currentGrid } = worlds[currentWorld];

  // const [grid, updateGrid] = useReducer<
  //   GridData,
  //   [
  //     | { action: 'reset' }
  //     | { action: 'push'; powerUp: PowerUpValue; square: Point | undefined }
  //     | { action: 'pop'; currentSquare: Point }
  //     | { action: 'replace'; grid: GridData }
  //   ]
  // >(
  //   (prev, data) => {
  //     switch (data.action) {
  //       case 'replace':
  //         return data.grid;

  //       case 'reset': {
  //         const resetGrid = [];
  //         for (let i = 0; i < 3; i++) {
  //           const row = [];
  //           for (let j = 0; j < 6; j++) {
  //             row.push(undefined);
  //           }
  //           resetGrid.push(row);
  //         }
  //         return resetGrid;
  //       }

  //       case 'push': {
  //         if (data.square == undefined) return prev;
  //         const [currentRow, currentCol] = data.square;
  //         return prev.map((row, rowIndex) =>
  //           row.map((val, colIndex) =>
  //             rowIndex == currentRow && colIndex == currentCol ? data.powerUp : val
  //           )
  //         );
  //       }

  //       case 'pop': {
  //         let prevRow, prevCol;
  //         if (data.currentSquare[1] - 1 >= 0) {
  //           prevRow = data.currentSquare[0];
  //           prevCol = data.currentSquare[1] - 1;
  //         } else if (data.currentSquare[0] - 1 >= 0) {
  //           prevRow = data.currentSquare[0] - 1;
  //           prevCol = 5;
  //         } else return prev;
  //         return prev.map((row, rowIndex) =>
  //           row.map((val, colIndex) =>
  //             rowIndex == prevRow && colIndex == prevCol ? undefined : val
  //           )
  //         );
  //       }
  //     }
  //   },
  //   (() => {
  //     const grid = [];
  //     for (let i = 0; i < 3; i++) {
  //       const row = [];
  //       for (let j = 0; j < 6; j++) {
  //         row.push(undefined);
  //       }
  //       grid.push(row);
  //     }
  //     return grid;
  //   })()
  // );

  const currentSquare: Point | undefined = useMemo<Point | undefined>(() => {
    const grid = grids[currentGrid];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        if (grid[row][col] == undefined) return [row, col];
      }
    }
    return undefined;
  }, [currentWorld, grids[currentGrid]]);

  // const [determiners, toggleDeterminer] = useReducer<
  //   Point[],
  //   [
  //     | { action: 'toggle'; square: [number, number] }
  //     | { action: 'reset' }
  //     | { action: 'replace'; determiners: [number, number][] }
  //   ]
  // >((prev, data) => {
  //   switch (data.action) {
  //     case 'reset':
  //       return [];
  //     case 'replace':
  //       return data.determiners;

  //     case 'toggle': {
  //       const [row, col] = data.square;
  //       const exists = prev.some(([prevRow, prevCol]) => prevRow == row && prevCol == col);
  //       if (exists) {
  //         return prev.filter(([prevRow, prevCol]) => !(prevRow == row && prevCol == col));
  //       }
  //       return [...prev, [row, col]];
  //     }
  //   }
  // }, []);

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
    </>
  );
}
