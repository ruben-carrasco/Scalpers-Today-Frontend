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

export function NextEventCard({ event, onPress }: NextEventCardProps) {
  const impColor = getImportanceColor(event.importance);
  const hasData = event.actual || event.forecast || event.previous;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="w-full">
      <View className="bg-[#18181B] rounded-3xl p-6 border border-[#27272A]">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: impColor }} />
            <Typography variant="h3" weight="bold" className="font-mono">{event.time}</Typography>
          </View>
          {event.aiAnalysis && (
            <View className="flex-row items-center gap-1.5 bg-[#3B82F6]/20 px-3 py-1.5 rounded-full">
              <Sparkles size={14} color="#60A5FA" strokeWidth={2.5} />
              <Typography variant="caption" weight="bold" className="text-[#60A5FA]">IA Analysis</Typography>
            </View>
          )}
        </View>

        <Typography variant="h2" weight="semibold" className="mb-4" numberOfLines={2}>
          {event.title}
        </Typography>

        <View className="flex-row items-center gap-3 mb-6">
          <View className="bg-[#27272A] px-3 py-1.5 rounded-lg">
            <Typography variant="caption" color="primary" weight="semibold">{event.country}</Typography>
          </View>
          {event.currency && (
            <View className="bg-[#27272A] px-3 py-1.5 rounded-lg">
              <Typography variant="caption" color="primary" weight="semibold">{event.currency}</Typography>
            </View>
          )}
        </View>

        {hasData && (
          <View className="flex-row justify-between pt-5 border-t border-[#27272A]">
            <View className="items-center flex-1">
              <Typography variant="caption" color="secondary" weight="medium" className="uppercase mb-1">Actual</Typography>
              <Typography variant="h3" weight="bold" className="text-text-primary">{event.actual || '--'}</Typography>
            </View>
            <View className="items-center flex-1 border-l border-r border-[#27272A]">
              <Typography variant="caption" color="secondary" weight="medium" className="uppercase mb-1">Previsto</Typography>
              <Typography variant="h3" weight="bold" color="secondary">{event.forecast || '--'}</Typography>
            </View>
            <View className="items-center flex-1">
              <Typography variant="caption" color="secondary" weight="medium" className="uppercase mb-1">Anterior</Typography>
              <Typography variant="h3" weight="bold" color="secondary">{event.previous || '--'}</Typography>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
