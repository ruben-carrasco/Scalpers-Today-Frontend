import React, { useState } from 'react';
import { View, TouchableOpacity, LayoutAnimation, ScrollView, Modal } from 'react-native';
import {
  Sparkles, BarChart3, Globe, Crosshair, Lightbulb,
  ChevronRight, Minus, X,
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
  const [detailsVisible, setDetailsVisible] = useState(false);

  const SentimentIcon = getSentimentIcon(ai.sentiment) || Minus;

  const deepSections = [
    ai.macroContext ? { icon: Globe, title: 'Contexto Macro', text: ai.macroContext } : null,
    ai.technicalLevels ? { icon: Crosshair, title: 'Niveles Técnicos', text: ai.technicalLevels } : null,
    ai.tradingStrategies ? { icon: Lightbulb, title: 'Estrategias', text: ai.tradingStrategies } : null,
  ].filter(Boolean) as { icon: any; title: string; text: string }[];

  const openDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDetailsVisible(true);
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
            onPress={openDetails}
            activeOpacity={0.7}
          >
            <Typography variant="body" weight="semibold" style={{ color: colors.brand.primaryLight }}>
              Análisis detallado
            </Typography>
            <ChevronRight size={18} color={colors.brand.primaryLight} strokeWidth={2.5} />
          </TouchableOpacity>
        </>
      )}

      <Modal
        visible={detailsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailsVisible(false)}
      >
        <View className="flex-1" style={{ backgroundColor: colors.bg.modal }}>
          <View
            className="flex-row items-center justify-between px-6 py-4 border-b"
            style={{ borderBottomColor: colors.border.medium }}
          >
            <Typography variant="h2" weight="bold">
              Análisis detallado
            </Typography>
            <TouchableOpacity
              onPress={() => setDetailsVisible(false)}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.bg.modalCard }}
            >
              <X size={18} color={colors.text.icon} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 24, paddingBottom: 40, gap: 16 }}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            {deepSections.map((s, i) => (
              <View
                key={i}
                className="rounded-2xl p-5 border"
                style={{ backgroundColor: colors.bg.modalCard, borderColor: colors.border.medium }}
              >
                <View className="flex-row items-center gap-2 mb-3">
                  <s.icon size={16} color={colors.brand.primaryLight} strokeWidth={2} />
                  <Typography variant="caption" weight="bold" style={{ color: colors.brand.primaryLight }} className="uppercase tracking-widest">
                    {s.title}
                  </Typography>
                </View>
                <FormattedAIText text={s.text} />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
