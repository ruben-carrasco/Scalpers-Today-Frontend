import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../common/Skeleton';
import { colors, borderRadius, spacing } from '@presentation/theme';

export function AlertCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

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
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },
  accentBar: {
    width: 5,
    backgroundColor: colors.border.default,
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
