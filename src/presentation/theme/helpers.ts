import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

export const getImportanceColor = (importance: number): string => {
  switch (importance) {
    case 3: return '#FF453A';
    case 2: return '#FBBF24';
    default: return '#A1A1AA';
  }
};

export const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'HIGH': return '#FF453A';
    case 'MEDIUM': return '#FBBF24';
    default: return '#A1A1AA';
  }
};

export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'BULLISH': return '#34D399';
    case 'BEARISH': return '#FF453A';
    default: return '#A1A1AA';
  }
};

export const getSentimentIcon = (sentiment: string) =>
  sentiment === 'BULLISH' ? TrendingUp : sentiment === 'BEARISH' ? TrendingDown : Minus;
