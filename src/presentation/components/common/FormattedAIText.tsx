import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface FormattedAITextProps {
  text: string;
}

function preprocess(raw: string): string {
  let t = raw;

  t = t.replace(/\.?\s*(ESCENARIO\s*\d)/gi, '\n$1');
  t = t.replace(/\.?\s*(GESTIÓN\s*:)/gi, '\n$1');
  t = t.replace(/[.;]\s*([A-Z]{2,6}\/[A-Z]{2,6}\s*\|)/g, '\n$1');
  t = t.replace(/\.\s+(\d+[.)]\s)/g, '.\n$1');

  return t.trim();
}

export function FormattedAIText({ text }: FormattedAITextProps) {
  const processed = preprocess(text);
  const lines = processed.split('\n').filter(l => l.trim().length > 0);

  return (
    <View style={styles.container}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        return <LineBlock key={i} text={trimmed} />;
      })}
    </View>
  );
}

function LineBlock({ text }: { text: string }) {
  const scenarioMatch = text.match(/^(ESCENARIO\s*\d+[^:]*):?\s*(.*)/i);
  if (scenarioMatch) {
    return (
      <View style={styles.scenarioBlock}>
        <Text style={styles.scenarioLabel}>{scenarioMatch[1]}</Text>
        {scenarioMatch[2] ? <Text style={styles.body}>{scenarioMatch[2]}</Text> : null}
      </View>
    );
  }

  const gestionMatch = text.match(/^(GESTIÓN)\s*:\s*(.*)/i);
  if (gestionMatch) {
    return (
      <View style={styles.kvBlock}>
        <Text style={styles.kvKey}>{gestionMatch[1]}</Text>
        <Text style={styles.body}>{gestionMatch[2]}</Text>
      </View>
    );
  }

  if (text.includes('|')) {
    const parts = text.split('|').map(p => p.trim()).filter(Boolean);
    return (
      <View style={styles.levelsCard}>
        {parts.map((part, j) => {
          const kv = part.match(/^([^:]+):\s*(.*)/);
          if (kv) {
            return (
              <View key={j} style={styles.levelRow}>
                <Text style={styles.levelKey}>{kv[1].trim()}</Text>
                <Text style={styles.levelVal}>{kv[2].trim()}</Text>
              </View>
            );
          }
          return <Text key={j} style={styles.levelAsset}>{part}</Text>;
        })}
      </View>
    );
  }

  const bulletMatch = text.match(/^[-•*]\s+(.*)/);
  if (bulletMatch) {
    return (
      <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>{'\u2022'}</Text>
        <Text style={styles.body}>{bulletMatch[1]}</Text>
      </View>
    );
  }

  const numMatch = text.match(/^(\d+)[.)]\s+(.*)/);
  if (numMatch) {
    return (
      <View style={styles.bulletRow}>
        <View style={styles.numBadge}>
          <Text style={styles.numText}>{numMatch[1]}</Text>
        </View>
        <Text style={styles.body}>{numMatch[2]}</Text>
      </View>
    );
  }

  return <Text style={styles.body}>{text}</Text>;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  body: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: 19,
    flexShrink: 1,
  },

  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingLeft: 2,
  },
  bulletDot: {
    fontSize: typography.size.base,
    color: colors.brand.accentLight,
    lineHeight: 19,
  },
  numBadge: {
    width: 18, height: 18, borderRadius: 4,
    backgroundColor: colors.brand.primary + '1A',
    justifyContent: 'center', alignItems: 'center',
  },
  numText: {
    fontSize: 10,
    fontWeight: typography.weight.bold,
    color: colors.brand.primaryLight,
  },

  scenarioBlock: {
    paddingLeft: spacing.sm + 2,
    borderLeftWidth: 2,
    borderLeftColor: colors.brand.accent + '50',
    gap: spacing.xs,
  },
  scenarioLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.brand.accentLight,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  kvBlock: {
    gap: spacing.xs,
  },
  kvKey: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  levelsCard: {
    backgroundColor: colors.bg.primary + '80',
    borderRadius: borderRadius.sm,
    padding: spacing.sm + 2,
    gap: 0,
  },
  levelAsset: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.brand.primaryLight,
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  levelRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.subtle + '60',
  },
  levelKey: {
    fontSize: typography.size.xs,
    color: colors.text.dim,
    fontWeight: typography.weight.bold,
    width: 90,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  levelVal: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    flex: 1,
  },
});
