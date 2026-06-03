/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMMUNITY SEGMENT (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 *
 * Stripped-down social feed. Compact composer, 2 priority cards,
 * and a dense activity feed (10 posts max).
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import type { HomeNavigationProp } from '../../navigation/types';

// ── Mock Data ──

const PRIORITY_CARDS = [
  {
    id: 'p1',
    icon: 'help-circle',
    iconColor: Colors.primary,
    title: '"What spray for Green Tip?"',
    meta: '12 answers · 2h ago',
  },
  {
    id: 'p2',
    icon: 'chart-line',
    iconColor: Colors.accent,
    title: 'Shimla Mandi: Royal ₹85/kg',
    meta: '↑ 8% from yesterday',
  },
];

const FEED_POSTS = [
  {
    id: 'f1',
    name: 'Ramesh Kumar',
    avatar: 'https://i.pravatar.cc/150?u=1',
    time: '2h ago',
    text: '🌳 Just completed dormancy spray! All trees covered before the rain.',
    location: 'Kupwara, J&K',
    likes: 12,
    comments: 3,
  },
  {
    id: 'f2',
    name: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?u=2',
    time: '4h ago',
    text: 'Early bloom in my orchard. Is this normal for this time? 🌸',
    location: 'Shimla, HP',
    likes: 8,
    comments: 5,
    image: 'https://picsum.photos/200/150?random=1',
  },
  {
    id: 'f3',
    name: 'Ajay Thakur',
    avatar: 'https://i.pravatar.cc/150?u=3',
    time: '6h ago',
    text: 'Mancozeb rates have increased by 15% in Kullu market. Stock early!',
    location: 'Kullu, HP',
    likes: 24,
    comments: 7,
  },
  {
    id: 'f4',
    name: 'Sunita Devi',
    avatar: 'https://i.pravatar.cc/150?u=4',
    time: '8h ago',
    text: 'First time seeing woolly aphid this season. Any organic treatment suggestions?',
    location: 'Kinnaur, HP',
    likes: 15,
    comments: 9,
  },
  {
    id: 'f5',
    name: 'Mohan Verma',
    avatar: 'https://i.pravatar.cc/150?u=5',
    time: '10h ago',
    text: 'Harvest update: Royal Delicious looking good this year. Expected 20% higher yield.',
    location: 'Mandi, HP',
    likes: 31,
    comments: 12,
  },
];

export default function CommunitySegment(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const [composerText, setComposerText] = useState('');

  const goToCommunity = () => {
    // Navigate to full community screen if available
    // navigation.navigate('Community');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {/* Quick Composer */}
      <View style={styles.composer}>
        <View style={styles.avatar}>
          <Icon name="account" size={20} color={Colors.white} />
        </View>
        <TextInput
          style={styles.composerInput}
          placeholder="Ask the community / समुदाय से पूछें"
          placeholderTextColor={Colors.gray400}
          value={composerText}
          onChangeText={setComposerText}
          multiline={false}
        />
        <TouchableOpacity style={styles.composerAction}>
          <Icon name="camera" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Priority Cards */}
      <View style={styles.priorityList}>
        {PRIORITY_CARDS.map((card) => (
          <TouchableOpacity key={card.id} style={styles.priorityCard} activeOpacity={0.7}>
            <View style={[styles.priorityIconWrap, { backgroundColor: card.iconColor + '12' }]}>
              <Icon name={card.icon as any} size={18} color={card.iconColor} />
            </View>
            <View style={styles.priorityBody}>
              <Typography variant="bodySmall" style={styles.priorityTitle} numberOfLines={1}>
                {card.title}
              </Typography>
              <Typography variant="captionMuted">{card.meta}</Typography>
            </View>
            <Icon name="chevron-right" size={18} color={Colors.gray300} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Compact Feed */}
      <View style={styles.feed}>
        {FEED_POSTS.map((post) => (
          <View key={post.id} style={styles.postRow}>
            <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
            <View style={styles.postBody}>
              <View style={styles.postHeader}>
                <Typography variant="bodySmall" style={styles.postName}>{post.name}</Typography>
                <Typography variant="captionMuted">{post.time}</Typography>
              </View>
              <Typography variant="bodySmall" style={styles.postText} numberOfLines={2}>
                {post.text}
              </Typography>
              {post.image && (
                <Image source={{ uri: post.image }} style={styles.postThumb} />
              )}
              <View style={styles.postMeta}>
                <Typography variant="captionMuted">
                  <Icon name="map-marker" size={10} color={Colors.gray400} /> {post.location}
                </Typography>
                <View style={styles.postActions}>
                  <Typography variant="captionMuted">👍 {post.likes}</Typography>
                  <Typography variant="captionMuted">💬 {post.comments}</Typography>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* View All */}
      <TouchableOpacity style={styles.viewAllRow} onPress={goToCommunity}>
        <Typography variant="link" style={styles.viewAllText}>View Full Community →</Typography>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingBottom: 120,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.gray900,
    fontFamily: 'DMSans-Regular',
    paddingVertical: 0,
  },
  composerAction: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityList: {
    marginTop: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  priorityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 10,
  },
  priorityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityBody: {
    flex: 1,
  },
  priorityTitle: {
    fontWeight: '700',
    color: Colors.gray900,
  },
  feed: {
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 10,
  },
  postRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 10,
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  postBody: {
    flex: 1,
    gap: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postName: {
    fontWeight: '700',
    color: Colors.gray900,
  },
  postText: {
    color: Colors.gray700,
    lineHeight: 18,
  },
  postThumb: {
    width: 60,
    height: 44,
    borderRadius: 6,
    marginTop: 4,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  postActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewAllRow: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 13,
  },
});
