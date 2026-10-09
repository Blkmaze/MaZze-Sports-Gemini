import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface SpatialNavContextType {
  focusedId: string;
  setFocusedId: (id: string) => void;
  registerFocusable: (id: string, ref: HTMLElement | null) => void;
  unregisterFocusable: (id: string) => void;
  navigateDirection: (direction: 'up' | 'down' | 'left' | 'right') => void;
  triggerSelect: () => void;
  triggerBack: () => void;
  triggerKey5: () => void;
  isFocused: (id: string) => boolean;
}

const SpatialNavContext = createContext<SpatialNavContextType | null>(null);

export const SpatialNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [focusedId, setFocusedIdState] = useState<string>('rail-home');
  const elementsMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const listenersMapRef = useRef<Map<string, () => void>>(new Map());

  const registerFocusable = useCallback((id: string, ref: HTMLElement | null) => {
    if (ref) {
      elementsMapRef.current.set(id, ref);
    } else {
      elementsMapRef.current.delete(id);
    }
  }, []);

  const unregisterFocusable = useCallback((id: string) => {
    elementsMapRef.current.delete(id);
  }, []);

  const setFocusedId = useCallback((id: string) => {
    setFocusedIdState(id);
    const el = elementsMapRef.current.get(id);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, []);

  const isFocused = useCallback((id: string) => focusedId === id, [focusedId]);

  // Spatial direction calculation
  const navigateDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const currentEl = elementsMapRef.current.get(focusedId);
    if (!currentEl) {
      // Fallback: focus first available element
      const firstEntry = Array.from(elementsMapRef.current.entries())[0];
      if (firstEntry) {
        setFocusedId(firstEntry[0]);
      }
      return;
    }

    // Check if element has an explicit directional override
    const explicitOverride = currentEl.getAttribute(`data-nav-${direction}`);
    if (explicitOverride && elementsMapRef.current.has(explicitOverride)) {
      setFocusedId(explicitOverride);
      return;
    }

    const currentRect = currentEl.getBoundingClientRect();
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;

    let bestCandidateId: string | null = null;
    let minScore = Infinity;

    // Check all active, visible focusables
    elementsMapRef.current.forEach((candidateEl, candidateId) => {
      if (candidateId === focusedId) return;

      // Ignore elements hidden or in non-active modals
      const candidateRect = candidateEl.getBoundingClientRect();
      if (candidateRect.width === 0 || candidateRect.height === 0) return;
      const style = window.getComputedStyle(candidateEl);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      const candCenterX = candidateRect.left + candidateRect.width / 2;
      const candCenterY = candidateRect.top + candidateRect.height / 2;

      let dx = candCenterX - currentCenterX;
      let dy = candCenterY - currentCenterY;
      let isEligible = false;
      let score = Infinity;

      switch (direction) {
        case 'right':
          // Must be to the right
          if (candCenterX > currentCenterX + 5 || candidateRect.left >= currentRect.right - 10) {
            isEligible = true;
            // Primary distance along X axis, penalty for Y deviation
            const primaryDist = Math.max(0, candidateRect.left - currentRect.right);
            const secondaryDist = Math.abs(candCenterY - currentCenterY);
            // Overlap bonus if vertically aligned
            const verticalOverlap = Math.max(0, Math.min(candidateRect.bottom, currentRect.bottom) - Math.max(candidateRect.top, currentRect.top));
            const overlapBonus = verticalOverlap > 0 ? -40 : 0;
            score = primaryDist + secondaryDist * 2.2 + overlapBonus;
          }
          break;

        case 'left':
          // Must be to the left
          if (candCenterX < currentCenterX - 5 || candidateRect.right <= currentRect.left + 10) {
            isEligible = true;
            const primaryDist = Math.max(0, currentRect.left - candidateRect.right);
            const secondaryDist = Math.abs(candCenterY - currentCenterY);
            const verticalOverlap = Math.max(0, Math.min(candidateRect.bottom, currentRect.bottom) - Math.max(candidateRect.top, currentRect.top));
            const overlapBonus = verticalOverlap > 0 ? -40 : 0;
            score = primaryDist + secondaryDist * 2.2 + overlapBonus;
          }
          break;

        case 'down':
          // Must be below
          if (candCenterY > currentCenterY + 5 || candidateRect.top >= currentRect.bottom - 10) {
            isEligible = true;
            const primaryDist = Math.max(0, candidateRect.top - currentRect.bottom);
            const secondaryDist = Math.abs(candCenterX - currentCenterX);
            const horizontalOverlap = Math.max(0, Math.min(candidateRect.right, currentRect.right) - Math.max(candidateRect.left, currentRect.left));
            const overlapBonus = horizontalOverlap > 0 ? -40 : 0;
            score = primaryDist + secondaryDist * 2.0 + overlapBonus;
          }
          break;

        case 'up':
          // Must be above
          if (candCenterY < currentCenterY - 5 || candidateRect.bottom <= currentRect.top + 10) {
            isEligible = true;
            const primaryDist = Math.max(0, currentRect.top - candidateRect.bottom);
            const secondaryDist = Math.abs(candCenterX - currentCenterX);
            const horizontalOverlap = Math.max(0, Math.min(candidateRect.right, currentRect.right) - Math.max(candidateRect.left, currentRect.left));
            const overlapBonus = horizontalOverlap > 0 ? -40 : 0;
            score = primaryDist + secondaryDist * 2.0 + overlapBonus;
          }
          break;
      }

      if (isEligible && score < minScore) {
        minScore = score;
        bestCandidateId = candidateId;
      }
    });

    if (bestCandidateId) {
      setFocusedId(bestCandidateId);
    }
  }, [focusedId, setFocusedId]);

  const triggerSelect = useCallback(() => {
    const el = elementsMapRef.current.get(focusedId);
    if (el) {
      el.click();
    }
  }, [focusedId]);

  const triggerBack = useCallback(() => {
    // Custom event or dispatch for screens to handle back
    window.dispatchEvent(new CustomEvent('tv-remote-back'));
  }, []);

  const triggerKey5 = useCallback(() => {
    window.dispatchEvent(new CustomEvent('tv-remote-key5'));
  }, []);

  // Global Remote Control Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling behavior for TV arrows
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          navigateDirection('up');
          break;
        case 'ArrowDown':
          navigateDirection('down');
          break;
        case 'ArrowLeft':
          navigateDirection('left');
          break;
        case 'ArrowRight':
          navigateDirection('right');
          break;
        case 'Enter':
          triggerSelect();
          break;
        case 'Escape':
        case 'Backspace':
          triggerBack();
          break;
        case '5':
          triggerKey5();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateDirection, triggerSelect, triggerBack, triggerKey5]);

  return (
    <SpatialNavContext.Provider
      value={{
        focusedId,
        setFocusedId,
        registerFocusable,
        unregisterFocusable,
        navigateDirection,
        triggerSelect,
        triggerBack,
        triggerKey5,
        isFocused,
      }}
    >
      {children}
    </SpatialNavContext.Provider>
  );
};

export const useSpatialNav = () => {
  const context = useContext(SpatialNavContext);
  if (!context) {
    throw new Error('useSpatialNav must be used within a SpatialNavProvider');
  }
  return context;
};
