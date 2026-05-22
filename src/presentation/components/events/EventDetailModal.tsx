import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Platform, UIManager, Modal, View, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { EventModel } from '../../models/EventModel';
import { getImportanceColor } from '../../theme';
import { colors } from '../../theme/tokens';
import { useThemeMode } from '../../theme/ThemeModeContext';
import { Typography } from '../common/Typography';
import { EventHeader } from './sections/EventHeader';
import { EventDataSection } from './sections/EventDataSection';
import {
  EventAnalysisSection,
  EventAnalysisUnavailableSection,
} from './sections/EventAnalysisSection';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface EventDetailModalProps {
  event: EventModel | null;
  visible: boolean;
  onClose: () => void;
}

export function EventDetailModal({ event, visible, onClose }: EventDetailModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const lastEventRef = useRef<EventModel | null>(null);
  const hasNotifiedCloseRef = useRef(false);
  const snapPoints = useMemo(
    () => (Platform.OS === 'android' ? ['70%', '92%'] : ['65%', '90%']),
    []
  );
  const { isDarkMode } = useThemeMode();
  const insets = useSafeAreaInsets();

  // Keep last event data so content stays visible during close animation
  if (event) {
    lastEventRef.current = event;
  }

  useEffect(() => {
    if (visible && event) {
      hasNotifiedCloseRef.current = false;
      bottomSheetModalRef.current?.present();
      bottomSheetModalRef.current?.snapToIndex(event.aiAnalysis ? 1 : 0);
      return;
    }

    if (!visible) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible, event]);

  const notifyClosed = useCallback(() => {
    if (hasNotifiedCloseRef.current) {
      return;
    }

    hasNotifiedCloseRef.current = true;
    onClose();
  }, [onClose]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      lastEventRef.current = null;
      notifyClosed();
    }
  }, [notifyClosed]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  const displayEvent = lastEventRef.current;
  if (!displayEvent) return null;

  const impColor = getImportanceColor(displayEvent.importance);
  const isAndroid = Platform.OS === 'android';

  if (isAndroid) {
    return (
      <Modal
        visible={visible && Boolean(displayEvent)}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={onClose}
      >
        <View className="flex-1" style={{ backgroundColor: isDarkMode ? colors.bg.modal : '#FFFFFF' }}>
          <View
            className="px-6 pb-4 border-b"
            style={{
              borderBottomColor: isDarkMode ? colors.border.medium : '#CBD5E1',
              paddingTop: Math.max(insets.top + (StatusBar.currentHeight ?? 0) + 10, 28),
            }}
          >
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center gap-3">
                <View className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: impColor + '20' }}>
                  <Typography variant="h3" weight="bold" style={{ color: impColor }} className="font-mono">
                    {displayEvent.time}
                  </Typography>
                </View>
                <Typography variant="h3" weight="bold" style={{ color: impColor }}>
                  {displayEvent.importanceStars}
                </Typography>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: isDarkMode ? colors.bg.modalCard : '#F4F4F5' }}
              >
                <X size={20} color={colors.text.icon} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Typography variant="h1" weight="bold" className="leading-tight" style={{ color: isDarkMode ? colors.text.primary : '#0F172A' }}>
              {displayEvent.title}
            </Typography>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 18,
              paddingBottom: Math.max(insets.bottom + 80, 120),
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <EventDataSection event={displayEvent} />
            {displayEvent.aiAnalysis ? (
              <EventAnalysisSection ai={displayEvent.aiAnalysis} isHighImpact={displayEvent.importance === 3} />
            ) : (
              <EventAnalysisUnavailableSection />
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      bottomInset={Platform.OS === 'android' ? Math.max(insets.bottom + 20, 28) : Math.max(insets.bottom, 8)}
      onChange={handleSheetChanges}
      onDismiss={notifyClosed}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: isDarkMode ? colors.bg.modal : '#FFFFFF' }}
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? colors.border.indicator : '#CBD5E1' }}
    >
      <BottomSheetView className="flex-1">
        <EventHeader
          event={displayEvent}
          impColor={impColor}
          bottomSheetModalRef={bottomSheetModalRef}
          onClose={notifyClosed}
        />

        <BottomSheetScrollView
          key={displayEvent.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: Platform.OS === 'android'
              ? Math.max(insets.bottom + 84, 120)
              : Math.max(insets.bottom + 28, 40),
          }}
          keyboardShouldPersistTaps="handled"
        >
          <EventDataSection event={displayEvent} />

          {displayEvent.aiAnalysis ? (
            <EventAnalysisSection ai={displayEvent.aiAnalysis} isHighImpact={displayEvent.importance === 3} />
          ) : (
            <EventAnalysisUnavailableSection />
          )}

        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
