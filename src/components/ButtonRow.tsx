import type { PropsWithChildren } from 'react';

export default function ButtonRow({ children }: PropsWithChildren) {
  return <span className="flex gap-2 mt-2 mb-1 flex-wrap justify-center">{children}</span>;
}
