/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — CARD DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Generic detail view for priority cards tapped from HomeScreen.
 * Shows full info for weather alerts, notifications, work items,
 * and weekly recommendations.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { Typography, PrimaryHeading } from '../typography';
import type { HomeStackParamList } from '../navigation/stacks/HomeStack';

type CardDetailRouteProp = RouteProp<HomeStackParamList, 'CardDetail'>;
type CardDetailNavProp = NativeStackNavigationProp<HomeStackParamList>;

const PRIORITY_META: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  critical: { color: Colors.danger, bg: Colors.danger + '12', icon: 'alert-octagon', label: 'CRITICAL / गंभीर' },
  high:     { color: Colors.warning, bg: Colors.warning + '12', icon: 'alert-circle', label: 'HIGH / उच्च' },
  medium:   { color: Colors.accent, bg: Colors.accent + '15', icon: 'information', label: 'MEDIUM / मध्यम' },
  low:      { color: Colors.success, bg: Colors.success + '12', icon: 'check-circle', label: 'LOW / कम' },
};

const TYPE_META: Record<string, { icon: string; label: string }> = {
  weather_alert:          { icon: 'weather-lightning-rainy', label: 'Weather Alert' },
  notification:           { icon: 'bell-ring', label: 'Notification' },
  work:                   { icon: 'spray', label: 'Work to Do' },
  weekly_recommendation:  { icon: 'calendar-check', label: 'Weekly Recommendation' },
};

export default function CardDetailScreen(): React.JSX.Element {
  const navigation = useNavigation<CardDetailNavProp>();
  const { params } = useRoute<CardDetailRouteProp>();
  const card = params?.card;

  if (!card) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <Icon name="alert-circle" size={40} color={Colors.danger} />
        <Typography variant="body" color={Colors.danger} style={{ marginTop: 12 }}>
          Card not found
        </Typography>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Typography variant="bodySmall" color={Colors.primary}>Go Back</Typography>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const priorityMeta = PRIORITY_META[card.priority] ?? PRIORITY_META.medium;
  const typeMeta = TYPE_META[card.type] ?? { icon: 'information', label: 'Alert' };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon} activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>Details / विवरण</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Priority Badge */}
        <View style={[styles.priorityBadge, { backgroundColor: priorityMeta.bg }]}>
          <Icon name={priorityMeta.icon} size={16} color={priorityMeta.color} />
          <Typography variant="caption" style={[styles.priorityText, { color: priorityMeta.color }]}>
            {priorityMeta.label}
          </Typography>
        </View>

        {/* Type Badge */}
        <View style={styles.typeBadge}>
          <Icon name={typeMeta.icon} size={14} color={Colors.primary} />
          <Typography variant="caption" style={styles.typeText}>{typeMeta.label}</Typography>
        </View>

        {/* Title */}
        <PrimaryHeading style={styles.title}>{card.title}</PrimaryHeading>
        {card.titleHi && (
          <Typography variant="hindiMeta" style={styles.titleHi}>{card.titleHi}</Typography>
        )}

        {/* Description */}
        <View style={styles.descCard}>
          <Typography variant="body" style={styles.descText}>{card.description}</Typography>
          {card.descriptionHi && (
            <Typography variant="hindiMeta" style={styles.descHi}>{card.descriptionHi}</Typography>
          )}
        </View>

        {/* Extra fields */}
        {card.extraInfo?.map((info, idx) => (
          <View key={idx} style={styles.infoRow}>
            <Icon name={info.icon} size={18} color={Colors.gray500} />
            <View style={styles.infoTextWrap}>
              <Typography variant="captionMuted">{info.label}</Typography>
              <Typography variant="body" style={styles.infoValue}>{info.value}</Typography>
            </View>
          </View>
        ))}

        {/* Action CTA */}
        {card.ctaText && (
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.8}>
            <Typography variant="button" style={styles.ctaText}>{card.ctaText}</Typography>
            <Icon name="arrow-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        )}

        {/* Timestamp */}
        {card.timestamp && (
          <Typography variant="captionMuted" style={styles.timestamp}>
            {card.timestamp}
          </Typography>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  centered: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  backBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.gray100, borderRadius: 8 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '700', fontSize: 16, color: Colors.gray800 },

  scrollContent: { padding: 16, paddingBottom: 40 },

  priorityBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 10,
  },
  priorityText: { fontWeight: '700', fontSize: 12 },

  typeBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    backgroundColor: Colors.primary + '10', marginBottom: 16,
  },
  typeText: { color: Colors.primary, fontWeight: '600', fontSize: 12 },

  title: { fontSize: 24, color: Colors.gray800, marginBottom: 4 },
  titleHi: { fontSize: 16, color: Colors.gray500, marginBottom: 20 },

  descCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    shadowColor: Colors.gray400, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, marginBottom: 16,
  },
  descText: { fontSize: 15, lineHeight: 22, color: Colors.gray700 },
  descHi: { fontSize: 14, lineHeight: 20, color: Colors.gray500, marginTop: 8 },

  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.gray200,
  },
  infoTextWrap: { flex: 1 },
  infoValue: { fontWeight: '600', color: Colors.gray800, marginTop: 2 },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, marginTop: 8,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 4,
  },
  ctaText: { color: Colors.white, fontSize: 16, fontWeight: '700' },

  timestamp: { textAlign: 'center', marginTop: 16 },
});
