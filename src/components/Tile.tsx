import type { PropsWithChildren } from 'react';

export type Props = {
  danger?: boolean;
  highlight?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

export default function Tile({
  children,
  danger,
  highlight,
  selected,
  onClick
}: PropsWithChildren<Props>) {
  let classes =
    'bg-gray-100 dark:bg-gray-900 p-3 rounded-lg max-md:rounded-md transition w-full h-full';

  if (danger) classes += ' bg-red-200 dark:bg-red-950';
  if (highlight) classes += ' bg-green-200 dark:bg-green-900';
  if (selected)
    classes += ' bg-indigo-500 dark:bg-indigo-700 inset-shadow-[0_-0.3rem] inset-shadow-indigo-800';

  if (onClick)
    return (
      <button className={classes} onClick={onClick}>
        {children}
      </button>
    );
  else return <div className={classes}>{children}</div>;
}
