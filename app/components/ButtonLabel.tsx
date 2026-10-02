import type { ReactNode } from "react";

export function ButtonLabel({ children }: { children: ReactNode }) {
  return (
    <span className="button-roll">
      <span className="button-roll-copy">{children}</span>
      <span aria-hidden="true" className="button-roll-copy button-roll-next">{children}</span>
    </span>
  );
}
