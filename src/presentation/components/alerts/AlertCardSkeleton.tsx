import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../common/Skeleton';
import { useThemeMode } from '../../theme/ThemeModeContext';
import { colors } from '../../theme/tokens';

export function AlertCardSkeleton() {
  const { isDarkMode } = useThemeMode();
  
  const cardBg = isDarkMode ? colors.bg.modal : '#FFFFFF';
  const cardBorder = isDarkMode ? colors.bg.modalCard : '#E4E4E7';

  return (
    <View className="rounded-3xl p-5 border mb-3" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
      {/* Header row: Title + tags & Toggle Button */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-4 gap-3">
          <Skeleton width="80%" height={24} borderRadius={8} />
          <View className="flex-row items-center gap-2">
            <Skeleton width={60} height={20} borderRadius={6} />
            <Skeleton width={70} height={20} borderRadius={6} />
          </View>
        </View>
        <Skeleton width={48} height={48} borderRadius={24} />
      </View>

      {/* Description */}
      <View className="mb-5 gap-2">
        <Skeleton width="100%" height={16} borderRadius={6} />
        <Skeleton width="60%" height={16} borderRadius={6} />
      </View>

      {/* Conditions chips */}
      <View className="flex-row flex-wrap gap-2 mb-5">
        <Skeleton width={90} height={30} borderRadius={8} />
        <Skeleton width={110} height={30} borderRadius={8} />
      </View>

      {/* Footer row */}
      <View style={{ borderTopColor: cardBorder }} className="flex-row items-center justify-between pt-4 border-t">
        <Skeleton width={120} height={16} borderRadius={4} />
        <Skeleton width={36} height={36} borderRadius={18} />
      </View>
    </View>
  );
}