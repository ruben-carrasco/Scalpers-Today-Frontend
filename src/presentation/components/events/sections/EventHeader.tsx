import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { X, Flag, Banknote } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { EventModel } from '../../../models/EventModel';
import { Typography } from '../../common/Typography';
import { colors } from '../../../theme/tokens';
import { useThemeMode } from '../../../theme/ThemeModeContext';

interface EventHeaderProps {
  event: EventModel;
  impColor: string;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  onClose: () => void;
}

export function EventHeader({ event, impColor, bottomSheetModalRef, onClose }: EventHeaderProps) {
  const { isDarkMode } = useThemeMode();
  const chipBg = isDarkMode ? colors.bg.modalCard : '#F4F4F5';
  const chipText = isDarkMode ? colors.text.light : '#334155';
  const titleColor = isDarkMode ? colors.text.primary : '#0F172A';

  return (
    <>
      <View className="flex-row justify-between items-center px-6 py-4">
        <View className="flex-row items-center gap-3">
          <View className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: impColor + '20' }}>
            <Typography variant="h3" weight="bold" style={{ color: impColor }} className="font-mono">
              {event.time}
            </Typography>
          </View>
          <Typography variant="h3" weight="bold" style={{ color: impColor }}>
            {event.importanceStars}
          </Typography>
        </View>
        <TouchableOpacity
          onPress={() => {
            onClose();
            bottomSheetModalRef.current?.dismiss();
          }}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: chipBg }}
        >
          <X size={20} color={colors.text.icon} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <Typography variant="h1" weight="bold" className="mb-4 leading-tight px-6" style={{ color: titleColor }}>
        {event.title}
      </Typography>

      <View className="flex-row items-center gap-3 mb-6 px-6">
        <View className="flex-row items-center px-3 py-1.5 rounded-lg gap-2" style={{ backgroundColor: chipBg }}>
          <Flag size={14} color={colors.brand.primaryLight} strokeWidth={2} />
          <Typography variant="body" weight="semibold" style={{ color: chipText }}>{event.country}</Typography>
        </View>
        <View className="flex-row items-center px-3 py-1.5 rounded-lg gap-2" style={{ backgroundColor: chipBg }}>
          <Banknote size={14} color={colors.semantic.successLight} strokeWidth={2} />
          <Typography variant="body" weight="semibold" style={{ color: chipText }}>{event.currency}</Typography>
        </View>
      </View>
    </>
  );
}
