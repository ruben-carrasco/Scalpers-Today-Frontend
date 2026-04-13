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
import { Search, X, Flame, TrendingUp, MinusCircle, Globe, Calendar } from 'lucide-react-native';
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
  }, [eventsViewModel, params.eventId]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      eventsViewModel.setSearchFilter(text || undefined);
    }, 400);
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
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const { events, isLoading, filters, total, availableCountries } = eventsViewModel;

  return (
    <View className="flex-1 bg-bg-primary">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-4 bg-bg-primary">
        <View className="flex-row justify-between items-end mb-6">
          <View>
            <Typography variant="h1" weight="bold" className="text-text-primary">Calendario</Typography>
            <Typography variant="body" color="muted" weight="medium" className="mt-1">{total} eventos hoy</Typography>
          </View>
        </View>

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

      {/* Filters */}
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
            <View className="items-center pt-20 px-8 gap-4">
              <Calendar size={48} color="#3F3F46" strokeWidth={2} />
              <Typography variant="h2" weight="bold" color="secondary">No hay eventos</Typography>
              <Typography variant="body" color="muted" className="text-center">
                {searchText ? 'Intenta con otros términos' : 'No se encontraron eventos para hoy'}
              </Typography>
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
