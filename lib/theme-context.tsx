"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Check if current route should use theme system (only charts page)
  const isChartsPage = pathname?.startsWith('/charts');

  // Handle hydration mismatch by only setting theme after mount
  useEffect(() => {
    setMounted(true);

    // Only apply theme system to charts page
    if (!isChartsPage) return;

    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem('charts-theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
    } else {
      // Default to light theme for charts
      setThemeState('light');
      localStorage.setItem('charts-theme', 'light');
    }
  }, [isChartsPage]);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (isChartsPage) {
      // Remove existing theme classes
      root.classList.remove('light', 'dark');

      // Add current theme class
      root.classList.add(theme);

      // Save to localStorage with charts-specific key
      localStorage.setItem('charts-theme', theme);
    } else {
      // For non-charts pages, force light theme classes for landing page
      root.classList.remove('light', 'dark');
      root.classList.add('light');
    }
  }, [theme, mounted, isChartsPage]);

  const setTheme = (newTheme: Theme) => {
    // Only allow theme changes on charts page
    if (isChartsPage) {
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    // Only allow theme toggle on charts page
    if (isChartsPage) {
      setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className={isChartsPage ? "light" : "light"}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
