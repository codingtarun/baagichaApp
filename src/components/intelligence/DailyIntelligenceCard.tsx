import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../theme/colors';
import IntelligenceItem from './IntelligenceItem';
import IntelligenceExpandedSheet from './IntelligenceExpandedSheet';

export default function DailyIntelligenceCard(): React.JSX.Element | null {
  const { user } = useAuthStore();
  const {
    todayCard,
    isLoading,
    expanded,
    dismissedUntil,
    fetchToday,
    expandCard,
    dismissCard,
  } = useIntelligenceStore();

  const animation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user) {
      fetchToday();
    }
  }, [user]);

  useEffect(() => {
    Animated.spring(animation, {
      toValue: expanded ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [expanded]);

  const isSnoozed = useCallback((): boolean => {
    if (!dismissedUntil) return false;
    return new Date(dismissedUntil) > new Date();
  }, [dismissedUntil]);

  if (!user) return null;
  if (isLoading && !todayCard) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }
  if (!todayCard || isSnoozed()) return null;

  const preferredLanguage = (user.preferred_language as 'en' | 'hi') ?? 'en';
  const summary = todayCard.summary[preferredLanguage] ?? todayCard.summary.en;
  const score = todayCard.priority_score;

  const iconColor =
    score >= 80 ? Colors.danger : score >= 60 ? Colors.sevHigh : score >= 40 ? Colors.warning : Colors.success;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={expandCard}
        style={styles.header}
        accessibilityRole="button"
        accessibilityLabel={summary}
      >
        <View style={styles.headerMain}>
          <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
            <Text style={styles.iconText}>{score >= 60 ? '!' : 'i'}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>
              {summary}
            </Text>
            <Text style={styles.meta}>
              {todayCard.total_items} recommendations • {new Date(todayCard.generated_at).toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <Text style={styles.toggle}>{expanded ? 'Hide' : 'View'}</Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.body,
          {
            maxHeight: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1200],
            }),
            opacity: animation,
          },
        ]}
      >
        <View style={styles.bodyInner}>
          {(Object.keys(todayCard.categories) as Array<keyof typeof todayCard.categories>).map((category) => {
            const items = todayCard.items.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <View key={category} style={styles.section}>
                <Text style={styles.sectionTitle}>{getCategoryLabel(category)}</Text>
                {items.map((item) => (
                  <IntelligenceItem key={item.id} item={item} language={preferredLanguage} />
                ))}
              </View>
            );
          })}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => dismissCard()}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => dismissCard(60)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Snooze 1h</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => dismissCard(1440)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Until tomorrow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <IntelligenceExpandedSheet />
    </View>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    do_now: 'Do Now',
    prepare: 'Prepare',
    routine: 'Routine',
    avoid_today: 'Avoid Today',
    insight: 'Insight',
  };
  return labels[category] ?? category;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray900,
  },
  meta: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  toggle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  body: {
    overflow: 'hidden',
  },
  bodyInner: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: Colors.gray500,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.gray700,
  },
});
