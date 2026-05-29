/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — VARIETY CARD (Reusable)
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Extracted into its own file so it can be reused in
 * multiple places: the Variety list grid AND the "Related
 * varieties" horizontal scroll on the detail page.
 *
 * Props are optional so the same component works in both
 * contexts without forcing unused features.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';

// ── Types ──

export interface VarietyCardData {
  id: number;
  slug: string;
  name_en: string;
  name_hi: string | null;
  season_type: string;
  season_label: string;
  season_color: string;
  altitude: string;
  hero_image: string | null;
}

interface VarietyCardProps {
  item: VarietyCardData;
  onPress: () => void;
  /** Show orchard ownership indicator (top-right). */
  inOrchard?: boolean;
  onToggleOrchard?: () => void;
  /** Show compare selection state. */
  compareMode?: boolean;
  isSelected?: boolean;
  /** Override card container style (e.g., fixed width in horizontal scroll). */
  style?: any;
}

// ── Component ──

export default function VarietyCard({
  item,
  onPress,
  inOrchard = false,
  onToggleOrchard,
  compareMode = false,
  isSelected = false,
  style,
}: VarietyCardProps): React.JSX.Element {
  return (
    <View style={[styles.cardShadow, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.cardInner,
          compareMode && isSelected && styles.cardSelected,
        ]}
      >
      {/* Orchard button (optional) */}
      {onToggleOrchard && (
        <TouchableOpacity
          onPress={onToggleOrchard}
          activeOpacity={0.7}
          style={[styles.orchardBtn, inOrchard && styles.orchardBtnActive]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon
            name="sprout"
            size={13}
            color={inOrchard ? Colors.white : Colors.gray400}
          />
        </TouchableOpacity>
      )}

      {/* Compare selection circle (only in compare mode) */}
      {compareMode && (
        <View style={[styles.selectCircle, isSelected && styles.selectCircleActive]}>
          {isSelected && <Icon name="check" size={13} color={Colors.white} />}
        </View>
      )}

      {/* Thumbnail */}
      {item.hero_image ? (
        <Image source={{ uri: item.hero_image }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumbPlaceholder, { backgroundColor: `${item.season_color}18` }]}>
          <Icon name="apple" size={28} color={item.season_color} />
        </View>
      )}

      {/* Season tag */}
      <View style={[styles.seasonTag, { backgroundColor: `${item.season_color}18` }]}>
        <Typography variant="badgeText" color={item.season_color}>
          {item.season_label}
        </Typography>
      </View>

      {/* Names */}
      <Typography variant="cardTitle" lines={1} style={styles.name}>
        {item.name_en}
      </Typography>
      {item.name_hi ? (
        <Typography variant="hindiMeta" color={Colors.gray400} lines={1}>
          {item.name_hi}
        </Typography>
      ) : null}

      {/* Altitude */}
      <View style={styles.altitudeRow}>
        <Icon name="terrain" size={10} color={Colors.gray400} />
        <Typography variant="metaText" color={Colors.gray400} style={styles.altitudeText}>
          {item.altitude}
        </Typography>
      </View>
    </TouchableOpacity>
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  cardShadow: {
    flex: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInner: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: `${Colors.primary}08`,
  },

  // Orchard button (top-right, small)
  orchardBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  orchardBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Compare selection circle (top-left)
  selectCircle: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  selectCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Thumbnail
  thumb: {
    width: '100%',
    height: 90,
    borderRadius: 14,
    marginBottom: 6,
  },
  thumbPlaceholder: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  // Card body
  seasonTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  name: {
    marginBottom: 1,
  },
  altitudeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  altitudeText: {
    marginLeft: 4,
  },
});
