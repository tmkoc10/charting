"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";

interface DrawerResizeHandleProps {
  onResize: (newHeight: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  currentHeight: number;
  isDrawerOpen: boolean;
}

export function DrawerResizeHandle({
  onResize,
  onResizeStart,
  onResizeEnd,
  currentHeight,
  isDrawerOpen
}: DrawerResizeHandleProps) {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(0);
  const targetHeight = useRef(currentHeight);

  // Update target height when currentHeight changes externally
  useEffect(() => {
    targetHeight.current = currentHeight;
  }, [currentHeight]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const deltaY = startY.current - e.clientY; // Inverted because we want upward drag to increase height
    const viewportHeight = window.innerHeight;
    const deltaPercentage = (deltaY / viewportHeight) * 100;
    const newHeight = startHeight.current + deltaPercentage;

    // Update target height and call onResize immediately for real-time updates
    const constrainedHeight = Math.max(0, Math.min(92, newHeight));
    targetHeight.current = constrainedHeight;

    // Call onResize directly for immediate updates during dragging
    onResize(constrainedHeight);
  }, [onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    // Final update to ensure we're at the exact target with proper synchronization
    requestAnimationFrame(() => {
      onResize(targetHeight.current);
      // Notify parent that resizing ended after the final resize
      onResizeEnd?.();
    });

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove, onResize, onResizeEnd]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const deltaY = startY.current - e.touches[0].clientY;
    const viewportHeight = window.innerHeight;
    const deltaPercentage = (deltaY / viewportHeight) * 100;
    const newHeight = startHeight.current + deltaPercentage;

    // Update target height and call onResize immediately for real-time updates
    const constrainedHeight = Math.max(0, Math.min(92, newHeight));
    targetHeight.current = constrainedHeight;

    // Call onResize directly for immediate updates during dragging
    onResize(constrainedHeight);
  }, [onResize]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);

    // Final update to ensure we're at the exact target with proper synchronization
    requestAnimationFrame(() => {
      onResize(targetHeight.current);
      // Notify parent that resizing ended after the final resize
      onResizeEnd?.();
    });

    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove, onResize, onResizeEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;

    // If drawer is closed, start with a minimum height to allow opening
    const initialHeight = isDrawerOpen ? currentHeight : 0;
    startHeight.current = initialHeight;
    targetHeight.current = initialHeight;

    // Notify parent that resizing started
    onResizeStart?.();

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [currentHeight, isDrawerOpen, handleMouseMove, handleMouseUp, onResizeStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.touches[0].clientY;

    // If drawer is closed, start with a minimum height to allow opening
    const initialHeight = isDrawerOpen ? currentHeight : 0;
    startHeight.current = initialHeight;
    targetHeight.current = initialHeight;

    // Notify parent that resizing started
    onResizeStart?.();

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [currentHeight, isDrawerOpen, handleTouchMove, handleTouchEnd, onResizeStart]);

  return (
    <div className="relative">
      {/* Invisible interactive resize handle - matches standard 4px spacing */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="w-full h-1 cursor-ns-resize touch-none select-none relative"
      />

      {/* Height indicator tooltip */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-sm z-50 ${
              theme === 'dark'
                ? 'bg-zinc-800/95 text-blue-300 border border-zinc-600/50'
                : 'bg-white/95 text-blue-600 border border-zinc-300/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-[10px] opacity-70">HEIGHT</span>
              <span className="text-sm font-bold">{Math.round(targetHeight.current)}%</span>
            </div>
            {/* Tooltip arrow */}
            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent ${
              theme === 'dark' ? 'border-t-zinc-800/95' : 'border-t-white/95'
            }`}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
