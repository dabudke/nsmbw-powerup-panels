import type { PropsWithChildren } from 'react';

export default function ButtonRow({ children }: PropsWithChildren) {
  return <span className="flex gap-2 mt-2 flex-wrap justify-center">{children}</span>;
}
