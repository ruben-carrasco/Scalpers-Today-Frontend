import { useEffect, useState, type ReactNode } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, FileText, AlarmClock, Clock, Zap, CloudOff, TrendingUp } from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import {
  useHomeViewModel,
  useAuthViewModel,
  useHaptics,
} from '../../src/presentation/hooks';
import {
  HomeHeader,
  MarketOverviewCard,
  NextEventCard,
  EventDetailModal,
} from '../../src/presentation/components/home';
import { createEventModel } from '../../src/presentation/models/EventModel';
import { HomeSkeleton } from '../../src/presentation/components/home/HomeSkeletons';
import { FormattedAIText } from '../../src/presentation/components/common/FormattedAIText';
import { Typography } from '../../src/presentation/components/common/Typography';

const translateSentiment = (sentiment: string): { text: string; type: 'bullish' | 'bearish' | 'neutral' } => {
  const lower = sentiment?.toLowerCase() || '';
  if (lower.includes('bullish') || lower.includes('alcista') || lower.includes('positiv')) {
    return { text: 'Alcista', type: 'bullish' };
  }
  if (lower.includes('bearish') || lower.includes('bajista') || lower.includes('negativ')) {
    return { text: 'Bajista', type: 'bearish' };
  }
  return { text: 'Neutral', type: 'neutral' };
};

const translateVolatility = (volatility: string): string => {
  const lower = volatility?.toLowerCase() || '';
  if (lower.includes('high') || lower.includes('alta')) return 'Alta';
  if (lower.includes('low') || lower.includes('baja')) return 'Baja';
  if (lower.includes('medium') || lower.includes('media') || lower.includes('moderate')) return 'Moderada';
  return 'Normal';
};

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <View className="mb-4 flex-row items-start justify-between gap-4">
      <View className="flex-1">
        <Typography variant="caption" color="secondary" weight="bold" className="mb-2 uppercase tracking-[0.28em]">
          {eyebrow}
        </Typography>
        <Typography variant="h2" weight="bold" className="mb-2 text-text-primary">
          {title}
        </Typography>
        <Typography variant="body" color="secondary" className="leading-6">
          {description}
        </Typography>
      </View>
      <View className="mt-1 rounded-2xl border border-[#2C3440] bg-[#121A27] p-3">
        {icon}
      </View>
    </View>
  );
}

export default observer(function HomeScreen() {
  const insets = useSafeAreaInsets();
  const homeViewModel = useHomeViewModel();
  const authViewModel = useAuthViewModel();
  const haptics = useHaptics();

  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  );
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    homeViewModel.refresh();
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, [homeViewModel]);

  const { summary, briefing, isLoadingSummary, error } = homeViewModel;
  const userName = authViewModel.user?.name?.split(' ')[0] || 'Trader';

  const sentiment = summary?.marketSentiment?.overall
    ? translateSentiment(summary.marketSentiment.overall)
    : { text: 'Neutral', type: 'neutral' as const };

  const volatility = summary?.marketSentiment?.volatility
    ? translateVolatility(summary.marketSentiment.volatility)
    : 'Normal';

  const activeSummary = summary;
  const highlightCount = activeSummary?.highlights?.length ?? 0;
  const nextEventTime = activeSummary?.nextEvent?.time ?? 'Sin cita inmediata';
  const hasBriefing = Boolean(briefing?.generalOutlook);

  const openEventDetails = (event: any) => {
    haptics.impactLight();
    setSelectedEvent(createEventModel(event));
    setEventModalVisible(true);
  };

  return (
    <View className="flex-1 bg-bg-primary">
      <StatusBar barStyle="light-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingSummary}
            onRefresh={() => homeViewModel.refresh(true)}
            tintColor="#3B82F6"
          />
        }
      >
        <HomeHeader
          userName={userName}
          currentTime={currentTime}
          paddingTop={insets.top}
        />

        {activeSummary && (
          <View className="px-6 pb-32">
            <View className="mb-6 -mt-2 flex-row gap-3">
              <View className="flex-1 rounded-[28px] border border-[#203047] bg-[#0D1522] px-5 py-5">
                <View className="mb-3 flex-row items-center gap-2">
                  <Clock size={16} color="#93C5FD" strokeWidth={2.3} />
                  <Typography variant="caption" weight="bold" className="uppercase tracking-[0.22em] text-[#BFDBFE]">
                    Ventana activa
                  </Typography>
                </View>
                <Typography variant="h3" weight="bold" className="mb-1 text-text-primary">
                  {nextEventTime}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Próxima referencia operativa en el radar.
                </Typography>
              </View>

              <View className="flex-1 rounded-[28px] border border-[#3D3220] bg-[#19150F] px-5 py-5">
                <View className="mb-3 flex-row items-center gap-2">
                  <Zap size={16} color="#FBBF24" strokeWidth={2.3} />
                  <Typography variant="caption" weight="bold" className="uppercase tracking-[0.22em] text-[#FCD34D]">
                    Lectura rápida
                  </Typography>
                </View>
                <Typography variant="h3" weight="bold" className="mb-1 text-text-primary">
                  {highlightCount} focos hoy
                </Typography>
                <Typography variant="caption" color="secondary">
                  {hasBriefing ? 'Briefing IA preparado para la sesión.' : 'Esperando briefing y contexto macro.'}
                </Typography>
              </View>
            </View>

            <View className="mb-9">
              <SectionHeader
                icon={<TrendingUp size={18} color="#60A5FA" strokeWidth={2.4} />}
                eyebrow="Panorama"
                title="Pulso del mercado"
                description="Lectura compacta del día para identificar si la sesión viene cargada, limpia o con catalizadores de alto impacto."
              />
              <MarketOverviewCard
                stats={activeSummary.todayStats}
                sentiment={sentiment}
                volatility={volatility}
              />
            </View>

            <View className="mb-9">
              <SectionHeader
                icon={<Calendar size={18} color="#FCA5A5" strokeWidth={2.4} />}
                eyebrow="Agenda"
                title="Próximo evento"
                description="La siguiente referencia relevante para gestionar exposición, volatilidad y timing operativo."
              />
              {activeSummary.nextEvent ? (
                <NextEventCard
                  event={activeSummary.nextEvent}
                  onPress={() => openEventDetails(activeSummary.nextEvent)}
                />
              ) : (
                <View className="items-center justify-center rounded-[32px] border border-[#27272A] bg-[#151619] px-6 py-12">
                  <View className="rounded-full border border-[#2F3640] bg-[#1B1D21] p-4">
                    <Calendar size={30} color="#94A3B8" strokeWidth={2} />
                  </View>
                  <Typography variant="body" weight="semibold" color="secondary" className="mt-5">
                    No hay más eventos hoy
                  </Typography>
                  <Typography variant="caption" color="muted" className="mt-2 text-center">
                    La agenda macro ya no tiene publicaciones pendientes para esta sesión.
                  </Typography>
                </View>
              )}
            </View>

            {briefing && (
              <View className="mb-9">
                <SectionHeader
                  icon={<FileText size={18} color="#C4B5FD" strokeWidth={2.4} />}
                  eyebrow="Análisis"
                  title="Briefing del día"
                  description="Resumen estratégico generado para aterrizar el contexto macro en decisiones de riesgo, atención y seguimiento."
                />

                <View className="mb-4 rounded-[32px] border border-[#27272A] bg-[#141518] p-6">
                  <FormattedAIText text={briefing.generalOutlook} />
                </View>

                {briefing.cautionaryHours && briefing.cautionaryHours.length > 0 && (
                  <View className="mb-4 rounded-[32px] border border-[#FBBF24]/25 bg-[#1A1510] p-6">
                    <View className="mb-4 flex-row items-center gap-2">
                      <AlarmClock size={20} color="#FBBF24" strokeWidth={2.5} />
                      <Typography variant="h3" weight="bold" className="text-[#FBBF24]">
                        Horas Clave
                      </Typography>
                    </View>
                    {briefing.cautionaryHours.map((hour, idx) => (
                      <View key={idx} className={`flex-row items-center gap-3 py-3 ${idx > 0 ? 'border-t border-[#27272A]' : ''}`}>
                        <Clock size={16} color="#A1A1AA" strokeWidth={2} />
                        <Typography variant="body" weight="medium" className="flex-1">
                          {hour}
                        </Typography>
                      </View>
                    ))}
                  </View>
                )}

                {briefing.impactedAssets && briefing.impactedAssets.length > 0 && (
                  <View className="rounded-[32px] border border-[#27272A] bg-[#141518] p-6">
                    <View className="mb-4 flex-row items-center gap-2">
                      <TrendingUp size={20} color="#3B82F6" strokeWidth={2.5} />
                      <Typography variant="h3" weight="bold" className="text-[#3B82F6]">
                        Activos a Vigilar
                      </Typography>
                    </View>
                    <View className="flex-row flex-wrap gap-2">
                      {briefing.impactedAssets.slice(0, 6).map((asset, index) => (
                        <View key={index} className="bg-[#27272A] px-4 py-2 rounded-xl">
                          <Typography variant="body" weight="semibold">
                            {asset}
                          </Typography>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {activeSummary.highlights && activeSummary.highlights.length > 0 && (
              <View className="mb-8">
                <SectionHeader
                  icon={<Zap size={18} color="#FBBF24" strokeWidth={2.4} />}
                  eyebrow="Monitor"
                  title="Eventos destacados"
                  description="Referencias que merecen vigilancia manual o una lectura más detallada por su relevancia intradía."
                />
                <View className="rounded-[32px] border border-[#27272A] bg-[#141518] p-6">
                  {activeSummary.highlights.slice(0, 5).map((highlightEvent, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => openEventDetails(highlightEvent)}
                      activeOpacity={0.7}
                      className={`flex-row items-center gap-4 py-4 ${index < Math.min(activeSummary.highlights!.length - 1, 4) ? 'border-b border-[#27272A]' : ''}`}
                    >
                      <View className="w-8 h-8 rounded-full bg-[#3B82F6]/20 items-center justify-center">
                        <Typography variant="body" weight="bold" className="text-[#60A5FA]">
                          {index + 1}
                        </Typography>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Typography variant="caption" color="secondary" weight="bold" className="font-mono">
                            {highlightEvent.time}
                          </Typography>
                          <View className="w-1 h-1 rounded-full bg-[#52525B]" />
                          <Typography variant="caption" color="secondary" weight="semibold">
                            {highlightEvent.country}
                          </Typography>
                        </View>
                        <Typography variant="body" weight="semibold" className="text-[#F4F4F5]" numberOfLines={2}>
                          {highlightEvent.title}
                        </Typography>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {error && (
          <View className="mx-6 mt-10 items-center rounded-[32px] border border-[#FF453A]/30 bg-[#1A1212] p-8">
            <View className="rounded-full border border-[#7F1D1D] bg-[#2A1717] p-4">
              <CloudOff size={42} color="#FF453A" strokeWidth={1.7} />
            </View>
            <Typography variant="h2" weight="bold" color="danger" className="mt-4">
              Sin conexión
            </Typography>
            <Typography variant="body" color="secondary" className="mt-3 text-center leading-relaxed">
              {error}
            </Typography>
            <TouchableOpacity
              onPress={() => homeViewModel.refresh(true)}
              activeOpacity={0.8}
              className="mt-6 rounded-full border border-[#334155] bg-[#111827] px-5 py-3"
            >
              <Typography variant="caption" weight="bold" className="uppercase tracking-[0.22em] text-[#BFDBFE]">
                Reintentar
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {!summary && !error && (
          <View className="px-6 mt-4">
            <HomeSkeleton />
          </View>
        )}
      </ScrollView>

      <EventDetailModal
        visible={eventModalVisible}
        event={selectedEvent}
        onClose={() => {
          setEventModalVisible(false);
          setSelectedEvent(null);
        }}
      />
    </View>
  );
});
