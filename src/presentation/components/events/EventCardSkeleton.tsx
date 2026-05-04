import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../common/Skeleton';
import { borderRadius, spacing } from '@presentation/theme';
import { useThemeMode } from '../../theme/ThemeModeContext';

export function EventCardSkeleton() {
  const { isDarkMode } = useThemeMode();
  const cardStyle = {
    backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
    borderColor: isDarkMode ? '#1F2937' : '#E4E4E7',
  };
  const accentStyle = { backgroundColor: isDarkMode ? '#1F2937' : '#CBD5E1' };

  return (
    <View style={[styles.card, cardStyle]}>
      <View style={[styles.accentBar, accentStyle]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Skeleton width={64} height={24} borderRadius={12} />
          <Skeleton width={48} height={16} borderRadius={8} />
        </View>

        <Skeleton width="90%" height={16} borderRadius={4} style={{ marginTop: 12 }} />
        <Skeleton width="60%" height={16} borderRadius={4} style={{ marginTop: 6 }} />

        <View style={styles.metaRow}>
          <Skeleton width={80} height={14} borderRadius={4} />
          <Skeleton width={40} height={14} borderRadius={4} />
        </View>

        <View style={styles.dataRow}>
          <Skeleton width="30%" height={32} borderRadius={8} />
          <Skeleton width="30%" height={32} borderRadius={8} />
          <Skeleton width="30%" height={32} borderRadius={8} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});
