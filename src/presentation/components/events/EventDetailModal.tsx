import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, Platform, UIManager } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { EventModel } from '../../models/EventModel';
import { getImportanceColor } from '../../theme';
import { colors } from '../../theme/tokens';
import { EventHeader } from './sections/EventHeader';
import { EventDataSection } from './sections/EventDataSection';
import { EventAnalysisSection } from './sections/EventAnalysisSection';

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
  const snapPoints = useMemo(() => ['65%', '90%'], []);

  // Keep last event data so content stays visible during close animation
  if (event) {
    lastEventRef.current = event;
  }

  useEffect(() => {
    if (visible && event) {
      hasNotifiedCloseRef.current = false;
      bottomSheetModalRef.current?.present();
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

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleSheetChanges}
      onDismiss={notifyClosed}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.bg.modal }}
      handleIndicatorStyle={{ backgroundColor: colors.border.indicator }}
    >
      <BottomSheetView className="flex-1">
        <EventHeader
          event={displayEvent}
          impColor={impColor}
          bottomSheetModalRef={bottomSheetModalRef}
          onClose={notifyClosed}
        />

        <ScrollView showsVerticalScrollIndicator={false} className="px-6">
          <EventDataSection event={displayEvent} />

          {displayEvent.aiAnalysis && (
            <EventAnalysisSection ai={displayEvent.aiAnalysis} />
          )}

          <View className="h-10" />
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
