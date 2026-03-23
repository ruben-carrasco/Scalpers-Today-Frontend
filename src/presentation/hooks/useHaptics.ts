import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const isNative = Platform.OS !== 'web';

export function useHaptics() {
  return {
    selection: () => {
      if (isNative) Haptics.selectionAsync();
    },
    impact: (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
      if (isNative) Haptics.impactAsync(style);
    },
    impactLight: () => {
      if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    impactHeavy: () => {
      if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    },
    success: () => {
      if (isNative) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    warning: () => {
      if (isNative) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    },
    error: () => {
      if (isNative) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  };
}
