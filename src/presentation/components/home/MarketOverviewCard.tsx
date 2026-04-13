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

export function MarketOverviewCard({ stats, sentiment, volatility }: MarketOverviewCardProps) {
  const sentimentConfig = getSentimentConfig(sentiment.type);

  return (
    <View className="bg-[#18181B] rounded-3xl p-6">
      <View className="flex-row justify-between items-end mb-8">
        <View>
          <Typography variant="caption" color="secondary" weight="medium" className="uppercase tracking-widest mb-2">Eventos Hoy</Typography>
          <Typography variant="metric" weight="bold">{stats.totalEvents}</Typography>
        </View>
        <View className="items-end">
          <Typography variant="caption" color="secondary" weight="medium" className="uppercase tracking-widest mb-2">Sentimiento</Typography>
          <View className="flex-row items-center gap-1.5">
            <sentimentConfig.Icon size={18} color={sentimentConfig.color} strokeWidth={3} />
            <Typography variant="h3" weight="bold" style={{ color: sentimentConfig.color }}>
              {sentiment.text}
            </Typography>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between pt-6 border-t border-[#27272A]">
        <View className="items-center">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2 h-2 rounded-full bg-[#FF453A]" />
            <Typography variant="caption" color="secondary" weight="medium" className="uppercase">Alto</Typography>
          </View>
          <Typography variant="h2" weight="bold">{stats.highImpact}</Typography>
        </View>
        
        <View className="items-center">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2 h-2 rounded-full bg-[#FBBF24]" />
            <Typography variant="caption" color="secondary" weight="medium" className="uppercase">Medio</Typography>
          </View>
          <Typography variant="h2" weight="bold">{stats.mediumImpact}</Typography>
        </View>

        <View className="items-center">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2 h-2 rounded-full bg-[#A1A1AA]" />
            <Typography variant="caption" color="secondary" weight="medium" className="uppercase">Bajo</Typography>
          </View>
          <Typography variant="h2" weight="bold">{stats.lowImpact}</Typography>
        </View>

        <View className="items-center">
          <Typography variant="caption" color="secondary" weight="medium" className="uppercase mb-1">Volatilidad</Typography>
          <Typography variant="h2" weight="bold">{volatility}</Typography>
        </View>
      </View>
    </View>
  );
}
