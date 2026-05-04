import React from 'react';
import { View } from 'react-native';
import { Typography } from '../common/Typography';
import { useThemeMode } from '../../theme/ThemeModeContext';

interface HomeHeaderProps {
  userName: string;
  currentTime: string;
  paddingTop: number;
}

const formatDateShort = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  };
  const formatted = now.toLocaleDateString('es-ES', options);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export function HomeHeader({ userName, currentTime, paddingTop }: HomeHeaderProps) {
  const { isDarkMode } = useThemeMode();

  return (
    <View style={{ paddingTop: paddingTop + 20, backgroundColor: isDarkMode ? '#000000' : '#F4F4F5' }} className="px-6 pb-6">
      <View className="flex-row justify-between items-start">
        <View>
          <Typography variant="h1" weight="bold" className="mb-1 text-text-primary">
            {userName}
          </Typography>
          <Typography variant="body" color="secondary" weight="medium">
            {formatDateShort()}
          </Typography>
        </View>
        <View
          className="px-4 py-2 rounded-full border"
          style={{ backgroundColor: isDarkMode ? '#18181B' : '#FFFFFF', borderColor: isDarkMode ? '#27272A' : '#E4E4E7' }}
        >
          <Typography variant="body" weight="bold" className="text-text-primary tracking-widest font-mono">
            {currentTime}
          </Typography>
        </View>
      </View>
    </View>
  );
}
