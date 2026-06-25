import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import type { IntelligenceItem as IntelligenceItemType } from '../../services/intelligenceApi';

interface Props {
  item: IntelligenceItemType;
  language: 'en' | 'hi';
}

export default function IntelligenceItem({ item, language }: Props): React.JSX.Element {
  const { markItemDone } = useIntelligenceStore();

  const title = item.content[`title_${language}`] ?? item.content.title_en;
  const reason = item.content[`reason_${language}`] ?? item.content.reason_en;
  const cta = item.content.cta[language] ?? item.content.cta.en;
  const safety = item.content.safety_notes[language] ?? item.content.safety_notes.en;

  const score = item.priority_score;
  const borderColor =
    score >= 80 ? Colors.danger : score >= 60 ? Colors.sevHigh : score >= 40 ? Colors.warning : Colors.success;

  const isDone = item.user_action === 'done';

  return (
    <View style={[styles.container, { borderLeftColor: borderColor }, isDone && styles.doneContainer]}>
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={[styles.title, isDone && styles.doneText]}>{title}</Text>
          {reason ? <Text style={styles.reason}>{reason}</Text> : null}

          {item.trigger_factors.length > 0 ? (
            <View style={styles.factors}>
              {item.trigger_factors.map((factor, index) => (
                <View key={index} style={styles.factorBadge}>
                  <Text style={styles.factorText}>
                    {factor.label}: {String(factor.value)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {safety ? <Text style={styles.safety}>🛡 {safety}</Text> : null}
        </View>

        <View style={styles.actions}>
          <Text style={styles.score}>{score}</Text>
          {!isDone && item.action_type !== 'avoid_spray' && item.action_type !== 'note' ? (
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => markItemDone(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.ctaText}>{cta}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray50,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  doneContainer: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray900,
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
  reason: {
    fontSize: 12,
    color: Colors.gray600,
    marginTop: 4,
  },
  factors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  factorBadge: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  factorText: {
    fontSize: 10,
    color: Colors.gray600,
  },
  safety: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 8,
  },
  actions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  score: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray700,
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.white,
  },
});
