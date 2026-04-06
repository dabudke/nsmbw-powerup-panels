import { useMemo, useReducer, useState, type PropsWithoutRef } from 'react';
import worlds from './assets/worlds.json';
import { powerUpTypes, type GridData, type Point, type PowerUpValue } from './types';
import Grid from './Grid';
import PowerUpButtons from './components/PowerUpButtons';
import ButtonRow from './components/ButtonRow';
import Button from './components/Button';

type GridReducerArgs =
  | {
      action: 'push';
      square: Point;
      powerUp: PowerUpValue;
    }
  | {
      action: 'undo';
    }
  | { action: 'reset' };
function gridReducer(
  prevState: { grid: GridData; filledSquares: Point[] },
  data: GridReducerArgs
): { grid: GridData; filledSquares: Point[] } {
  const { grid: prevGrid, filledSquares: prevFilledSquares } = prevState;
  switch (data.action) {
    case 'push': {
      const { square, powerUp } = data;
      return {
        grid: structuredClone(
          prevGrid.map((row, rowIndex) =>
            row.map((val, colIndex) =>
              square[0] == rowIndex && square[1] == colIndex ? powerUp : val
            )
          )
        ),
        filledSquares: [...prevFilledSquares, square]
      };
    }

    case 'undo': {
      if (prevFilledSquares.length == 0) return prevState;
      const [prevRow, prevCol] = prevFilledSquares.at(-1)!;

      return {
        grid: prevGrid.map((row, rowIndex) =>
          row.map((val, colIndex) => (prevRow == rowIndex && prevCol == colIndex ? undefined : val))
        ),
        filledSquares: prevFilledSquares.filter(([row, col]) => row != prevRow || col != prevCol)
      };
    }

    case 'reset': {
      return {
        grid: prevGrid.map((row) => row.map(() => undefined)),
        filledSquares: []
      };
    }
  }
  return prevState;
}

type ActionButtonProps = {
  currentWorld: number | undefined;
  setCurrentWorld: (world: number | undefined) => void;
  undo: () => void;
  undoAvailable: boolean;
  reset: () => void;
  resetAvailable: boolean;
};
function ActionButtons({
  currentWorld,
  setCurrentWorld,
  undo,
  undoAvailable,
  reset,
  resetAvailable
}: PropsWithoutRef<ActionButtonProps>) {
  if (currentWorld === undefined)
    return (
      <ButtonRow>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => (
          <Button key={w} onClick={() => setCurrentWorld(w - 1)}>
            W{w}
          </Button>
        ))}
      </ButtonRow>
    );

  return (
    <ButtonRow>
      <Button disabled={!undoAvailable} onClick={undo}>
        Undo
      </Button>
      <Button disabled={!resetAvailable} onClick={reset}>
        Reset
      </Button>
      <Button onClick={() => setCurrentWorld(undefined)}>Change World</Button>
    </ButtonRow>
  );
}

export default function App() {
  const [currentWorld, setCurrentWorld] = useState<number | undefined>(undefined);
  const [{ grid, filledSquares }, updateGrid] = useReducer(
    gridReducer,
    (() => {
      const grid = [];
      for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 6; j++) row.push(undefined);
        grid.push(row);
      }
      return { grid, filledSquares: [] };
    })()
  );

  const world = currentWorld !== undefined ? worlds[currentWorld] : undefined;
  const possibleGrids = useMemo(() => {
    if (world == undefined) return [];

    return world.grids.filter((possibleGrid) =>
      possibleGrid.every((row, rowIndex) =>
        row.every(
          (val, colIndex) =>
            grid[rowIndex][colIndex] == undefined || grid[rowIndex][colIndex] == val
        )
      )
    ) as PowerUpValue[][][];
  }, [currentWorld, grid]);

  const determiner = useMemo(() => {
    if (possibleGrids.length == 0) return undefined;

    return world!.determiners.find(([row, col]) => {
      // determiner is the first grid entry that is A) not equal across all possible
      // grids and B) undefined in the current grid
      return (
        !possibleGrids.every(
          (possibleGrid) => possibleGrid[row][col] == possibleGrids[0][row][col]
        ) && grid[row][col] == undefined
      );
    }) as Point;
  }, [possibleGrids, grid]);

  const possiblePowerUps: PowerUpValue[] = useMemo(() => {
    if (!determiner) return [];
    return Object.values(powerUpTypes).filter((val) =>
      possibleGrids.some((grid) => grid[determiner[0]][determiner[1]] == val)
    );
  }, [determiner, possibleGrids]);

  const titleText = useMemo(() => {
    if (currentWorld === undefined) return 'Select a world';
    if (possibleGrids.length > 1) return 'Enter the power-up displayed on this panel:';
    if (possibleGrids.length == 1) return 'Grid solved!';
    if (possibleGrids.length == 0) return 'Invalid grid state reached!';

    return 'INVALID STATE';
  }, [currentWorld, possibleGrids]);

  return (
    <>
      <h1 className="mt-8 text-2xl font-semibold">{titleText}</h1>
      <Grid
        grid={possibleGrids.length == 1 ? possibleGrids[0] : grid}
        selected={determiner}
        highlights={filledSquares}
      />
      <PowerUpButtons
        onClick={(powerUp) => updateGrid({ action: 'push', square: determiner!, powerUp })}
        powerUps={possiblePowerUps}
      />
      <ActionButtons
        currentWorld={currentWorld}
        setCurrentWorld={(w) => {
          setCurrentWorld(w);
          updateGrid({ action: 'reset' });
        }}
        undo={() => updateGrid({ action: 'undo' })}
        undoAvailable={filledSquares.length > 0}
        reset={() => updateGrid({ action: 'reset' })}
        resetAvailable={filledSquares.length > 0}
      />
    </>
  );
}
