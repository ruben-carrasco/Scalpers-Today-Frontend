import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../common/Skeleton';
import { colors, borderRadius, spacing } from '@presentation/theme';

export function MarketOverviewSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={160} height={18} borderRadius={4} />
      <Skeleton width={100} height={14} borderRadius={4} style={{ marginTop: 8 }} />

      <View style={styles.statsRow}>
        <Skeleton width="45%" height={48} borderRadius={12} />
        <Skeleton width="45%" height={48} borderRadius={12} />
      </View>
      <View style={styles.statsRow}>
        <Skeleton width="45%" height={48} borderRadius={12} />
        <Skeleton width="45%" height={48} borderRadius={12} />
      </View>
    </View>
  );
}

export function ImpactGridSkeleton() {
  return (
    <View style={styles.impactGrid}>
      <Skeleton width="31%" height={80} borderRadius={16} />
      <Skeleton width="31%" height={80} borderRadius={16} />
      <Skeleton width="31%" height={80} borderRadius={16} />
    </View>
  );
}

export function NextEventSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={120} height={16} borderRadius={4} />
      <Skeleton width="80%" height={18} borderRadius={4} style={{ marginTop: 12 }} />
      <View style={styles.row}>
        <Skeleton width={60} height={14} borderRadius={4} />
        <Skeleton width={40} height={14} borderRadius={4} />
      </View>
    </View>
  );
}

export function BriefingSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={140} height={18} borderRadius={4} />
      <Skeleton width="100%" height={14} borderRadius={4} style={{ marginTop: 12 }} />
      <Skeleton width="90%" height={14} borderRadius={4} style={{ marginTop: 6 }} />
      <Skeleton width="75%" height={14} borderRadius={4} style={{ marginTop: 6 }} />

      <View style={[styles.row, { marginTop: 16 }]}>
        <Skeleton width={70} height={28} borderRadius={14} />
        <Skeleton width={50} height={28} borderRadius={14} />
        <Skeleton width={60} height={28} borderRadius={14} />
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <MarketOverviewSkeleton />
      <ImpactGridSkeleton />
      <NextEventSkeleton />
      <BriefingSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
