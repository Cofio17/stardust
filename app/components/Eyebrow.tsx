import type { ReactNode } from "react";

import { Logo } from "./Logo";

type EyebrowProps = {
  children: ReactNode;
  /** Matches the Logo variant — use "mono" where amber already carries meaning. */
  variant?: "accent" | "mono";
  className?: string;
};

/** Section label prefixed with the studio mark: [logo] OUR SERVICES */
export function Eyebrow({ children, variant = "accent", className = "" }: EyebrowProps) {
  return (
    <p className={`eyebrow${className ? ` ${className}` : ""}`}>
      <span aria-hidden="true" className="eyebrow-mark">
        <Logo variant={variant} wordmark={false} />
      </span>
      <span>{children}</span>
    </p>
  );
}
