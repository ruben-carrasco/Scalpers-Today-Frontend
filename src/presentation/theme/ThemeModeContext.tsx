import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_MODE_STORAGE_KEY = '@scalper_today/theme_mode';

type ThemeModeContextValue = {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  isThemeReady: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_MODE_STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setThemeModeState(storedTheme);
          setColorScheme(storedTheme);
        } else {
          setColorScheme('dark');
        }
      } finally {
        setIsThemeReady(true);
      }
    };

    loadThemeMode();
  }, [setColorScheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    setColorScheme(mode);
    await AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  };

  return (
    <ThemeModeContext.Provider
      value={{
        themeMode,
        isDarkMode: themeMode === 'dark',
        isThemeReady,
        setThemeMode,
      }}
    >
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
}
