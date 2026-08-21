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

  // Generous track pill dimensions (~28-32px height)
  const trackWidth = isSmall ? 46 : 58;
  const trackHeight = isSmall ? 25 : 32;
  const knobSize = isSmall ? 19 : 24;
  const padding = 4;
  const travelDistance = trackWidth - knobSize - padding * 2;

  // Track styling: Recessed groove with inset shadows
  const trackStyle = {
    width: `${trackWidth}px`,
    height: `${trackHeight}px`,
    borderRadius: "9999px",
    background: checked ? "#bfaefc" : "#212028",
    border: checked
      ? "1px solid rgba(170, 150, 240, 0.6)"
      : "1px solid rgba(255, 255, 255, 0.07)",
    boxShadow: checked
      ? "inset 0 2px 5px 0 rgba(40, 20, 80, 0.35), inset 0 -1px 2px 0 rgba(255, 255, 255, 0.45), inset 0 0 0 1px rgba(160, 140, 235, 0.5)"
      : "inset 0 2px 5px 0 rgba(0, 0, 0, 0.8), inset 0 -1px 1px 0 rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(0, 0, 0, 0.6)",
    transition:
      "background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1)",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  // Knob styling: Tactile 3D button floating on top with soft shadow beneath
  const knobWidth = isActive ? knobSize + (isSmall ? 2 : 3) : knobSize;
  const translateX = checked ? travelDistance : 0;

  const knobStyle = {
    width: `${knobWidth}px`,
    height: `${knobSize}px`,
    borderRadius: "9999px",
    top: `${padding - 1}px`,
    left: `${padding - 1}px`,
    transform: `translateX(${translateX}px)`,
    background: checked
      ? "#ffffff"
      : "linear-gradient(180deg, #4c4b57 0%, #353440 100%)",
    border: checked
      ? "1px solid rgba(255, 255, 255, 0.95)"
      : "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: checked
      ? "0 3px 6px 0 rgba(45, 25, 90, 0.45), 0 1px 2px 0 rgba(20, 10, 50, 0.35)"
      : "0 3px 6px 0 rgba(0, 0, 0, 0.8), 0 1px 2px 0 rgba(10, 8, 20, 0.9), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)",
    transition:
      "transform 220ms cubic-bezier(0.34, 1.35, 0.64, 1), width 160ms ease, background-color 200ms ease, box-shadow 200ms ease",
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
