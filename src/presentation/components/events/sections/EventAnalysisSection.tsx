import React, { useState } from 'react';
import { View, TouchableOpacity, LayoutAnimation, ScrollView, Modal, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sparkles, BarChart3, Globe, Crosshair, Lightbulb,
  ChevronRight, Minus, X, Clock3, AlertCircle,
} from 'lucide-react-native';
import { FormattedAIText } from '../../common/FormattedAIText';
import { Typography } from '../../common/Typography';
import { getImpactColor, getSentimentColor, getSentimentIcon } from '../../../theme';
import { colors } from '../../../theme/tokens';
import { useThemeMode } from '../../../theme/ThemeModeContext';

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
  isDeepAnalysis?: boolean;
}

interface EventAnalysisSectionProps {
  ai: AIAnalysis;
  isHighImpact?: boolean;
}

export function EventAnalysisUnavailableSection() {
  const { isDarkMode } = useThemeMode();
  const cardBg = isDarkMode ? colors.bg.modalCard : '#F8FAFC';
  const cardBorder = isDarkMode ? colors.border.medium : '#E2E8F0';
  const titleColor = isDarkMode ? colors.text.primary : '#0F172A';
  const warningColor = isDarkMode ? colors.semantic.warningLight : '#92400E';
  const warningBg = isDarkMode ? colors.semantic.warning + '20' : '#FEF3C7';

  return (
    <View
      className="rounded-3xl p-5 mb-8 border"
      style={{ backgroundColor: cardBg, borderColor: cardBorder }}
    >
      <View className="flex-row items-center gap-3 mb-3">
        <View
          className="w-10 h-10 rounded-2xl items-center justify-center"
          style={{ backgroundColor: warningBg }}
        >
          <Clock3 size={18} color={warningColor} strokeWidth={2.5} />
        </View>
        <View className="flex-1">
          <Typography variant="body" weight="bold" style={{ color: titleColor }}>
            Sin comentario de mercado
          </Typography>
          <Typography variant="caption" color="muted" className="mt-1">
            Aún puedes consultar los datos clave del evento.
          </Typography>
        </View>
      </View>

      <Typography variant="body" color="secondary">
        Este indicador no tiene una lectura automática preparada. Revisa el dato actual, el previsto
        y el anterior para valorar si puede mover el mercado.
      </Typography>
    </View>
  );
}

export function EventAnalysisSection({ ai, isHighImpact = false }: EventAnalysisSectionProps) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeMode();
  const surface = isDarkMode ? colors.bg.modalCard : '#F8FAFC';
  const base = isDarkMode ? colors.bg.modal : '#FFFFFF';
  const border = isDarkMode ? colors.border.medium : '#E2E8F0';
  const titleColor = isDarkMode ? colors.text.primary : '#0F172A';
  const warningColor = isDarkMode ? colors.semantic.warningLight : '#92400E';

  const SentimentIcon = getSentimentIcon(ai.sentiment) || Minus;

  const deepSections = [
    ai.macroContext ? { icon: Globe, title: 'Contexto Macro', text: ai.macroContext } : null,
    ai.technicalLevels ? { icon: Crosshair, title: 'Niveles Técnicos', text: ai.technicalLevels } : null,
    ai.tradingStrategies ? { icon: Lightbulb, title: 'Estrategias', text: ai.tradingStrategies } : null,
  ].filter(Boolean) as { icon: any; title: string; text: string }[];
  const hasDeepContent = deepSections.length > 0;
  const shouldShowDetails = hasDeepContent || isHighImpact;

  const openDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDetailsVisible(true);
  };

  return (
    <View className="rounded-3xl p-5 mb-8 border" style={{ backgroundColor: surface, borderColor: border }}>
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center gap-2">
          <Sparkles size={18} color={colors.brand.primaryLight} strokeWidth={2.5} />
          <Typography variant="body" weight="bold" style={{ color: colors.brand.primaryLight }}>Análisis IA</Typography>
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
            <View key={i} className="px-3 py-1.5 rounded-lg border" style={{ backgroundColor: base, borderColor: border }}>
              <Typography variant="caption" weight="semibold" style={{ color: colors.brand.primaryLight }}>{a}</Typography>
            </View>
          ))}
        </View>
      )}

      {shouldShowDetails && (
        <>
          <TouchableOpacity
            className="flex-row items-center justify-between pt-4 border-t"
            style={{ borderTopColor: border }}
            onPress={openDetails}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2 flex-1">
              {!hasDeepContent && (
                <AlertCircle size={16} color={warningColor} strokeWidth={2.5} />
              )}
              <Typography variant="body" weight="semibold" style={{ color: hasDeepContent ? colors.brand.primaryLight : warningColor }}>
                {hasDeepContent ? 'Análisis detallado' : 'Análisis detallado pendiente'}
              </Typography>
            </View>
            <ChevronRight size={18} color={colors.brand.primaryLight} strokeWidth={2.5} />
          </TouchableOpacity>
        </>
      )}

      <Modal
        visible={detailsVisible}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        statusBarTranslucent={Platform.OS === 'android'}
        navigationBarTranslucent={Platform.OS === 'android'}
        onRequestClose={() => setDetailsVisible(false)}
      >
        <View className="flex-1" style={{ backgroundColor: base }}>
          <View
            className="flex-row items-center justify-between px-6 py-4 border-b"
            style={{
              borderBottomColor: border,
              paddingTop: Platform.OS === 'android'
                ? Math.max(insets.top + (StatusBar.currentHeight ?? 0) + 8, 24)
                : Math.max(insets.top + 4, 12),
            }}
          >
            <Typography variant="h2" weight="bold" style={{ color: titleColor }}>
              Análisis detallado
            </Typography>
            <TouchableOpacity
              onPress={() => setDetailsVisible(false)}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: surface }}
            >
              <X size={18} color={colors.text.icon} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              padding: 24,
              paddingBottom: Platform.OS === 'android'
                ? Math.max(insets.bottom + 140, 180)
                : Math.max(insets.bottom + 24, 48),
              gap: 16,
            }}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            {hasDeepContent ? (
              deepSections.map((s, i) => (
                <View
                  key={i}
                  className="rounded-2xl p-5 border"
                  style={{ backgroundColor: surface, borderColor: border }}
                >
                  <View className="flex-row items-center gap-2 mb-3">
                    <s.icon size={16} color={colors.brand.primaryLight} strokeWidth={2} />
                    <Typography variant="caption" weight="bold" style={{ color: colors.brand.primaryLight }} className="uppercase tracking-widest">
                      {s.title}
                    </Typography>
                  </View>
                  <FormattedAIText text={s.text} />
                </View>
              ))
            ) : (
              <View
                className="rounded-2xl p-5 border"
                style={{ backgroundColor: surface, borderColor: border }}
              >
                <View className="flex-row items-center gap-2 mb-3">
                  <AlertCircle size={16} color={warningColor} strokeWidth={2} />
                  <Typography variant="caption" weight="bold" style={{ color: warningColor }} className="uppercase tracking-widest">
                    Pendiente de análisis profundo
                  </Typography>
                </View>
                <Typography variant="body" color="secondary">
                  Estamos preparando una lectura ampliada para este evento. Mientras tanto, puedes
                  revisar el resumen, el dato actual, el previsto y el anterior para valorar su
                  posible impacto en el mercado.
                </Typography>
              </View>
            )}
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
