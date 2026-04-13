import React from 'react';
import { View } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Typography } from '../common/Typography';

interface MarketStats {
  totalEvents: number;
  highImpact: number;
  mediumImpact: number;
  lowImpact: number;
}

interface Sentiment {
  text: string;
  type: 'bullish' | 'bearish' | 'neutral';
}

interface MarketOverviewCardProps {
  stats: MarketStats;
  sentiment: Sentiment;
  volatility: string;
}

const getSentimentConfig = (type: string) => {
  if (type === 'bullish') return { color: '#34D399', Icon: TrendingUp };
  if (type === 'bearish') return { color: '#FF453A', Icon: TrendingDown };
  return { color: '#FBBF24', Icon: Minus };
};

const getVolatilityTone = (volatility: string): string => {
  const lower = volatility.toLowerCase();
  if (lower.includes('alta')) return '#FF8A65';
  if (lower.includes('moderada')) return '#FBBF24';
  if (lower.includes('baja')) return '#60A5FA';
  return '#A1A1AA';
};

export function MarketOverviewCard({ stats, sentiment, volatility }: MarketOverviewCardProps) {
  const sentimentConfig = getSentimentConfig(sentiment.type);
  const volatilityColor = getVolatilityTone(volatility);

  return (
    <View className="overflow-hidden rounded-[32px] border border-[#27272A] bg-[#101114] p-6">
      <View className="mb-6 flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Typography variant="caption" color="secondary" weight="bold" className="mb-2 uppercase tracking-[0.28em]">
            Pulso del mercado
          </Typography>
          <Typography variant="metric" weight="bold" className="mb-1 text-text-primary">
            {stats.totalEvents}
          </Typography>
          <Typography variant="body" color="secondary" className="leading-6">
            Agenda macro del día con foco en impacto, sentimiento y régimen de volatilidad.
          </Typography>
        </View>

        <View className="items-end gap-3">
          <View className="flex-row items-center gap-2 rounded-full border border-[#1F3A2C] bg-[#0B1B17] px-3 py-2">
            <sentimentConfig.Icon size={18} color={sentimentConfig.color} strokeWidth={3} />
            <Typography variant="caption" weight="bold" style={{ color: sentimentConfig.color }}>
              {sentiment.text}
            </Typography>
          </View>

          <View className="rounded-full border px-3 py-2" style={{ borderColor: `${volatilityColor}55`, backgroundColor: `${volatilityColor}14` }}>
            <Typography variant="caption" weight="bold" style={{ color: volatilityColor }}>
              Volatilidad {volatility}
            </Typography>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3 border-t border-[#27272A] pt-6">
        <View className="min-w-[47%] flex-1 rounded-[24px] border border-[#3A1D20] bg-[#1A1114] px-4 py-4">
          <View className="mb-2 flex-row items-center gap-2">
            <View className="h-2.5 w-2.5 rounded-full bg-[#FF453A]" />
            <Typography variant="caption" color="secondary" weight="bold" className="uppercase tracking-[0.2em]">
              Alto impacto
            </Typography>
          </View>
          <Typography variant="h2" weight="bold" className="text-text-primary">
            {stats.highImpact}
          </Typography>
        </View>

        <View className="min-w-[47%] flex-1 rounded-[24px] border border-[#4C3A13] bg-[#1D1810] px-4 py-4">
          <View className="mb-2 flex-row items-center gap-2">
            <View className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
            <Typography variant="caption" color="secondary" weight="bold" className="uppercase tracking-[0.2em]">
              Impacto medio
            </Typography>
          </View>
          <Typography variant="h2" weight="bold" className="text-text-primary">
            {stats.mediumImpact}
          </Typography>
        </View>

        <View className="min-w-[47%] flex-1 rounded-[24px] border border-[#2F3238] bg-[#13161A] px-4 py-4">
          <View className="mb-2 flex-row items-center gap-2">
            <View className="h-2.5 w-2.5 rounded-full bg-[#A1A1AA]" />
            <Typography variant="caption" color="secondary" weight="bold" className="uppercase tracking-[0.2em]">
              Bajo impacto
            </Typography>
          </View>
          <Typography variant="h2" weight="bold" className="text-text-primary">
            {stats.lowImpact}
          </Typography>
        </View>

        <View className="min-w-[47%] flex-1 rounded-[24px] border border-[#1E3A5F] bg-[#0C1726] px-4 py-4">
          <Typography variant="caption" color="secondary" weight="bold" className="mb-2 uppercase tracking-[0.2em]">
            Régimen
          </Typography>
          <Typography variant="h2" weight="bold" style={{ color: volatilityColor }}>
            {volatility}
          </Typography>
        </View>
      </View>
    </View>
  );
}
