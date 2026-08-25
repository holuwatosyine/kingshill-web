import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type LiquidButtonProps = {
  children: ReactNode;
  to: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * Brandstewards liquid button treatment.
 *
 * The effect is intentionally CSS-driven: the conic-gradient edge provides the
 * continuous liquid orbit and the pointer highlight follows the delegated
 * --pointer-xp / --pointer-yp values from useBrandGlassShine.
 */
export const LiquidButton = ({ children, to, className = "", ariaLabel }: LiquidButtonProps) => (
  <Link to={to} aria-label={ariaLabel} className={`kh-liquid-button ${className}`} data-cursor="liquid">
    <span className="kh-liquid-button__label">{children}</span>
  </Link>
);

export default LiquidButton;
