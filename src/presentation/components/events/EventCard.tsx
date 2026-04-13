import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Clock, TrendingUp, TrendingDown, MinusCircle, Sparkles } from 'lucide-react-native';
import { EventModel } from '../../models/EventModel';
import { Typography } from '../common/Typography';
import { getImportanceColor } from '../../theme';
import { colors } from '../../theme/tokens';

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
  const hasData = Boolean(event.actual || event.forecast || event.previous);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-3 w-full"
      accessibilityRole="button"
      accessibilityLabel={`Evento ${event.title}, ${event.country}, importancia ${event.importance}, a las ${event.time}`}
    >
      <View
        style={{ backgroundColor: colors.bg.modal, borderColor: colors.bg.modalCard }}
        className="overflow-hidden rounded-[30px] border p-5"
      >
        <View className="mb-4 flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <View className="mb-3 flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: impColor }} />
              <Typography variant="caption" weight="bold" color="muted" className="uppercase tracking-[0.22em]">
                Evento macro
              </Typography>
            </View>

            <View className="flex-row items-center gap-3">
              <View
                className="rounded-full border px-3 py-2"
                style={{ borderColor: `${impColor}55`, backgroundColor: `${impColor}18` }}
              >
                <Typography variant="body" weight="bold" className="font-mono" style={{ color: colors.text.light }}>
                  {event.time}
                </Typography>
              </View>

              <View
                className="rounded-full border px-3 py-2"
                style={{ borderColor: colors.bg.modalCard, backgroundColor: colors.bg.modalCard }}
              >
                <Typography variant="caption" weight="bold" style={{ color: impColor }}>
                  Impacto {event.importance}/3
                </Typography>
              </View>
            </View>
          </View>

          <View className="items-end gap-2">
            <View style={{ backgroundColor: colors.bg.modalCard }} className="rounded-xl px-3 py-2">
              <Typography variant="label" weight="bold" color="secondary">
                {event.country}
              </Typography>
            </View>

            <View style={{ backgroundColor: colors.bg.modalCard }} className="rounded-xl px-3 py-2">
              <Typography variant="label" weight="bold" color="secondary">
                {event.currency}
              </Typography>
            </View>
          </View>
        </View>

        <Typography
          variant="h3"
          weight="semibold"
          className="mb-5 leading-snug"
          style={{ color: colors.text.bright }}
          numberOfLines={2}
        >
          {event.title}
        </Typography>

        {hasData ? (
          <View style={{ borderTopColor: colors.bg.modalCard }} className="border-t pt-4">
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-[22px] px-4 py-4" style={{ backgroundColor: '#0F1714' }}>
                <Typography variant="caption" color="muted" weight="bold" className="mb-2 uppercase tracking-[0.18em]">
                  Actual
                </Typography>
                <Typography variant="body" weight="bold" className="text-text-primary">
                  {event.actual || '--'}
                </Typography>
              </View>

              <View className="flex-1 rounded-[22px] px-4 py-4" style={{ backgroundColor: '#18150F' }}>
                <Typography variant="caption" color="muted" weight="bold" className="mb-2 uppercase tracking-[0.18em]">
                  Previsión
                </Typography>
                <Typography variant="body" weight="semibold" color="secondary">
                  {event.forecast || '--'}
                </Typography>
              </View>

              <View className="flex-1 rounded-[22px] px-4 py-4" style={{ backgroundColor: colors.bg.modalCard }}>
                <Typography variant="caption" color="muted" weight="bold" className="mb-2 uppercase tracking-[0.18em]">
                  Anterior
                </Typography>
                <Typography variant="body" weight="semibold" color="secondary">
                  {event.previous || '--'}
                </Typography>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{ borderTopColor: colors.bg.modalCard, backgroundColor: colors.bg.modalCard }}
            className="rounded-[22px] border-t px-4 py-4"
          >
            <Typography variant="caption" color="muted" weight="bold" className="mb-2 uppercase tracking-[0.18em]">
              Publicación pendiente
            </Typography>
            <Typography variant="body" color="secondary">
              La lectura todavía no tiene cifras publicadas. Pulsa para ver el contexto completo.
            </Typography>
          </View>
        )}

        {(surpriseInfo || event.aiAnalysis) && (
          <View
            style={{ borderTopColor: colors.bg.modalCard }}
            className="mt-4 flex-row items-center justify-between border-t pt-3"
          >
            {surpriseInfo ? (
              <View className="flex-row items-center gap-1.5">
                <surpriseInfo.Icon size={14} color={surpriseInfo.color} strokeWidth={2.5} />
                <Typography variant="caption" weight="bold" style={{ color: surpriseInfo.color }}>
                  Sorpresa {surpriseInfo.label}
                </Typography>
              </View>
            ) : (
              <View />
            )}

            {event.aiAnalysis && (
              <View className="flex-row items-center gap-1.5">
                <Sparkles size={14} color={colors.brand.primaryLight} strokeWidth={2.5} />
                <Typography variant="caption" weight="bold" style={{ color: colors.brand.primaryLight }}>
                  Análisis IA
                </Typography>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});
