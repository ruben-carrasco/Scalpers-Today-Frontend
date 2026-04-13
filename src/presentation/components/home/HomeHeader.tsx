import React from 'react';
import { View } from 'react-native';
import { Activity } from 'lucide-react-native';
import { Typography } from '../common/Typography';

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
  return (
    <View style={{ paddingTop: paddingTop + 20 }} className="px-6 pb-6 bg-bg-primary">
      <View className="flex-row justify-between items-start">
        <View>
          <Typography variant="h1" weight="bold" className="mb-1 text-text-primary">
            {userName}
          </Typography>
          <Typography variant="body" color="secondary" weight="medium">
            {formatDateShort()}
          </Typography>
        </View>
        <View className="bg-[#18181B] px-4 py-2 rounded-full border border-[#27272A]">
          <Typography variant="body" weight="bold" className="text-text-primary tracking-widest font-mono">
            {currentTime}
          </Typography>
        </View>
      </View>
    </View>
  );
}
