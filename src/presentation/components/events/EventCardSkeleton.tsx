import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../common/Skeleton';
import { useThemeMode } from '../../theme/ThemeModeContext';
import { colors } from '../../theme/tokens';

export function EventCardSkeleton() {
  const { isDarkMode } = useThemeMode();
  
  const cardBg = isDarkMode ? colors.bg.modal : '#FFFFFF';
  const cardBorder = isDarkMode ? colors.bg.modalCard : '#E4E4E7';

  return (
    <View className="w-full mb-3">
      <View style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="rounded-3xl p-5 border">
        {/* Header row */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center gap-2">
            <Skeleton width={12} height={12} borderRadius={6} />
            <Skeleton width={50} height={20} borderRadius={6} />
          </View>
          <View className="flex-row gap-2">
            <Skeleton width={40} height={24} borderRadius={6} />
            <Skeleton width={40} height={24} borderRadius={6} />
          </View>
        </View>

        {/* Title */}
        <View className="mb-4 gap-2">
          <Skeleton width="100%" height={24} borderRadius={6} />
          <Skeleton width="70%" height={24} borderRadius={6} />
        </View>

        {/* Bottom row */}
        <View style={{ borderTopColor: cardBorder }} className="flex-row justify-between pt-4 border-t">
          <View className="items-start flex-1 gap-1">
            <Skeleton width={30} height={14} borderRadius={4} />
            <Skeleton width={50} height={20} borderRadius={6} />
          </View>
          <View className="items-start flex-1 gap-1">
            <Skeleton width={30} height={14} borderRadius={4} />
            <Skeleton width={50} height={20} borderRadius={6} />
          </View>
          <View className="items-start flex-1 gap-1">
            <Skeleton width={30} height={14} borderRadius={4} />
            <Skeleton width={50} height={20} borderRadius={6} />
          </View>
          <View className="items-end justify-center flex-1">
            <Skeleton width={60} height={20} borderRadius={6} />
          </View>
        </View>
      </View>
    </View>
  );
}