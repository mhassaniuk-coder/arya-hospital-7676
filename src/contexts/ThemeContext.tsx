import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

// Theme mode type - includes 'system' option for automatic OS preference detection
type ThemeMode = 'light' | 'dark' | 'system';

// Resolved theme type - the actual applied theme (always 'light' or 'dark')
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  // User's theme preference (may be 'system')
  theme: ThemeMode;

  // The actual applied theme (resolved from 'system' if needed)
  resolvedTheme: ResolvedTheme;

  // The system's preferred theme (from OS settings)
  systemPreference: ResolvedTheme;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Utility boolean flags
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// LocalStorage key for theme persistence
const THEME_STORAGE_KEY = 'nexushealth-theme';

/**
 * Get the system's preferred color scheme
 */
function getSystemPreference(): ResolvedTheme {
  // Default to 'light' if window is not available (SSR safety)
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve the actual theme to apply based on user preference
 */
function resolveTheme(theme: ThemeMode, systemPreference: ResolvedTheme): ResolvedTheme {
  if (theme === 'system') {
    return systemPreference;
  }
  return theme;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with proper hydration support
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    // Default to system preference
    return 'system';
  });

  // Track system preference
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>(() => {
    return getSystemPreference();
  });

  // Calculate resolved theme
  const resolvedTheme = useMemo(() => {
    return resolveTheme(theme, systemPreference);
  }, [theme, systemPreference]);

  // Utility booleans
  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';
  const isSystem = theme === 'system';

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Handler for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    // Set initial system preference
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    // Add event listener for changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Add the resolved theme class
    root.classList.add(resolvedTheme);

    // Update localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#020617' : '#f8fafc');
    }
  }, [theme, resolvedTheme]);

  // Set theme with proper state management
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  // Toggle between themes (cycles: light -> dark -> system -> light)
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    theme,
    resolvedTheme,
    systemPreference,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
    isSystem,
  }), [theme, resolvedTheme, systemPreference, setTheme, toggleTheme, isDark, isLight, isSystem]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme context
 * @throws Error if used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Re-export types for external use
export type { ThemeMode, ResolvedTheme };
