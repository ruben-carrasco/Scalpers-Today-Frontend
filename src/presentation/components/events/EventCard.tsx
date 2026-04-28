import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, MinusCircle, Sparkles } from 'lucide-react-native';
import { EventModel } from '../../models/EventModel';
import { Typography } from '../common/Typography';
import { getImportanceColor } from '../../theme';
import { colors } from '../../theme/tokens';
import { formatEventValue, hasEventValue } from '../../utils/eventValues';

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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="w-full mb-3" accessibilityRole="button" accessibilityLabel={`Evento ${event.title}, ${event.country}, importancia ${event.importance}, a las ${event.time}`}>
      <View style={{ backgroundColor: colors.bg.modal, borderColor: colors.bg.modalCard }} className="rounded-3xl p-5 border">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: impColor }} />
            <Typography variant="body" weight="bold" className="font-mono" style={{ color: colors.text.light }}>
              {event.time}
            </Typography>
          </View>
          <View className="flex-row gap-2">
            <View style={{ backgroundColor: colors.bg.modalCard }} className="px-2.5 py-1 rounded-md">
              <Typography variant="label" weight="bold" color="secondary">{event.country}</Typography>
            </View>
            <View style={{ backgroundColor: colors.bg.modalCard }} className="px-2.5 py-1 rounded-md">
              <Typography variant="label" weight="bold" color="secondary">{event.currency}</Typography>
            </View>
          </View>
        </View>

        <Typography variant="h3" weight="semibold" className="mb-4 leading-snug" style={{ color: colors.text.bright }} numberOfLines={2}>
          {event.title}
        </Typography>

        {hasAnyDataValue && (
          <View style={{ borderTopColor: colors.bg.modalCard }} className="flex-row justify-between pt-4 border-t">
            <View className="items-start flex-1">
              <Typography variant="caption" color="muted" weight="semibold" className="uppercase mb-1">Act</Typography>
              <Typography variant="body" weight="bold" className="text-text-primary">{formatEventValue(event.actual)}</Typography>
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

        {event.aiAnalysis && (
          <View style={{ borderTopColor: colors.bg.modalCard }} className="flex-row items-center gap-1.5 mt-4 pt-3 border-t">
            <Sparkles size={14} color={colors.brand.primaryLight} strokeWidth={2.5} />
            <Typography variant="caption" weight="bold" style={{ color: colors.brand.primaryLight }}>
              Análisis IA
            </Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});
