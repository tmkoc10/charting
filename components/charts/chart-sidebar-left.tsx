"use client";

import { useTheme } from "@/lib/theme-context";

interface ChartSidebarLeftProps {
  isCrosshairMode: boolean;
  onCrosshairToggle: (value: boolean) => void;
}

export function ChartSidebarLeft({ isCrosshairMode, onCrosshairToggle }: ChartSidebarLeftProps) {
  const { theme, toggleTheme } = useTheme();

  const toggleCursor = () => {
    onCrosshairToggle(!isCrosshairMode);
  };

  return (
    <div className="w-full h-full bg-black border border-zinc-800 rounded flex flex-col">
      {/* Mouse Cursor Logo - No divider below */}
      <div
        className="w-full flex justify-center pt-3 !border-0 !border-none"
        style={{
          borderBottom: 'none !important',
          borderTop: 'none !important',
          position: 'relative'
        }}
      >
        <button
          onClick={toggleCursor}
          className="p-2 rounded hover:bg-zinc-800 transition-colors duration-200 !border-0 !border-none"
          style={{ borderBottom: 'none !important', borderTop: 'none !important' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-zinc-400 hover:text-zinc-300"
          >
            {isCrosshairMode ? (
              // Crosshair - horizontal and vertical lines intersecting
              <>
                <line
                  x1="12"
                  y1="2"
                  x2="12"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="2"
                  y1="12"
                  x2="22"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              // Pointer cursor
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Theme Toggle Button */}
      <div className="w-full flex justify-center pt-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-zinc-800 transition-colors duration-200"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-zinc-400 hover:text-zinc-300"
          >
            {theme === 'dark' ? (
              // Moon icon - hollow/outline style
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              // Sun icon - hollow/outline style
              <>
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="1"
                  x2="12"
                  y2="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="21"
                  x2="12"
                  y2="23"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="4.22"
                  y1="4.22"
                  x2="5.64"
                  y2="5.64"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="18.36"
                  y1="18.36"
                  x2="19.78"
                  y2="19.78"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="1"
                  y1="12"
                  x2="3"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="21"
                  y1="12"
                  x2="23"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="4.22"
                  y1="19.78"
                  x2="5.64"
                  y2="18.36"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="18.36"
                  y1="5.64"
                  x2="19.78"
                  y2="4.22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
