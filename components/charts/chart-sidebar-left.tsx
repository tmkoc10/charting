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
    <div className={`w-full h-full rounded flex flex-col ${
      theme === 'dark'
        ? 'bg-black border border-zinc-800'
        : 'bg-white border border-zinc-300'
    }`}>
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
          className={`p-2 rounded transition-colors duration-200 !border-0 !border-none ${
            theme === 'dark'
              ? 'hover:bg-zinc-800'
              : 'hover:bg-zinc-200'
          }`}
          style={{ borderBottom: 'none !important', borderTop: 'none !important' }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300'
              : 'text-zinc-600 hover:text-zinc-700'
            }
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
          className={`p-2 rounded transition-colors duration-200 ${
            theme === 'dark'
              ? 'hover:bg-zinc-800'
              : 'hover:bg-zinc-200'
          }`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300'
              : 'text-zinc-600 hover:text-zinc-700'
            }
          >
            {theme === 'light' ? (
              // Moon icon - hollow/outline style (show in light mode to switch to dark)
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              // Sun icon - hollow/outline style (show in dark mode to switch to light)
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

      {/* New Navigation Icon - Four Lines with Dots */}
      <div className="w-full flex justify-center pt-3">
        <button
          onClick={() => console.log('Navigation icon clicked')}
          className={`p-2 rounded transition-colors duration-200 ${
            theme === 'dark'
              ? 'hover:bg-zinc-800'
              : 'hover:bg-zinc-200'
          }`}
          title="Navigation Menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300'
              : 'text-zinc-600 hover:text-zinc-700'
            }
          >
            {/* Four horizontal parallel lines with proper spacing */}
            {/* Line 1 (top) */}
            <line
              x1="4"
              y1="5"
              x2="20"
              y2="5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Line 2 (second from top) */}
            <line
              x1="4"
              y1="9.5"
              x2="20"
              y2="9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Line 3 (third from top) */}
            <line
              x1="4"
              y1="14"
              x2="20"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Line 4 (bottom) */}
            <line
              x1="4"
              y1="18.5"
              x2="20"
              y2="18.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Dot on 2nd line (right side) - hollow/outline style */}
            <circle
              cx="18"
              cy="9.5"
              r="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dot on 4th line (left side) - hollow/outline style */}
            <circle
              cx="6"
              cy="18.5"
              r="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Letter "T" Navigation Icon */}
      <div className="w-full flex justify-center pt-3">
        <button
          onClick={() => console.log('T navigation icon clicked')}
          className={`p-2 rounded transition-colors duration-200 ${
            theme === 'dark'
              ? 'hover:bg-zinc-800'
              : 'hover:bg-zinc-200'
          }`}
          title="Text Tool"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300'
              : 'text-zinc-600 hover:text-zinc-700'
            }
          >
            {/* Capital letter "T" - impressive, bigger hollow outline with transparent center */}
            <path
              d="M4 4H20V7H15V21H9V7H4V4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {/* Smiling Emoji Navigation Icon */}
      <div className="w-full flex justify-center pt-3">
        <button
          onClick={() => console.log('Smiling emoji icon clicked')}
          className={`p-2 rounded transition-colors duration-200 ${
            theme === 'dark'
              ? 'hover:bg-zinc-800'
              : 'hover:bg-zinc-200'
          }`}
          title="Emoji Tool"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300'
              : 'text-zinc-600 hover:text-zinc-700'
            }
          >
            {/* Impressive smiling emoji - bigger and more detailed hollow/outline style */}
            {/* Main face circle - bigger hollow outline */}
            <circle
              cx="12"
              cy="12"
              r="9.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Left eye - bigger hollow circle with inner detail */}
            <circle
              cx="8.5"
              cy="8.5"
              r="2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Left eye inner circle for depth */}
            <circle
              cx="8.5"
              cy="8.5"
              r="0.8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Right eye - bigger hollow circle with inner detail */}
            <circle
              cx="15.5"
              cy="8.5"
              r="2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Right eye inner circle for depth */}
            <circle
              cx="15.5"
              cy="8.5"
              r="0.8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Enhanced smiling mouth - bigger curved path with more detail */}
            <path
              d="M6.5 14.5C7.5 17.5 9.5 19 12 19C14.5 19 16.5 17.5 17.5 14.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Cheek dimples for extra charm */}
            <circle
              cx="5.5"
              cy="13"
              r="0.8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle
              cx="18.5"
              cy="13"
              r="0.8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {/* Tilted Scale/Balance Navigation Icon */}
      <div className="w-full flex justify-center pt-3">
        <button
          onClick={() => console.log('Scale/balance icon clicked')}
          className={`p-2 rounded transition-colors duration-200 ${
            theme === 'dark'
              ? 'hover:bg-zinc-800'
              : 'hover:bg-zinc-200'
          }`}
          title="Ruler/Measuring Scale Tool"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300'
              : 'text-zinc-600 hover:text-zinc-700'
            }
          >
            {/* Impressive bigger tilted measuring ruler/scale - hollow/outline style with reverse rotation */}
            <g transform="rotate(-15 12 12)">
              {/* Main ruler body - bigger rectangular outline */}
              <rect
                x="2"
                y="8"
                width="20"
                height="6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Major measurement marks (every 2.5 units) - bigger and more visible */}
              <line
                x1="4"
                y1="8"
                x2="4"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="6.5"
                y1="8"
                x2="6.5"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="8"
                x2="9"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="11.5"
                y1="8"
                x2="11.5"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="14"
                y1="8"
                x2="14"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="16.5"
                y1="8"
                x2="16.5"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="19"
                y1="8"
                x2="19"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* Minor measurement marks (between major marks) - bigger */}
              <line
                x1="5.25"
                y1="8"
                x2="5.25"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="7.75"
                y1="8"
                x2="7.75"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="10.25"
                y1="8"
                x2="10.25"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="12.75"
                y1="8"
                x2="12.75"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="15.25"
                y1="8"
                x2="15.25"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="17.75"
                y1="8"
                x2="17.75"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Number markings (bigger circles to represent numbers) */}
              <circle
                cx="4"
                cy="13"
                r="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle
                cx="9"
                cy="13"
                r="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle
                cx="14"
                cy="13"
                r="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle
                cx="19"
                cy="13"
                r="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Additional detail marks for professional look */}
              <line
                x1="3"
                y1="10"
                x2="3.5"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="20.5"
                y1="10"
                x2="21"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </button>
      </div>

      {/* Dustbin/Trash Icon */}
      <div className="w-full flex justify-center pt-3">
        <button
          onClick={() => console.log('Dustbin icon clicked')}
          className={`p-2 rounded transition-colors duration-200 ${
            theme === 'dark'
              ? 'hover:bg-zinc-800'
              : 'hover:bg-zinc-200'
          }`}
          title="Delete/Trash Tool"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === 'dark'
              ? 'text-zinc-400 hover:text-zinc-300'
              : 'text-zinc-600 hover:text-zinc-700'
            }
          >
            {/* Trash can lid */}
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main trash can body */}
            <path
              d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Handle/top part */}
            <path
              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Vertical lines inside trash can */}
            <line
              x1="10"
              y1="11"
              x2="10"
              y2="17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <line
              x1="14"
              y1="11"
              x2="14"
              y2="17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
