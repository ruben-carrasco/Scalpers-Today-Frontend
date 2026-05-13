import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { EconomicEvent } from '../../../domain/entities/EconomicEvent';
import { Typography } from '../common/Typography';
import { getImportanceColor } from '../../theme';
import { useThemeMode } from '../../theme/ThemeModeContext';

interface NextEventCardProps {
  event: EconomicEvent;
  onPress: () => void;
}

export function NextEventCard({ event, onPress }: NextEventCardProps) {
  const impColor = getImportanceColor(event.importance);
  const hasData = event.actual || event.forecast || event.previous;
  const { isDarkMode } = useThemeMode();
  const primaryText = isDarkMode ? '#FFFFFF' : '#111827';
  const secondaryText = isDarkMode ? '#A1A1AA' : '#475569';
  const countryChip = {
    backgroundColor: isDarkMode ? '#27272A' : '#DBEAFE',
    borderColor: isDarkMode ? '#3F3F46' : '#93C5FD',
    textColor: isDarkMode ? '#E4E4E7' : '#1E3A8A',
  };
  const currencyChip = {
    backgroundColor: isDarkMode ? '#27272A' : '#DCFCE7',
    borderColor: isDarkMode ? '#3F3F46' : '#86EFAC',
    textColor: isDarkMode ? '#E4E4E7' : '#166534',
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="w-full">
      <View
        className="rounded-3xl p-6 border"
        style={{ backgroundColor: isDarkMode ? '#18181B' : '#FFFFFF', borderColor: isDarkMode ? '#27272A' : '#E4E4E7' }}
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: impColor }} />
            <Typography variant="h3" weight="bold" className="font-mono" style={{ color: primaryText }}>{event.time}</Typography>
          </View>
          {event.aiAnalysis && (
            <View className="flex-row items-center gap-1.5 bg-[#3B82F6]/20 px-3 py-1.5 rounded-full">
              <Sparkles size={14} color="#60A5FA" strokeWidth={2.5} />
              <Typography variant="caption" weight="bold" className="text-[#60A5FA]">IA Analysis</Typography>
            </View>
          )}
        </View>

        <Typography variant="h2" weight="semibold" className="mb-4" style={{ color: primaryText }} numberOfLines={2}>
          {event.title}
        </Typography>

        <View className="flex-row items-center gap-3 mb-6">
          <View
            className="px-3 py-1.5 rounded-lg border"
            style={{ backgroundColor: countryChip.backgroundColor, borderColor: countryChip.borderColor }}
          >
            <Typography variant="caption" weight="bold" style={{ color: countryChip.textColor }}>{event.country}</Typography>
          </View>
          {event.currency && (
            <View
              className="px-3 py-1.5 rounded-lg border"
              style={{ backgroundColor: currencyChip.backgroundColor, borderColor: currencyChip.borderColor }}
            >
              <Typography variant="caption" weight="bold" style={{ color: currencyChip.textColor }}>{event.currency}</Typography>
            </View>
          )}
        </View>

        {hasData && (
          <View
            className="flex-row justify-between pt-5 border-t"
            style={{ borderTopColor: isDarkMode ? '#27272A' : '#E4E4E7' }}
          >
            <View className="items-center flex-1">
              <Typography variant="caption" color="secondary" weight="medium" className="uppercase mb-1">Actual</Typography>
              <Typography variant="h3" weight="bold" style={{ color: primaryText }}>{event.actual || '--'}</Typography>
            </View>
            <View className="items-center flex-1 border-l border-r" style={{ borderColor: isDarkMode ? '#27272A' : '#E4E4E7' }}>
              <Typography variant="caption" color="secondary" weight="medium" className="uppercase mb-1">Previsto</Typography>
              <Typography variant="h3" weight="bold" style={{ color: secondaryText }}>{event.forecast || '--'}</Typography>
            </View>
            <View className="items-center flex-1">
              <Typography variant="caption" color="secondary" weight="medium" className="uppercase mb-1">Anterior</Typography>
              <Typography variant="h3" weight="bold" style={{ color: secondaryText }}>{event.previous || '--'}</Typography>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
