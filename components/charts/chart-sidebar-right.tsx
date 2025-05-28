"use client";

import { useState } from "react";

// Navigation Icon Components
const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main clock body */}
    <circle
      cx="12"
      cy="12"
      r="7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Clock hands */}
    <path
      d="M12 7V12L15 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left alarm bell */}
    <circle
      cx="6.5"
      cy="8"
      r="1.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Right alarm bell */}
    <circle
      cx="17.5"
      cy="8"
      r="1.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Alert/ringing lines - Left side */}
    <path
      d="M4.2 6.5C4.2 6.5 4.8 5.8 5.5 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3.8 7.5C3.8 7.5 4.5 7 5 7.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Alert/ringing lines - Right side */}
    <path
      d="M19.8 6.5C19.8 6.5 19.2 5.8 18.5 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M20.2 7.5C20.2 7.5 19.5 7 19 7.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface NavigationIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const NavigationIcon = ({ icon, label, onClick, isActive = false }: NavigationIconProps) => (
  <button
    onClick={onClick}
    className={`p-2 rounded transition-colors duration-200 group ${
      isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800'
    }`}
    aria-label={label}
    title={label}
  >
    <div className={`${isActive ? 'text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
      {icon}
    </div>
  </button>
);

export function ChartSidebarRight() {
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const handleIconClick = (iconName: string) => {
    setActiveIcon(activeIcon === iconName ? null : iconName);
    console.log(`${iconName} clicked`);
  };

  return (
    <div className="w-full h-full bg-black border border-zinc-800 rounded flex flex-col">
      {/* Navigation Icons */}
      <div className="flex flex-col items-center pt-3 space-y-4">
        <NavigationIcon
          icon={<BookmarkIcon />}
          label="Bookmarks / Saved Items"
          onClick={() => handleIconClick('bookmark')}
          isActive={activeIcon === 'bookmark'}
        />

        <NavigationIcon
          icon={<ClockIcon />}
          label="Alerts / Notifications"
          onClick={() => handleIconClick('clock')}
          isActive={activeIcon === 'clock'}
        />

        <NavigationIcon
          icon={<LayersIcon />}
          label="Layers / Stack"
          onClick={() => handleIconClick('layers')}
          isActive={activeIcon === 'layers'}
        />

        <NavigationIcon
          icon={<ChatIcon />}
          label="Chat / Messages"
          onClick={() => handleIconClick('chat')}
          isActive={activeIcon === 'chat'}
        />
      </div>
    </div>
  );
}
