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
  const snapPoints = useMemo(() => ['65%', '90%'], []);

  useEffect(() => {
    if (visible && event) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible, event]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

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

  if (!event) return null;

  const impColor = getImportanceColor(event.importance);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.bg.modal }}
      handleIndicatorStyle={{ backgroundColor: colors.border.indicator }}
    >
      <BottomSheetView className="flex-1">
        <EventHeader event={event} impColor={impColor} bottomSheetModalRef={bottomSheetModalRef} />

        <ScrollView showsVerticalScrollIndicator={false} className="px-6">
          <EventDataSection event={event} />

          {event.aiAnalysis && (
            <EventAnalysisSection ai={event.aiAnalysis} />
          )}

          <View className="h-10" />
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
