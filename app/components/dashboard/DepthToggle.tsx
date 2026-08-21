import { useState, type KeyboardEvent, type ButtonHTMLAttributes } from "react";

export interface DepthToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "default" | "small";
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export function DepthToggle({
  checked,
  onChange,
  disabled = false,
  size = "default",
  id,
  className = "",
  "aria-label": ariaLabel,
  ...props
}: DepthToggleProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    if (disabled || !onChange) return;
    onChange(!checked);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || !onChange) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const isSmall = size === "small";

  // Sleek compact dimensions matching reference
  const trackWidth = isSmall ? 36 : 44;
  const trackHeight = isSmall ? 20 : 24;
  const knobSize = isSmall ? 14 : 18;
  const padding = 3;
  const travelDistance = trackWidth - knobSize - padding * 2;

  // Track styling: Flat background with subtle recessed outline
  const trackStyle = {
    width: `${trackWidth}px`,
    height: `${trackHeight}px`,
    borderRadius: "9999px",
    background: checked ? "#c4b5fd" : "#2d2d34",
    border: checked ? "1px solid #b39ef8" : "1px solid #1e1e24",
    boxShadow: checked
      ? "inset 0 1px 2px rgba(0, 0, 0, 0.1)"
      : "inset 0 1px 2px rgba(0, 0, 0, 0.4)",
    transition:
      "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  // Knob styling: Flat tactile disc with crisp bottom shadow
  const knobWidth = isActive ? knobSize + (isSmall ? 1 : 2) : knobSize;
  const translateX = checked ? travelDistance : 0;

  const knobStyle = {
    width: `${knobWidth}px`,
    height: `${knobSize}px`,
    borderRadius: "9999px",
    top: `${padding - 1}px`,
    left: `${padding - 1}px`,
    transform: `translateX(${translateX}px)`,
    background: checked ? "#ffffff" : "#50505a",
    boxShadow: checked
      ? "0 2px 0 0 #9d87e8, 0 2px 3px rgba(110, 80, 190, 0.35)"
      : "0 2px 0 0 #1c1c22, 0 2px 3px rgba(0, 0, 0, 0.4)",
    transition:
      "transform 200ms cubic-bezier(0.25, 1, 0.5, 1), width 140ms ease, background-color 180ms ease, box-shadow 180ms ease",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      id={id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => !disabled && setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      style={trackStyle}
      className={`relative inline-flex items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-[#8fd3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#11121b] p-0 flex-shrink-0 ${className}`}
      {...props}
    >
      <span
        style={knobStyle}
        className="absolute pointer-events-none block"
      />
    </button>
  );
}
