"use client";


import { useTheme } from "@/lib/theme-context";

// Navigation Icon Components
const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
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
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main alarm clock body - hollow outline */}
    <circle
      cx="12"
      cy="12.5"
      r="8.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Clock hands */}
    <path
      d="M12 7.5V12.5L15.5 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left alarm bell - hollow outline */}
    <ellipse
      cx="5"
      cy="6.5"
      rx="1.8"
      ry="2.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      transform="rotate(-25 5 6.5)"
    />
    {/* Right alarm bell - hollow outline */}
    <ellipse
      cx="19"
      cy="6.5"
      rx="1.8"
      ry="2.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      transform="rotate(25 19 6.5)"
    />
    {/* Wind-up key on top - hollow outline */}
    <rect
      x="11.2"
      y="2.5"
      width="1.6"
      height="3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      rx="0.8"
    />
    {/* Clock feet - hollow outline */}
    <ellipse
      cx="7"
      cy="21.5"
      rx="1.5"
      ry="0.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <ellipse
      cx="17"
      cy="21.5"
      rx="1.5"
      ry="0.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
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
    width="24"
    height="24"
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

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Calendar main body - hollow outline */}
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Calendar header line */}
    <line
      x1="16"
      y1="2"
      x2="16"
      y2="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="8"
      y1="2"
      x2="8"
      y2="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Calendar divider line */}
    <line
      x1="3"
      y1="10"
      x2="21"
      y2="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Bell body - hollow outline */}
    <path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bell clapper - hollow outline */}
    <path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AILogoIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Letter "A" - hollow outline with transparent center */}
    <path
      d="M3 20L7.5 6H8.5L13 20H11.2L10.1 17H5.9L4.8 20H3ZM6.5 15H9.5L8 10.5L6.5 15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Letter "I" - hollow outline with transparent center */}
    <path
      d="M16 6H21V8H19V18H21V20H16V18H18V8H16V6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const QuestionMarkIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Question mark shape - larger and more prominent */}
    <path
      d="M7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5C16.5 9.5 15 10.5 13.5 11.5C12.5 12.1667 12 12.5 12 13.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Question mark dot - larger */}
    <circle
      cx="12"
      cy="18"
      r="1"
      fill="currentColor"
    />
  </svg>
);

interface NavigationIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  theme: 'light' | 'dark';
}

interface ChartSidebarRightProps {
  onTabClick?: (tabId: string) => void;
  activeTab?: string;
  isDrawerOpen?: boolean;
}

const NavigationIcon = ({ icon, label, onClick, isActive = false, theme }: NavigationIconProps) => (
  <button
    onClick={onClick}
    className={`p-2 rounded transition-colors duration-200 group ${
      isActive
        ? (theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200')
        : (theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-200')
    }`}
    aria-label={label}
    title={label}
  >
    <div className={`${
      isActive
        ? (theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700')
        : (theme === 'dark' ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-700')
    }`}>
      {icon}
    </div>
  </button>
);

export function ChartSidebarRight({ onTabClick, activeTab, isDrawerOpen }: ChartSidebarRightProps) {
  const { theme } = useTheme();

  const handleIconClick = (iconName: string) => {
    if (onTabClick) {
      onTabClick(iconName);
    } else {
      console.log(`${iconName} clicked`);
    }
  };

  return (
    <div className={`w-full h-full rounded flex flex-col justify-between ${
      theme === 'dark'
        ? 'bg-black border border-zinc-800'
        : 'bg-white border border-zinc-300'
    }`}>
      {/* Main Navigation Icons */}
      <div className="flex flex-col items-center pt-3 space-y-4">
        <NavigationIcon
          icon={<BookmarkIcon />}
          label="Bookmarks / Saved Items"
          onClick={() => handleIconClick('bookmark')}
          isActive={isDrawerOpen && activeTab === 'bookmark'}
          theme={theme}
        />

        <NavigationIcon
          icon={<ClockIcon />}
          label="Alerts / Notifications"
          onClick={() => handleIconClick('clock')}
          isActive={isDrawerOpen && activeTab === 'clock'}
          theme={theme}
        />

        <NavigationIcon
          icon={<LayersIcon />}
          label="Layers / Stack"
          onClick={() => handleIconClick('layers')}
          isActive={isDrawerOpen && activeTab === 'layers'}
          theme={theme}
        />

        <NavigationIcon
          icon={<ChatIcon />}
          label="Chat / Messages"
          onClick={() => handleIconClick('chat')}
          isActive={isDrawerOpen && activeTab === 'chat'}
          theme={theme}
        />
      </div>

      {/* Bottom Icons - AI Logo, Calendar, Notifications, and FAQ */}
      <div className="flex flex-col items-center pb-3 space-y-4">
        <NavigationIcon
          icon={<AILogoIcon />}
          label="AI Assistant"
          onClick={() => handleIconClick('ai')}
          isActive={isDrawerOpen && activeTab === 'ai'}
          theme={theme}
        />

        <NavigationIcon
          icon={<CalendarIcon />}
          label="Calendar / Date Picker"
          onClick={() => handleIconClick('calendar')}
          isActive={isDrawerOpen && activeTab === 'calendar'}
          theme={theme}
        />

        <NavigationIcon
          icon={<BellIcon />}
          label="Notifications / Alerts"
          onClick={() => handleIconClick('notifications')}
          isActive={isDrawerOpen && activeTab === 'notifications'}
          theme={theme}
        />

        <NavigationIcon
          icon={<QuestionMarkIcon />}
          label="FAQ / Help"
          onClick={() => handleIconClick('faq')}
          isActive={isDrawerOpen && activeTab === 'faq'}
          theme={theme}
        />
      </div>
    </div>
  );
}
