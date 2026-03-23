import { useEffect, useState } from 'react';
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
  }, []);

  const { summary, briefing, isLoadingSummary, error } = homeViewModel;
  const userName = authViewModel.user?.name?.split(' ')[0] || 'Trader';

  const sentiment = summary?.marketSentiment?.overall
    ? translateSentiment(summary.marketSentiment.overall)
    : { text: 'Neutral', type: 'neutral' as const };

  const volatility = summary?.marketSentiment?.volatility
    ? translateVolatility(summary.marketSentiment.volatility)
    : 'Normal';

  // --- REMOVED MOCK DATA PARA PROBAR LOS DESTACADOS ---
  const activeSummary = summary;

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
          <View className="px-6 mt-4 pb-32">
            <View className="mb-8">
              <MarketOverviewCard
                stats={activeSummary.todayStats}
                sentiment={sentiment}
                volatility={volatility}
              />
            </View>

            <View className="mb-8">
              <Typography variant="h2" weight="bold" className="mb-4 text-text-primary">
                Próximo Evento
              </Typography>
              {activeSummary.nextEvent ? (
                <NextEventCard
                  event={activeSummary.nextEvent}
                  onPress={() => {
                    setSelectedEvent(createEventModel(activeSummary.nextEvent!));
                    setEventModalVisible(true);
                  }}
                />
              ) : (
                <View className="bg-[#18181B] rounded-3xl p-6 border border-[#27272A] items-center justify-center py-10">
                  <Calendar size={32} color="#52525B" strokeWidth={2} />
                  <Typography variant="body" weight="semibold" color="secondary" className="mt-4">
                    No hay más eventos hoy
                  </Typography>
                  <Typography variant="caption" color="muted" className="mt-1">
                    El mercado ha cerrado su agenda económica
                  </Typography>
                </View>
              )}
            </View>

            {briefing && (
              <View className="mb-8">
                <Typography variant="h2" weight="bold" className="mb-4">
                  Briefing del Día
                </Typography>

                <View className="bg-[#18181B] rounded-3xl p-6 border border-[#27272A] mb-4">
                  <FormattedAIText text={briefing.generalOutlook} />
                </View>

                {briefing.cautionaryHours && briefing.cautionaryHours.length > 0 && (
                  <View className="bg-[#18181B] border border-[#FBBF24]/30 rounded-3xl p-6 mb-4">
                    <View className="flex-row items-center gap-2 mb-4">
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
                  <View className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6">
                    <View className="flex-row items-center gap-2 mb-4">
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
                <Typography variant="h2" weight="bold" className="mb-4">
                  Destacados
                </Typography>
                <View className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6">
                  {activeSummary.highlights.slice(0, 5).map((highlightEvent, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        haptics.impactLight();
                        const eventModel = createEventModel(highlightEvent);
                        setSelectedEvent(eventModel);
                        setEventModalVisible(true);
                      }}
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
          <View className="mx-6 mt-10 p-8 bg-[#18181B] rounded-3xl items-center border border-[#FF453A]/30">
            <CloudOff size={56} color="#FF453A" strokeWidth={1.5} />
            <Typography variant="h2" weight="bold" color="danger" className="mt-4">
              Sin conexión
            </Typography>
            <Typography variant="body" color="secondary" className="mt-3 text-center leading-relaxed">
              {error}
            </Typography>
          </View>
        )}

        {!summary && !error && (
          <View className="px-6 mt-6">
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
