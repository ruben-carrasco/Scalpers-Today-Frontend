import React, { useState } from 'react';
import { View, TouchableOpacity, LayoutAnimation } from 'react-native';
import {
  Sparkles, BarChart3, Globe, Crosshair, Lightbulb,
  ChevronDown, ChevronUp, Minus,
} from 'lucide-react-native';
import { FormattedAIText } from '../../common/FormattedAIText';
import { Typography } from '../../common/Typography';
import { getImpactColor, getSentimentColor, getSentimentIcon } from '../../../theme';
import { colors } from '../../../theme/tokens';

const IMPACT_LABELS: Record<string, string> = {
  HIGH: 'Alto', MEDIUM: 'Medio', LOW: 'Bajo',
};
const SENTIMENT_LABELS: Record<string, string> = {
  BULLISH: 'Alcista', BEARISH: 'Bajista', NEUTRAL: 'Neutral',
};

interface AIAnalysis {
  impact: string;
  sentiment: string;
  summary: string;
  impactedAssets?: string[];
  macroContext?: string;
  technicalLevels?: string;
  tradingStrategies?: string;
}

interface EventAnalysisSectionProps {
  ai: AIAnalysis;
}

export function EventAnalysisSection({ ai }: EventAnalysisSectionProps) {
  const [deepOpen, setDeepOpen] = useState(false);

  const SentimentIcon = getSentimentIcon(ai.sentiment) || Minus;

  const deepSections = [
    ai.macroContext ? { icon: Globe, title: 'Contexto Macro', text: ai.macroContext } : null,
    ai.technicalLevels ? { icon: Crosshair, title: 'Niveles Técnicos', text: ai.technicalLevels } : null,
    ai.tradingStrategies ? { icon: Lightbulb, title: 'Estrategias', text: ai.tradingStrategies } : null,
  ].filter(Boolean) as { icon: any; title: string; text: string }[];

  const toggleDeep = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDeepOpen(!deepOpen);
  };

  return (
    <View className="rounded-3xl p-5 mb-8 border" style={{ backgroundColor: colors.bg.modalCard, borderColor: colors.border.medium }}>
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center gap-2">
          <Sparkles size={18} color={colors.brand.primaryLight} strokeWidth={2.5} />
          <Typography variant="body" weight="bold" style={{ color: colors.brand.primaryLight }}>IA Analysis</Typography>
        </View>
        <View className="flex-row gap-2">
          <Badge color={getImpactColor(ai.impact)} icon={BarChart3} label={IMPACT_LABELS[ai.impact] || ai.impact} />
          <Badge color={getSentimentColor(ai.sentiment)} icon={SentimentIcon} label={SENTIMENT_LABELS[ai.sentiment] || ai.sentiment} />
        </View>
      </View>

      <View className="mb-4">
        <FormattedAIText text={ai.summary} />
      </View>

      {ai.impactedAssets && ai.impactedAssets.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-4">
          {ai.impactedAssets.map((a, i) => (
            <View key={i} className="px-3 py-1.5 rounded-lg border" style={{ backgroundColor: colors.bg.modal, borderColor: colors.border.medium }}>
              <Typography variant="caption" weight="semibold" style={{ color: colors.brand.primaryLight }}>{a}</Typography>
            </View>
          ))}
        </View>
      )}

      {deepSections.length > 0 && (
        <>
          <TouchableOpacity
            className="flex-row items-center justify-between pt-4 border-t"
            style={{ borderTopColor: colors.border.medium }}
            onPress={toggleDeep}
            activeOpacity={0.7}
          >
            <Typography variant="body" weight="semibold" style={{ color: colors.brand.primaryLight }}>
              Análisis detallado
            </Typography>
            {deepOpen ? (
              <ChevronUp size={18} color={colors.brand.primaryLight} strokeWidth={2.5} />
            ) : (
              <ChevronDown size={18} color={colors.brand.primaryLight} strokeWidth={2.5} />
            )}
          </TouchableOpacity>

          {deepOpen && (
            <View className="mt-4 gap-4">
              {deepSections.map((s, i) => (
                <View key={i} className={`pt-4 ${i > 0 ? 'border-t' : ''}`} style={i > 0 ? { borderTopColor: colors.border.medium } : undefined}>
                  <View className="flex-row items-center gap-2 mb-2">
                    <s.icon size={16} color={colors.brand.primaryLight} strokeWidth={2} />
                    <Typography variant="caption" weight="bold" style={{ color: colors.brand.primaryLight }} className="uppercase tracking-widest">
                      {s.title}
                    </Typography>
                  </View>
                  <FormattedAIText text={s.text} />
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

function Badge({ color, icon: Icon, label }: { color: string; icon: any; label: string }) {
  return (
    <View className="flex-row items-center px-2 py-1 rounded-md gap-1" style={{ backgroundColor: color + '20' }}>
      <Icon size={12} color={color} strokeWidth={2.5} />
      <Typography variant="caption" weight="bold" style={{ color }} className="uppercase tracking-wider text-[10px]">
        {label}
      </Typography>
    </View>
  );
}
