import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../common/Skeleton';
import { colors, borderRadius, spacing } from '@presentation/theme';

export function EventCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

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
