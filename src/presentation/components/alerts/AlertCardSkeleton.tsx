import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../common/Skeleton';
import { borderRadius, spacing } from '@presentation/theme';
import { useThemeMode } from '../../theme/ThemeModeContext';

export function AlertCardSkeleton() {
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
          <Skeleton width="60%" height={18} borderRadius={4} />
          <Skeleton width={44} height={24} borderRadius={12} />
        </View>

        <Skeleton width="80%" height={14} borderRadius={4} style={{ marginTop: 10 }} />

        <View style={styles.chipRow}>
          <Skeleton width={90} height={28} borderRadius={14} />
          <Skeleton width={70} height={28} borderRadius={14} />
        </View>

        <View style={styles.statsRow}>
          <Skeleton width={80} height={14} borderRadius={4} />
          <Skeleton width={60} height={14} borderRadius={4} />
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
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
});
