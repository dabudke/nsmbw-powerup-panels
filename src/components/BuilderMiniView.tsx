import { useMemo, type PropsWithoutRef } from 'react';
import type { GridData, Point, PowerUpValue } from '../types';

function BuilderMiniViewTile({
  powerUp,
  determiner
}: PropsWithoutRef<{ powerUp: PowerUpValue | undefined; determiner: boolean }>) {
  let color = 'bg-gray-200 dark:bg-gray-700';
  let danger = false;
  switch (powerUp) {
    case 'Super Mushroom':
      color = 'bg-red-500 dark:bg-red-400';
      break;
    case 'Fire Flower':
      color = 'bg-amber-500 dark:bg-amber-400';
      break;
    case 'Propeller Mushroom':
      color = 'bg-orange-500 dark:bg-orange-400';
      break;
    case 'Ice Flower':
      color = 'bg-sky-500 dark:bg-sky-400';
      break;
    case 'Penguin Suit':
      color = 'bg-blue-500 dark:bg-blue-400';
      break;
    case 'Mini Mushroom':
      color = 'bg-indigo-600 dark:bg-indigo-400';
      break;
    case 'Star':
      color = 'bg-yellow-400 dark:bg-yellow-300';
      break;
    case 'Bowser Junior':
      color = 'bg-amber-700';
      danger = true;
      break;
    case 'Bowser':
      color = 'bg-red-700 ';
      danger = true;
      break;
  }
  return (
    <div
      className={`${color} h-2.5 w-2.5 rounded-xs ${
        determiner && 'outline-1 -outline-offset-1 outline-green-500 dark:outline-green-400'
      } ${
        danger && 'outline-1 dark:outline-2 -outline-offset-1 dark:-outline-offset-2 outline-black'
      }`}
    />
  );
}

function BuilderMiniViewGrid({
  grid,
  determiners,
  selected
}: PropsWithoutRef<{ grid: GridData | undefined; determiners: Point[]; selected: boolean }>) {
  const complete = useMemo(() => {
    return grid?.every((row) => row.every((val) => val != undefined)) ?? false;
  }, [grid]);
  const error = useMemo(() => {
    if (!complete) return false;
    const sorted: Record<PowerUpValue, number> = {
      'Super Mushroom': 0,
      'Fire Flower': 0,
      'Propeller Mushroom': 0,
      'Ice Flower': 0,
      'Penguin Suit': 0,
      'Mini Mushroom': 0,
      Star: 0,
      'Bowser Junior': 0,
      Bowser: 0
    };
    grid!.forEach((row) => row.forEach((val) => sorted[val!]++));

    if (sorted['Bowser'] != 2 || sorted['Bowser Junior'] != 2) return true;

    return Object.values(sorted).some((val) => val % 2 != 0);
  }, [complete, grid]);

  return (
    <div
      className={`${
        error
          ? 'bg-red-300 dark:bg-red-700'
          : complete
          ? 'bg-green-200 dark:bg-green-700'
          : 'bg-gray-400 dark:bg-gray-800'
      } ${
        selected ? 'outline-indigo-500 dark:outline-indigo-700' : 'outline-transparent'
      } outline-1 p-0.5 rounded-sm grid grid-cols-6 grid-rows-3 gap-0.5 transition-colors`}
    >
      {grid?.map((row, rowIndex) =>
        row.map((val, colIndex) => (
          <span
            className={`row-span-${rowIndex + 1} col-span-${colIndex + 1} contents`}
            key={rowIndex * 6 + colIndex}
          >
            <BuilderMiniViewTile
              powerUp={val}
              determiner={determiners.some(([row, col]) => rowIndex == row && colIndex == col)}
            />
          </span>
        ))
      )}
    </div>
  );
}

function BuilderMiniViewWorld({
  grids,
  determiners,
  selectedGrid
}: PropsWithoutRef<{
  grids: (GridData | undefined)[];
  determiners: Point[];
  selectedGrid: number | undefined;
}>) {
  const complete = useMemo(
    () =>
      grids.every((grid) => grid?.every((row) => row.every((val) => val != undefined)) ?? false),
    [grids]
  );
  return (
    <div
      className={`grid grid-rows-3 grid-cols-2 gap-0.5 p-0.5 rounded-md ${
        complete ? 'bg-green-300 dark:bg-green-900' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      {grids.map((grid, i) => (
        <span className={`row-span-${Math.floor(i / 2) + 1} col-span-${i % 3} contents`} key={i}>
          <BuilderMiniViewGrid selected={selectedGrid == i} grid={grid} determiners={determiners} />
        </span>
      ))}
    </div>
  );
}

export default function BuilderMiniView({
  worlds,
  selectedWorld,
  selectedGrid
}: PropsWithoutRef<{
  worlds: (
    | {
        grids: (GridData | undefined)[];
        determiners: Point[];
      }
    | undefined
  )[];
  selectedWorld: number;
  selectedGrid: number;
}>) {
  return (
    <div className="grid grid-rows-3 grid-cols-3 gap-0.5 mb-8">
      {worlds?.map((data, i) => (
        <span key={i} className={`col-span-${Math.floor(i / 3) + 1} row-span-${(i % 3) + 1}`}>
          {data && (
            <BuilderMiniViewWorld
              selectedGrid={selectedWorld == i ? selectedGrid : undefined}
              grids={data.grids}
              determiners={data.determiners}
            />
          )}
        </span>
      ))}
    </div>
  );
}
