import React, { useEffect, useRef } from 'react';
import { useSpatialNav } from '../../context/SpatialNavContext';

interface FocusableItemProps {
  id: string;
  children: React.ReactNode | ((isFocused: boolean) => React.ReactNode);
  className?: string;
  focusedClassName?: string;
  unfocusedClassName?: string;
  onSelect?: () => void;
  onClick?: () => void;
  dataNavUp?: string;
  dataNavDown?: string;
  dataNavLeft?: string;
  dataNavRight?: string;
  as?: 'button' | 'div' | 'a';
  ariaLabel?: string;
  disabled?: boolean;
}

export const FocusableItem: React.FC<FocusableItemProps> = ({
  id,
  children,
  className = '',
  focusedClassName = 'border-[#ff7a1a] shadow-[0_0_24px_rgba(255,122,26,0.55)] scale-[1.03] z-20',
  unfocusedClassName = 'border-transparent',
  onSelect,
  onClick,
  dataNavUp,
  dataNavDown,
  dataNavLeft,
  dataNavRight,
  as: Component = 'div',
  ariaLabel,
  disabled = false,
}) => {
  const { focusedId, setFocusedId, registerFocusable, unregisterFocusable } = useSpatialNav();
  const ref = useRef<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement | null>(null);
  const isFocused = focusedId === id && !disabled;

  useEffect(() => {
    if (disabled) {
      unregisterFocusable(id);
      return;
    }
    const currentRef = ref.current;
    if (currentRef) {
      registerFocusable(id, currentRef);
    }
    return () => {
      unregisterFocusable(id);
    };
  }, [id, disabled, registerFocusable, unregisterFocusable]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setFocusedId(id);
    if (onClick) onClick();
    if (onSelect) onSelect();
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setFocusedId(id);
    }
  };

  return (
    <Component
      ref={ref as any}
      tabIndex={disabled ? -1 : 0}
      data-focusable="true"
      data-focus-id={id}
      data-nav-up={dataNavUp}
      data-nav-down={dataNavDown}
      data-nav-left={dataNavLeft}
      data-nav-right={dataNavRight}
      aria-label={ariaLabel}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`tv-focusable cursor-pointer border-2 outline-none select-none ${className} ${
        isFocused ? focusedClassName : unfocusedClassName
      } ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
    >
      {typeof children === 'function' ? children(isFocused) : children}
    </Component>
  );
};
