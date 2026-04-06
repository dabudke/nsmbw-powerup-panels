import type { PropsWithChildren } from 'react';

type Props =
  | {
      square?: boolean;
      disabled?: boolean;
      onClick?: () => void;
      href?: undefined;
      active?: boolean;
    }
  | {
      square?: undefined;
      href: string;
      onClick?: undefined;
      disabled?: undefined;
      active?: undefined;
    };

export default function Button({
  children,
  disabled = false,
  onClick,
  square = false,
  href,
  active = false
}: PropsWithChildren<Props>) {
  if (href)
    return (
      <a
        href={href}
        className="h-8 text-sm px-2 flex place-items-center pb-[0.2rem] bg-indigo-400 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 active:bg-indigo-600 inset-shadow-[0_-0.2rem] inset-shadow-indigo-500 dark:inset-shadow-indigo-600 rounded-md transition-colors"
      >
        {children}
      </a>
    );
  return (
    <button
      className={`${
        square
          ? 'w-12 h-12 p-2 pb-[0.7rem]'
          : 'h-8 text-sm px-2 flex place-items-center pb-[0.2rem]'
      } ${
        active
          ? 'bg-indigo-600 dark:bg-indigo-700 text-gray-900 dark:text-gray-400'
          : 'bg-indigo-400 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 active:bg-indigo-600 inset-shadow-[0_-0.2rem] inset-shadow-indigo-500 dark:inset-shadow-indigo-600'
      } disabled:bg-gray-300 disabled:dark:bg-gray-500 disabled:text-gray-400 disabled:dark:text-gray-400 rounded-md disabled:inset-shadow-gray-400 disabled:dark:inset-shadow-gray-600 transition-colors`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
