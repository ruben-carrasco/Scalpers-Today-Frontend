import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Clock, Sparkles } from 'lucide-react-native';
import { EconomicEvent } from '../../../domain/entities/EconomicEvent';
import { Typography } from '../common/Typography';
import { getImportanceColor } from '../../theme';

interface NextEventCardProps {
  event: EconomicEvent;
  onPress: () => void;
}

const getImportanceLabel = (importance: number): string => {
  if (importance >= 3) return 'Alta prioridad';
  if (importance === 2) return 'Vigilancia media';
  return 'Seguimiento ligero';
};

export function NextEventCard({ event, onPress }: NextEventCardProps) {
  const impColor = getImportanceColor(event.importance);
  const hasData = event.actual || event.forecast || event.previous;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="w-full">
      <View className="overflow-hidden rounded-[32px] border border-[#27272A] bg-[#111214] p-6">
        <View className="mb-5 flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <View className="mb-3 flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: impColor }} />
              <Typography variant="caption" color="secondary" weight="bold" className="uppercase tracking-[0.24em]">
                Próxima referencia
              </Typography>
            </View>

            <View className="flex-row items-center gap-2">
              <Clock size={18} color="#94A3B8" strokeWidth={2.2} />
              <Typography variant="h2" weight="bold" className="font-mono text-text-primary">
                {event.time}
              </Typography>
              <View
                className="rounded-full border px-3 py-1.5"
                style={{ borderColor: `${impColor}55`, backgroundColor: `${impColor}18` }}
              >
                <Typography variant="caption" weight="bold" style={{ color: impColor }}>
                  {getImportanceLabel(event.importance)}
                </Typography>
              </View>
            </View>
          </View>

          {event.aiAnalysis && (
            <View className="flex-row items-center gap-1.5 rounded-full border border-[#1D4ED8]/40 bg-[#172554] px-3 py-2">
              <Sparkles size={14} color="#93C5FD" strokeWidth={2.5} />
              <Typography variant="caption" weight="bold" className="text-[#BFDBFE]">
                Análisis IA
              </Typography>
            </View>
          )}
        </View>

        <Typography variant="h2" weight="semibold" className="mb-4 text-text-primary" numberOfLines={2}>
          {event.title}
        </Typography>

        <View className="mb-6 flex-row flex-wrap items-center gap-3">
          <View className="rounded-2xl border border-[#30343A] bg-[#17191D] px-3 py-2">
            <Typography variant="caption" color="primary" weight="semibold">
              {event.country}
            </Typography>
          </View>

          {event.currency && (
            <View className="rounded-2xl border border-[#30343A] bg-[#17191D] px-3 py-2">
              <Typography variant="caption" color="primary" weight="semibold">
                {event.currency}
              </Typography>
            </View>
          )}

          <View className="rounded-2xl border border-[#1E3A5F] bg-[#0C1726] px-3 py-2">
            <Typography variant="caption" weight="bold" className="text-[#93C5FD]">
              Impacto {event.importance}/3
            </Typography>
          </View>
        </View>

        {hasData ? (
          <View className="flex-row gap-3 border-t border-[#27272A] pt-5">
            <View className="flex-1 rounded-[22px] border border-[#1F3A2C] bg-[#0B1B17] px-4 py-4">
              <Typography variant="caption" color="secondary" weight="bold" className="mb-2 uppercase tracking-[0.18em]">
                Actual
              </Typography>
              <Typography variant="h3" weight="bold" className="text-text-primary">
                {event.actual || '--'}
              </Typography>
            </View>

            <View className="flex-1 rounded-[22px] border border-[#3A311B] bg-[#1B170D] px-4 py-4">
              <Typography variant="caption" color="secondary" weight="bold" className="mb-2 uppercase tracking-[0.18em]">
                Previsto
              </Typography>
              <Typography variant="h3" weight="bold" color="secondary">
                {event.forecast || '--'}
              </Typography>
            </View>

            <View className="flex-1 rounded-[22px] border border-[#30343A] bg-[#17191D] px-4 py-4">
              <Typography variant="caption" color="secondary" weight="bold" className="mb-2 uppercase tracking-[0.18em]">
                Anterior
              </Typography>
              <Typography variant="h3" weight="bold" color="secondary">
                {event.previous || '--'}
              </Typography>
            </View>
          </View>
        ) : (
          <View className="rounded-[24px] border border-[#27272A] bg-[#17181B] px-4 py-5">
            <Typography variant="caption" color="secondary" weight="bold" className="mb-2 uppercase tracking-[0.2em]">
              Lectura pendiente
            </Typography>
            <Typography variant="body" color="secondary" className="leading-6">
              Este evento todavía no ha publicado cifras. La ficha queda preparada para mostrar actual, previsto y anterior cuando entren datos.
            </Typography>
          </View>
        )}

        <View className="mt-5 flex-row items-center justify-between border-t border-[#1E2025] pt-4">
          <Typography variant="caption" color="secondary" weight="medium">
            Pulsa para ver análisis y contexto operativo
          </Typography>
          <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: impColor }} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
