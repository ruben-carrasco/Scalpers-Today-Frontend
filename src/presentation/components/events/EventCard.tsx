import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, MinusCircle, Sparkles, Clock3 } from 'lucide-react-native';
import { EventModel } from '../../models/EventModel';
import { Typography } from '../common/Typography';
import { getImportanceColor } from '../../theme';
import { colors } from '../../theme/tokens';
import { formatEventValue, hasEventValue } from '../../utils/eventValues';
import { useThemeMode } from '../../theme/ThemeModeContext';

interface EventCardProps {
  event: EventModel;
  onPress: () => void;
}

const getSurpriseInfo = (surprise: string | null) => {
  if (!surprise) return null;
  switch (surprise) {
    case 'positive': return { Icon: TrendingUp, color: colors.semantic.successLight, label: 'Mejor' };
    case 'negative': return { Icon: TrendingDown, color: colors.semantic.dangerLight, label: 'Peor' };
    default: return { Icon: MinusCircle, color: colors.text.icon, label: 'Neutral' };
  }
};

export const EventCard = React.memo(function EventCard({ event, onPress }: EventCardProps) {
  const impColor = getImportanceColor(event.importance);
  const surpriseInfo = getSurpriseInfo(event.surprise);
  const hasAnyDataValue = [event.actual, event.forecast, event.previous].some(hasEventValue);
  const { isDarkMode } = useThemeMode();
  const cardBg = isDarkMode ? colors.bg.modal : '#FFFFFF';
  const cardBorder = isDarkMode ? colors.bg.modalCard : '#E4E4E7';
  const chipBg = isDarkMode ? colors.bg.modalCard : '#F8FAFC';
  const chipBorder = isDarkMode ? colors.border.medium : '#CBD5E1';
  const chipText = isDarkMode ? colors.text.light : '#334155';
  const titleColor = isDarkMode ? colors.text.bright : '#18181B';
  const timeColor = isDarkMode ? colors.text.light : '#334155';
  const aiStatus = event.aiAnalysis
    ? {
        Icon: Sparkles,
        label: 'Análisis IA',
        color: isDarkMode ? colors.brand.primaryLight : '#1E40AF',
        backgroundColor: isDarkMode ? colors.brand.primary + '18' : '#DCEBFF',
        borderColor: isDarkMode ? colors.brand.primaryDark : '#2563EB',
      }
    : {
        Icon: Clock3,
        label: 'IA pendiente',
        color: isDarkMode ? colors.semantic.warningLight : '#92400E',
        backgroundColor: isDarkMode ? colors.semantic.warning + '16' : '#FEF3C7',
        borderColor: isDarkMode ? colors.semantic.warningDark : colors.semantic.warning,
      };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="w-full mb-3" accessibilityRole="button" accessibilityLabel={`Evento ${event.title}, ${event.country}, importancia ${event.importance}, a las ${event.time}`}>
      <View style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="rounded-3xl p-5 border">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: impColor }} />
            <Typography variant="body" weight="bold" className="font-mono" style={{ color: timeColor }}>
              {event.time}
            </Typography>
          </View>
          <View className="flex-row gap-2">
            <View style={{ backgroundColor: chipBg, borderColor: chipBorder }} className="px-2.5 py-1 rounded-md border">
              <Typography variant="label" weight="bold" style={{ color: chipText }}>{event.country}</Typography>
            </View>
            <View style={{ backgroundColor: chipBg, borderColor: chipBorder }} className="px-2.5 py-1 rounded-md border">
              <Typography variant="label" weight="bold" style={{ color: chipText }}>{event.currency}</Typography>
            </View>
          </View>
        </View>

        <Typography variant="h3" weight="semibold" className="mb-4 leading-snug" style={{ color: titleColor }} numberOfLines={2}>
          {event.title}
        </Typography>

        {hasAnyDataValue && (
          <View style={{ borderTopColor: cardBorder }} className="flex-row justify-between pt-4 border-t">
            <View className="items-start flex-1">
              <Typography variant="caption" color="muted" weight="semibold" className="uppercase mb-1">Act</Typography>
              <Typography variant="body" weight="bold" style={{ color: titleColor }}>{formatEventValue(event.actual)}</Typography>
            </View>
            <View className="items-start flex-1">
              <Typography variant="caption" color="muted" weight="semibold" className="uppercase mb-1">Prev</Typography>
              <Typography variant="body" weight="semibold" color="secondary">{formatEventValue(event.forecast)}</Typography>
            </View>
            <View className="items-start flex-1">
              <Typography variant="caption" color="muted" weight="semibold" className="uppercase mb-1">Ant</Typography>
              <Typography variant="body" weight="semibold" color="secondary">{formatEventValue(event.previous)}</Typography>
            </View>

            {surpriseInfo ? (
              <View className="items-end justify-center flex-1">
                 <View className="flex-row items-center gap-1">
                   <surpriseInfo.Icon size={14} color={surpriseInfo.color} strokeWidth={2.5} />
                   <Typography variant="caption" weight="bold" style={{ color: surpriseInfo.color }}>
                     {surpriseInfo.label}
                   </Typography>
                 </View>
              </View>
            ) : <View className="flex-1" />}
          </View>
        )}

        <View style={{ borderTopColor: cardBorder }} className="flex-row items-center justify-between gap-2 mt-4 pt-3 border-t">
          <View
            className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
            style={{ backgroundColor: aiStatus.backgroundColor, borderColor: aiStatus.borderColor }}
          >
            <aiStatus.Icon size={14} color={aiStatus.color} strokeWidth={2.5} />
            <Typography variant="caption" weight="bold" style={{ color: aiStatus.color }}>
              {aiStatus.label}
            </Typography>
          </View>
          {!event.aiAnalysis && (
            <Typography variant="caption" color="muted" weight="semibold">
              Ver datos
            </Typography>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});
