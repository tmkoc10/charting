"use client";

interface ChartSidebarLeftProps {
  isCrosshairMode: boolean;
  onCrosshairToggle: (value: boolean) => void;
}

export function ChartSidebarLeft({ isCrosshairMode, onCrosshairToggle }: ChartSidebarLeftProps) {
  const toggleCursor = () => {
    onCrosshairToggle(!isCrosshairMode);
  };

  return (
    <div className="w-full h-full bg-black border border-zinc-800 rounded flex flex-col">
      {/* Mouse Cursor Logo - Hollow/Outline at Top */}
      <div className="w-full flex justify-center pt-3 pb-2">
        <button
          onClick={toggleCursor}
          className="p-2 rounded hover:bg-zinc-800 transition-colors duration-200"
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
      
      {/* Horizontal Divider */}
      <div className="w-full flex justify-center pb-3">
        <div className="h-px w-8 bg-zinc-600"></div>
      </div>
    </div>
  );
}
