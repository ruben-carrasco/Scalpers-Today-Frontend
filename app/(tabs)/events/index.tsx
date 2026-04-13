import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ScrollView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Search, X, Flame, TrendingUp, MinusCircle, Globe, Calendar, Clock3, SlidersHorizontal } from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useEventsViewModel, useHaptics } from '../../../src/presentation/hooks';
import { EventCard, EventDetailModal } from '../../../src/presentation/components/events';
import { EventCardSkeleton } from '../../../src/presentation/components/events/EventCardSkeleton';
import { AnimatedCard } from '../../../src/presentation/components/common/AnimatedCard';
import { EventModel } from '../../../src/presentation/models/EventModel';
import { Typography } from '../../../src/presentation/components/common/Typography';

export default observer(function EventsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const eventsViewModel = useEventsViewModel();
  const haptics = useHaptics();

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    eventsViewModel.loadEvents().then(() => {
      if (params.eventId && typeof params.eventId === 'string') {
        const eventToOpen = eventsViewModel.events.find(e => e.id === params.eventId);
        if (eventToOpen) {
          setSelectedEvent(eventToOpen);
          setModalVisible(true);
        }
      }
    });
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [params.eventId]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      eventsViewModel.setSearchFilter(text || undefined);
    }, 400);
  }, []);

  const handleImportanceFilter = (importance: number | undefined) => {
    haptics.selection();
    eventsViewModel.setImportanceFilter(importance);
  };

  const handleCountryFilter = (country: string | undefined) => {
    haptics.selection();
    eventsViewModel.setCountryFilter(country);
  };

  const handleEventPress = (event: EventModel) => {
    haptics.impactLight();
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const { events, isLoading, filters, total, availableCountries } = eventsViewModel;
  const activeCountryLabel = filters.country || 'Todas las regiones';
  const activeImportanceLabel =
    filters.importance === 3 ? 'Alta prioridad' : filters.importance === 2 ? 'Impacto medio' : filters.importance === 1 ? 'Bajo impacto' : 'Todos los impactos';

  return (
    <View className="flex-1 bg-bg-primary">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 18 }} className="bg-bg-primary px-6 pb-4">
        <View className="mb-6 overflow-hidden rounded-[32px] border border-[#1E293B] bg-[#0C1320] px-5 pb-5 pt-5">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#2563EB]/15" />
          <View className="absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-[#F59E0B]/10" />

          <View className="mb-4 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Typography variant="caption" weight="bold" className="mb-2 uppercase tracking-[0.28em] text-[#BFDBFE]">
                Radar de sesión
              </Typography>
              <Typography variant="h1" weight="bold" className="text-text-primary">
                Calendario
              </Typography>
              <Typography variant="body" color="secondary" weight="medium" className="mt-2 leading-6">
                Filtra la agenda económica y localiza rápido las referencias que condicionan timing, exposición y volatilidad.
              </Typography>
            </View>

            <View className="rounded-2xl border border-[#334155] bg-[#0F172A]/75 px-4 py-3">
              <Typography variant="caption" weight="bold" className="mb-1 uppercase tracking-[0.2em] text-[#93C5FD]">
                Hoy
              </Typography>
              <Typography variant="h3" weight="bold" className="text-text-primary">
                {total}
              </Typography>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-[24px] border border-[#203047] bg-[#101A2B] px-4 py-4">
              <View className="mb-2 flex-row items-center gap-2">
                <Clock3 size={15} color="#93C5FD" strokeWidth={2.4} />
                <Typography variant="caption" weight="bold" className="uppercase tracking-[0.2em] text-[#BFDBFE]">
                  Impacto
                </Typography>
              </View>
              <Typography variant="body" weight="bold" className="text-text-primary">
                {activeImportanceLabel}
              </Typography>
            </View>

            <View className="flex-1 rounded-[24px] border border-[#3D3220] bg-[#19150F] px-4 py-4">
              <View className="mb-2 flex-row items-center gap-2">
                <Globe size={15} color="#FCD34D" strokeWidth={2.4} />
                <Typography variant="caption" weight="bold" className="uppercase tracking-[0.2em] text-[#FCD34D]">
                  Cobertura
                </Typography>
              </View>
              <Typography variant="body" weight="bold" className="text-text-primary">
                {activeCountryLabel}
              </Typography>
            </View>
          </View>
        </View>

        <View className="flex-row items-center rounded-[24px] border border-[#27272A] bg-[#18181B] px-4 h-14 gap-3">
          <Search size={20} color="#71717A" strokeWidth={2.5} />
          <TextInput
            className="flex-1 text-[17px] text-text-primary font-medium"
            placeholder="Buscar evento, país o divisa..."
            placeholderTextColor="#71717A"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} className="p-1">
              <X size={20} color="#A1A1AA" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View className="border-b border-[#27272A] bg-bg-primary py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-6 gap-2"
        >
          <View className="mr-1 flex-row items-center gap-2 self-center rounded-full border border-[#2D3340] bg-[#121827] px-3 py-2">
            <SlidersHorizontal size={14} color="#93C5FD" strokeWidth={2.4} />
            <Typography variant="caption" weight="bold" className="uppercase tracking-[0.18em] text-[#BFDBFE]">
              Filtros
            </Typography>
          </View>

          {[
            { label: 'Todos', value: undefined, Icon: null, color: '#FFFFFF' },
            { label: 'Alto', value: 3, Icon: Flame, color: '#FF453A' },
            { label: 'Medio', value: 2, Icon: TrendingUp, color: '#FBBF24' },
            { label: 'Bajo', value: 1, Icon: MinusCircle, color: '#A1A1AA' },
          ].map((item) => {
            const isActive = filters.importance === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => handleImportanceFilter(item.value)}
                activeOpacity={0.7}
                className={`flex-row items-center gap-2 rounded-2xl border px-4 py-2.5 ${isActive ? 'border-[#3F3F46] bg-[#27272A]' : 'border-[#27272A] bg-[#18181B]'}`}
              >
                {item.Icon && <item.Icon size={14} color={isActive ? item.color : '#71717A'} strokeWidth={2.5} />}
                <Typography variant="body" weight="semibold" style={isActive ? { color: item.color } : { color: '#A1A1AA' }}>
                  {item.label}
                </Typography>
              </TouchableOpacity>
            );
          })}

          <View className="w-px h-6 bg-[#27272A] self-center mx-2" />

          <TouchableOpacity
            onPress={() => handleCountryFilter(undefined)}
            activeOpacity={0.7}
            className={`flex-row items-center gap-2 rounded-2xl border px-4 py-2.5 ${!filters.country ? 'border-[#3F3F46] bg-[#27272A]' : 'border-[#27272A] bg-[#18181B]'}`}
          >
            <Globe size={14} color={!filters.country ? '#FFFFFF' : '#71717A'} strokeWidth={2.5} />
            <Typography variant="body" weight="semibold" style={!filters.country ? { color: '#FFFFFF' } : { color: '#A1A1AA' }}>
              Todos
            </Typography>
          </TouchableOpacity>
          
          {availableCountries.map((country) => {
            const isCountryActive = filters.country === country;
            return (
              <TouchableOpacity
                key={country}
                onPress={() => handleCountryFilter(country)}
                activeOpacity={0.7}
                className={`flex-row items-center gap-2 rounded-2xl border px-4 py-2.5 ${isCountryActive ? 'border-[#3F3F46] bg-[#27272A]' : 'border-[#27272A] bg-[#18181B]'}`}
              >
                <Typography variant="body" weight="semibold" style={isCountryActive ? { color: '#FFFFFF' } : { color: '#A1A1AA' }}>
                  {country}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlashList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedCard index={index} onPress={() => handleEventPress(item)}>
            <EventCard event={item} onPress={() => handleEventPress(item)} />
          </AnimatedCard>
        )}
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={async () => {
              await eventsViewModel.loadEvents(true);
              haptics.success();
            }}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </View>
          ) : (
            <View className="items-center px-8 pt-20">
              <View className="mb-5 rounded-full border border-[#2F3640] bg-[#171A1F] p-5">
                <Calendar size={36} color="#94A3B8" strokeWidth={2} />
              </View>
              <Typography variant="h2" weight="bold" color="secondary">
                No hay eventos visibles
              </Typography>
              <Typography variant="body" color="muted" className="mt-3 text-center leading-6">
                {searchText || filters.country || filters.importance
                  ? 'Prueba a limpiar filtros o usar una búsqueda más amplia.'
                  : 'La agenda no ha devuelto eventos para esta sesión.'}
              </Typography>
              {(searchText || filters.country || filters.importance) && (
                <TouchableOpacity
                  onPress={() => {
                    handleSearch('');
                    handleImportanceFilter(undefined);
                    handleCountryFilter(undefined);
                  }}
                  activeOpacity={0.8}
                  className="mt-6 rounded-full border border-[#334155] bg-[#111827] px-5 py-3"
                >
                  <Typography variant="caption" weight="bold" className="uppercase tracking-[0.2em] text-[#BFDBFE]">
                    Limpiar filtros
                  </Typography>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />

      <EventDetailModal
        event={selectedEvent}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
});
