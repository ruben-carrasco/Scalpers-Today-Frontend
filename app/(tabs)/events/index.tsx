import { useEffect, useState, useCallback, useRef } from 'react';
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
import {
  Search,
  X,
  Flame,
  TrendingUp,
  MinusCircle,
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
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
  const requestedEventId = typeof params.eventId === 'string' ? params.eventId : undefined;
  const [searchText, setSearchText] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);

  const eventsViewModel = useEventsViewModel();
  const haptics = useHaptics();
  const openedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    openedEventIdRef.current = null;

    if (!requestedEventId) {
      void eventsViewModel.loadEvents();
      return;
    }

    setSearchText('');

    if (Object.keys(eventsViewModel.filters).length > 0) {
      eventsViewModel.clearFilters();
    }

    void eventsViewModel.loadEvents(true);
  }, [eventsViewModel, requestedEventId]);

  useEffect(() => {
    if (!requestedEventId || openedEventIdRef.current === requestedEventId) {
      return;
    }

    const eventToOpen = eventsViewModel.findEventById(requestedEventId);
    if (!eventToOpen) {
      return;
    }

    if (eventToOpen.eventDate && eventsViewModel.selectedDate !== eventToOpen.eventDate) {
      eventsViewModel.setSelectedDate(eventToOpen.eventDate);
      return;
    }

    openedEventIdRef.current = requestedEventId;
    setSelectedEventId(eventToOpen.id);
    setModalVisible(true);
  }, [eventsViewModel, eventsViewModel.events, eventsViewModel.selectedDate, requestedEventId]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    eventsViewModel.setSearchFilter(text || undefined);
  }, [eventsViewModel]);

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
    setSelectedEventId(event.id);
    setModalVisible(true);
  };

  const handleSelectDay = (date: string) => {
    haptics.selection();
    eventsViewModel.setSelectedDate(date);
    setIsDaySelectorOpen(false);
  };

  const {
    events,
    isLoading,
    filters,
    total,
    availableCountries,
    weekDays,
    selectedDate,
    selectedDayLabel,
  } = eventsViewModel;

  const selectedDay = weekDays.find(day => day.date === selectedDate);
  const selectedEvent = selectedEventId ? eventsViewModel.findEventById(selectedEventId) ?? null : null;

  return (
    <View className="flex-1 bg-bg-primary">
      <StatusBar barStyle="light-content" />

      <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-4 bg-bg-primary gap-4">
        <View className="flex-row justify-between items-end">
          <View>
            <Typography variant="h1" weight="bold" className="text-text-primary">Calendario</Typography>
            <Typography variant="body" color="muted" weight="medium" className="mt-1">
              {total} eventos · {selectedDayLabel}
            </Typography>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsDaySelectorOpen(value => !value)}
          className="bg-[#18181B] border border-[#27272A] rounded-2xl px-4 py-3 gap-2"
        >
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Typography variant="caption" color="muted" weight="semibold">Semana actual</Typography>
              <Typography variant="body" weight="semibold" color="primary">
                {selectedDay?.fullLabel ?? selectedDayLabel}
              </Typography>
            </View>
            {isDaySelectorOpen ? (
              <ChevronUp size={18} color="#A1A1AA" strokeWidth={2.5} />
            ) : (
              <ChevronDown size={18} color="#A1A1AA" strokeWidth={2.5} />
            )}
          </View>
          <Typography variant="caption" color="muted">
            {selectedDay?.count ?? 0} eventos programados ese día
          </Typography>
        </TouchableOpacity>

        {isDaySelectorOpen && (
          <View className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden">
            {weekDays.map(day => {
              const isActive = day.date === selectedDate;
              return (
                <TouchableOpacity
                  key={day.date}
                  activeOpacity={0.8}
                  onPress={() => handleSelectDay(day.date)}
                  className={`px-4 py-3 flex-row items-center justify-between ${isActive ? 'bg-[#27272A]' : ''}`}
                >
                  <View>
                    <Typography variant="body" weight="semibold" style={{ color: isActive ? '#FFFFFF' : '#D4D4D8' }}>
                      {day.fullLabel}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {day.isToday ? 'Hoy' : day.shortLabel}
                    </Typography>
                  </View>
                  <Typography variant="caption" weight="semibold" style={{ color: isActive ? '#FFFFFF' : '#A1A1AA' }}>
                    {day.count} eventos
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View className="flex-row items-center bg-[#18181B] rounded-2xl px-4 h-12 gap-3 border border-[#27272A]">
          <Search size={20} color="#71717A" strokeWidth={2.5} />
          <TextInput
            className="flex-1 text-[17px] text-text-primary font-medium"
            placeholder="Buscar evento..."
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

      <View className="py-2 bg-bg-primary border-b border-[#27272A]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-6 gap-2"
        >
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
                className={`flex-row items-center px-4 py-2.5 rounded-xl border gap-2 ${isActive ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-[#18181B] border-[#27272A]'}`}
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
            className={`flex-row items-center px-4 py-2.5 rounded-xl border gap-2 ${!filters.country ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-[#18181B] border-[#27272A]'}`}
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
                className={`flex-row items-center px-4 py-2.5 rounded-xl border gap-2 ${isCountryActive ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-[#18181B] border-[#27272A]'}`}
              >
                <Typography variant="body" weight="semibold" style={isCountryActive ? { color: '#FFFFFF' } : { color: '#A1A1AA' }}>
                  {country}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlashList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedCard index={index}>
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
              {Array.from({ length: 5 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </View>
          ) : (
            <View className="items-center pt-20 px-8 gap-4">
              <Calendar size={48} color="#3F3F46" strokeWidth={2} />
              <Typography variant="h2" weight="bold" color="secondary">No hay eventos</Typography>
              <Typography variant="body" color="muted" className="text-center">
                {searchText
                  ? 'Intenta con otros términos'
                  : `No se encontraron eventos para ${selectedDay?.fullLabel ?? 'el día seleccionado'}`}
              </Typography>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />

      <EventDetailModal
        event={selectedEvent}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedEventId(null);
        }}
      />
    </View>
  );
});
