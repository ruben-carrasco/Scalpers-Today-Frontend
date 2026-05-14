import { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ScrollView,
  FlatList,
  Platform,
  Modal,
  AppState,
} from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
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
import { EventModel } from '../../../src/presentation/models/EventModel';
import { Typography } from '../../../src/presentation/components/common/Typography';
import { useThemeMode } from '../../../src/presentation/theme/ThemeModeContext';

type DayTone = {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
};

function getDayTone(count: number, isDarkMode: boolean): DayTone {
  if (count === 0) {
    return {
      label: 'Sin eventos',
      color: isDarkMode ? '#A1A1AA' : '#475569',
      backgroundColor: isDarkMode ? '#18181B' : '#F8FAFC',
      borderColor: isDarkMode ? '#27272A' : '#CBD5E1',
    };
  }

  if (count >= 40) {
    return {
      label: 'Alta actividad',
      color: isDarkMode ? '#FF453A' : '#B91C1C',
      backgroundColor: isDarkMode ? '#7F1D1D33' : '#FEE2E2',
      borderColor: isDarkMode ? '#991B1B' : '#FCA5A5',
    };
  }

  if (count >= 15) {
    return {
      label: 'Día activo',
      color: isDarkMode ? '#FBBF24' : '#92400E',
      backgroundColor: isDarkMode ? '#78350F33' : '#FEF3C7',
      borderColor: isDarkMode ? '#92400E' : '#F59E0B',
    };
  }

  return {
    label: 'Agenda ligera',
    color: isDarkMode ? '#60A5FA' : '#1D4ED8',
    backgroundColor: isDarkMode ? '#1D4ED833' : '#DBEAFE',
    borderColor: isDarkMode ? '#1D4ED8' : '#93C5FD',
  };
}

function getImportanceLabel(importance: number | undefined): string | null {
  switch (importance) {
    case 3:
      return 'Alto impacto';
    case 2:
      return 'Impacto medio';
    case 1:
      return 'Bajo impacto';
    default:
      return null;
  }
}

export default observer(function EventsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const requestedEventId = typeof params.eventId === 'string' ? params.eventId : undefined;
  const [searchText, setSearchText] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const eventsViewModel = useEventsViewModel();
  const haptics = useHaptics();
  const { isDarkMode } = useThemeMode();
  const palette = isDarkMode
    ? {
        screenBg: '#000000',
        statusBar: 'light-content' as const,
        surfaceBg: '#18181B',
        surfaceBorder: '#27272A',
        surfaceStrong: '#27272A',
        surfaceStrongBorder: '#3F3F46',
        textPrimary: '#FFFFFF',
        textSecondary: '#A1A1AA',
        textMuted: '#64748B',
        textSoft: '#D4D4D8',
        modalOverlay: 'rgba(0,0,0,0.6)',
        modalSheetBg: '#111113',
      }
    : {
        screenBg: '#F4F4F5',
        statusBar: 'dark-content' as const,
        surfaceBg: '#FFFFFF',
        surfaceBorder: '#E4E4E7',
        surfaceStrong: '#DBEAFE',
        surfaceStrongBorder: '#93C5FD',
        textPrimary: '#18181B',
        textSecondary: '#334155',
        textMuted: '#475569',
        textSoft: '#334155',
        modalOverlay: 'rgba(15,23,42,0.2)',
        modalSheetBg: '#FFFFFF',
      };
  const openedEventIdRef = useRef<string | null>(null);
  const flatEventsListRef = useRef<FlatList<EventModel>>(null);
  const flashEventsListRef = useRef<FlashListRef<EventModel>>(null);
  const listOffsetYRef = useRef(0);

  const scrollEventsToTop = useCallback((animated: boolean = true) => {
    requestAnimationFrame(() => {
      const listRef = Platform.OS === 'ios' ? flatEventsListRef : flashEventsListRef;
      listRef.current?.scrollToOffset({ offset: 0, animated });
    });
  }, []);

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

  useFocusEffect(
    useCallback(() => {
      void eventsViewModel.loadEvents();

      // iOS may preserve a tiny negative offset when returning from another tab.
      // If user was already at the top, snap back to 0 to avoid a visible gap.
      requestAnimationFrame(() => {
        if (listOffsetYRef.current <= 16) {
          scrollEventsToTop(false);
        }
      });

      const subscription = AppState.addEventListener('change', (nextState) => {
        if (nextState === 'active') {
          void eventsViewModel.loadEvents();
          requestAnimationFrame(() => {
            if (listOffsetYRef.current <= 16) {
              scrollEventsToTop(false);
            }
          });
        }
      });

      return () => {
        subscription.remove();
      };
    }, [eventsViewModel, scrollEventsToTop])
  );

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
    scrollEventsToTop(false);
  }, [eventsViewModel, scrollEventsToTop]);

  const handleImportanceFilter = (importance: number | undefined) => {
    haptics.selection();
    eventsViewModel.setImportanceFilter(importance);
    scrollEventsToTop(false);
  };

  const handleCountryFilter = (country: string | undefined) => {
    haptics.selection();
    eventsViewModel.setCountryFilter(country);
    scrollEventsToTop(false);
  };

  const handleEventPress = (event: EventModel) => {
    haptics.impactLight();
    setSelectedEventId(event.id);
    setModalVisible(true);
  };

  const handleSelectDay = (date: string) => {
    haptics.selection();
    eventsViewModel.setSelectedDate(date);
    scrollEventsToTop(false);
    setIsControlsOpen(false);
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
  const selectedDayTone = getDayTone(selectedDay?.count ?? 0, isDarkMode);
  const hasActiveFilters = Boolean(searchText || filters.importance || filters.country);
  const activeFilterLabels = [
    searchText ? `“${searchText}”` : null,
    getImportanceLabel(filters.importance),
    filters.country ? filters.country : null,
  ].filter(Boolean);
  const listContextKey = [
    selectedDate,
    searchText.trim(),
    filters.importance ?? 'all-importance',
    filters.country ?? 'all-countries',
  ].join(':');
  const isIOS = Platform.OS === 'ios';
  const eventsListContentStyle = { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 120 };

  const handleClearVisibleFilters = () => {
    haptics.selection();
    setSearchText('');
    eventsViewModel.clearFilters();
    scrollEventsToTop();
  };

  const renderEventItem = ({ item }: { item: EventModel }) => (
    <EventCard event={item} onPress={() => handleEventPress(item)} />
  );

  const eventsRefreshControl = (
    <RefreshControl
      refreshing={isLoading}
      onRefresh={async () => {
        await eventsViewModel.loadEvents(true);
        haptics.success();
      }}
      tintColor="#3B82F6"
      progressViewOffset={0}
    />
  );

  const emptyEventsComponent = isLoading ? (
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
        {hasActiveFilters
          ? 'No hay eventos que coincidan con los filtros aplicados.'
          : `No se encontraron eventos para ${selectedDay?.fullLabel ?? 'el día seleccionado'}.`}
      </Typography>

      {hasActiveFilters ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleClearVisibleFilters}
          className="px-5 py-3 rounded-2xl border"
          style={{ backgroundColor: palette.surfaceStrong, borderColor: palette.surfaceStrongBorder }}
        >
          <Typography variant="body" weight="bold" style={{ color: palette.textPrimary }}>
            Limpiar filtros
          </Typography>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            await eventsViewModel.loadEvents(true);
            haptics.success();
          }}
          className="px-5 py-3 rounded-2xl border"
          style={{ backgroundColor: '#1D4ED833', borderColor: '#1D4ED8' }}
        >
          <Typography variant="body" weight="bold" style={{ color: '#60A5FA' }}>
            Actualizar calendario
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: palette.screenBg }}>
      <StatusBar barStyle={palette.statusBar} />

      <View style={{ paddingTop: insets.top + 20, backgroundColor: palette.screenBg }} className="px-6 pb-4 gap-4">
        <View className="flex-row justify-between items-end">
          <View>
            <Typography variant="h1" weight="bold" style={{ color: palette.textPrimary }}>Calendario</Typography>
            <Typography variant="body" color="muted" weight="medium" className="mt-1">
              {total} eventos · {selectedDayLabel}
            </Typography>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsControlsOpen(value => !value)}
          className="border rounded-2xl px-4 py-3 gap-2"
          style={{ backgroundColor: palette.surfaceBg, borderColor: palette.surfaceBorder }}
        >
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Typography variant="caption" color="muted" weight="semibold">Día</Typography>
              <Typography variant="body" weight="semibold" style={{ color: palette.textPrimary }}>
                {selectedDay?.fullLabel ?? selectedDayLabel}
              </Typography>
            </View>
            <View className="flex-row items-center gap-3">
              <View
                className="px-3 py-1 rounded-full border"
                style={{
                  backgroundColor: selectedDayTone.backgroundColor,
                  borderColor: selectedDayTone.borderColor,
                }}
              >
                <Typography variant="caption" weight="bold" style={{ color: selectedDayTone.color }}>
                  {selectedDayTone.label}
                </Typography>
              </View>
              {isControlsOpen ? (
                <ChevronUp size={18} color={palette.textSecondary} strokeWidth={2.5} />
              ) : (
                <ChevronDown size={18} color={palette.textSecondary} strokeWidth={2.5} />
              )}
            </View>
          </View>
          <Typography variant="caption" color="muted">
            {selectedDay?.count ?? 0} eventos · {hasActiveFilters ? `${activeFilterLabels.length} filtros activos` : 'sin filtros activos'}
          </Typography>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <View
            className="flex-1 flex-row items-center rounded-2xl px-4 h-12 gap-3 border"
            style={{ backgroundColor: palette.surfaceBg, borderColor: palette.surfaceBorder }}
          >
            <Search size={20} color={palette.textMuted} strokeWidth={2.5} />
            <TextInput
              className="flex-1 text-[17px] font-medium"
              style={{ color: palette.textPrimary }}
              placeholder="Buscar evento..."
              placeholderTextColor={palette.textMuted}
              value={searchText}
              onChangeText={handleSearch}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')} className="p-1">
                <X size={20} color={palette.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsFiltersModalOpen(true)}
            className="h-12 px-3 rounded-2xl border flex-row items-center gap-2"
            style={{ borderColor: palette.surfaceBorder, backgroundColor: palette.surfaceBg }}
          >
            <Typography variant="caption" weight="semibold" style={{ color: palette.textPrimary }}>
              Filtros
            </Typography>
            {hasActiveFilters && (
              <View className="px-1.5 py-0.5 rounded-full bg-[#2563EB33] border border-[#1D4ED8]">
                <Typography variant="caption" weight="bold" style={{ color: '#60A5FA' }}>
                  {activeFilterLabels.length}
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {isControlsOpen && (
        <View className="mx-6 mb-2 border rounded-2xl overflow-hidden" style={{ backgroundColor: palette.surfaceBg, borderColor: palette.surfaceBorder }}>
          <View className="px-4 py-3 border-b" style={{ borderBottomColor: palette.surfaceBorder }}>
            <Typography variant="caption" color="muted" weight="semibold">Seleccionar día</Typography>
          </View>

          <ScrollView
            style={{ maxHeight: 320 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {weekDays.map(day => {
              const isActive = day.date === selectedDate;
              const tone = getDayTone(day.count, isDarkMode);
              const titleColor = isActive
                ? palette.textPrimary
                : day.count === 0
                  ? palette.textSecondary
                  : palette.textSoft;
              return (
                <TouchableOpacity
                  key={day.date}
                  activeOpacity={0.8}
                  onPress={() => handleSelectDay(day.date)}
                  className="px-4 py-3 flex-row items-center justify-between border-b"
                  style={{
                    borderBottomColor: palette.surfaceBorder,
                    backgroundColor: isActive ? palette.surfaceStrong : 'transparent',
                  }}
                >
                  <View>
                    <Typography variant="body" weight="semibold" style={{ color: titleColor }}>
                      {day.fullLabel}
                    </Typography>
                    <View className="flex-row items-center gap-2 mt-1">
                      <Typography variant="caption" color="muted">
                        {day.shortLabel}
                      </Typography>
                      {day.isToday && (
                        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: '#2563EB33' }}>
                          <Typography variant="caption" weight="bold" style={{ color: isDarkMode ? '#60A5FA' : '#1D4ED8' }}>
                            Hoy
                          </Typography>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="items-end gap-1">
                    <View
                      className="px-2.5 py-1 rounded-full border"
                      style={{ backgroundColor: tone.backgroundColor, borderColor: tone.borderColor }}
                    >
                      <Typography variant="caption" weight="bold" style={{ color: tone.color }}>
                        {tone.label}
                      </Typography>
                    </View>
                    <Typography variant="caption" weight="semibold" style={{ color: isActive ? palette.textPrimary : palette.textSecondary }}>
                      {day.count} eventos
                    </Typography>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {isIOS ? (
        <FlatList
          key={listContextKey}
          ref={flatEventsListRef}
          data={events}
          extraData={listContextKey}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={eventsListContentStyle}
          contentInsetAdjustmentBehavior="never"
          contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
          scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={eventsRefreshControl}
          ListEmptyComponent={emptyEventsComponent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          onScroll={(event) => {
            listOffsetYRef.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        />
      ) : (
        <FlashList
          key={listContextKey}
          ref={flashEventsListRef}
          data={events}
          extraData={listContextKey}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={eventsListContentStyle}
          keyboardShouldPersistTaps="handled"
          refreshControl={eventsRefreshControl}
          ListEmptyComponent={emptyEventsComponent}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            listOffsetYRef.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        />
      )}

      <EventDetailModal
        event={selectedEvent}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedEventId(null);
        }}
      />

      <Modal
        visible={isFiltersModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFiltersModalOpen(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: palette.modalOverlay }}>
          <View className="rounded-t-3xl border-t pb-8 pt-4 gap-3" style={{ backgroundColor: palette.modalSheetBg, borderTopColor: palette.surfaceBorder }}>
            <View className="px-6 flex-row items-center justify-between">
              <Typography variant="h2" weight="bold" color="secondary">Filtros</Typography>
              <TouchableOpacity onPress={() => setIsFiltersModalOpen(false)} className="p-2">
                <X size={20} color={palette.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-6 gap-2"
            >
              {hasActiveFilters && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleClearVisibleFilters}
                  className="flex-row items-center px-4 py-2.5 rounded-xl border gap-2"
                  style={{ backgroundColor: palette.surfaceStrong, borderColor: palette.surfaceStrongBorder }}
                >
                  <X size={14} color={palette.textPrimary} strokeWidth={2.5} />
                  <Typography variant="body" weight="semibold" style={{ color: palette.textPrimary }}>
                    Limpiar
                  </Typography>
                </TouchableOpacity>
              )}

              {[
                { label: 'Todos', value: undefined, Icon: null, color: isDarkMode ? '#FFFFFF' : '#0F172A' },
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
                    className="flex-row items-center px-4 py-2.5 rounded-xl border gap-2"
                    style={{
                      backgroundColor: isActive ? palette.surfaceStrong : palette.surfaceBg,
                      borderColor: isActive ? palette.surfaceStrongBorder : palette.surfaceBorder,
                    }}
                  >
                    {item.Icon && <item.Icon size={14} color={isActive ? item.color : palette.textMuted} strokeWidth={2.5} />}
                    <Typography variant="body" weight="semibold" style={isActive ? { color: item.color } : { color: palette.textSecondary }}>
                      {item.label}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-6 gap-2"
            >
              <TouchableOpacity
                onPress={() => handleCountryFilter(undefined)}
                activeOpacity={0.7}
                className="flex-row items-center px-4 py-2.5 rounded-xl border gap-2"
                style={{
                  backgroundColor: !filters.country ? palette.surfaceStrong : palette.surfaceBg,
                  borderColor: !filters.country ? palette.surfaceStrongBorder : palette.surfaceBorder,
                }}
              >
                <Globe size={14} color={!filters.country ? palette.textPrimary : palette.textMuted} strokeWidth={2.5} />
                <Typography variant="body" weight="semibold" style={!filters.country ? { color: palette.textPrimary } : { color: palette.textSecondary }}>
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
                    className="flex-row items-center px-4 py-2.5 rounded-xl border gap-2"
                    style={{
                      backgroundColor: isCountryActive ? palette.surfaceStrong : palette.surfaceBg,
                      borderColor: isCountryActive ? palette.surfaceStrongBorder : palette.surfaceBorder,
                    }}
                  >
                    <Typography variant="body" weight="semibold" style={isCountryActive ? { color: palette.textPrimary } : { color: palette.textSecondary }}>
                      {country}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
});
