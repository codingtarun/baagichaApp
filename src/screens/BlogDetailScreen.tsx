/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — BLOG DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Full article view with hero, body content, tags, and related articles.
 * Fetches from: GET /api/v1/blog/{slug}
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import { useBlogDetail } from '../hooks/useBlogDetail';
import type { DiscoverNavigationProp, BlogDetailRouteProp } from '../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_W } = Dimensions.get('window');

export default function BlogDetailScreen(): React.JSX.Element {
  const route = useRoute<BlogDetailRouteProp>();
  const navigation = useNavigation<DiscoverNavigationProp>();
  const { slug } = route.params;

  const { post, loading, error, refresh } = useBlogDetail(slug);
  const [hindiMode, setHindiMode] = useState(false);

  if (loading && !post) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Typography variant="bodyMuted" style={styles.loadingText}>
          Loading article...
        </Typography>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <Icon name="alert-circle" size={40} color={Colors.danger} />
        <Typography variant="body" color={Colors.danger} style={styles.errorText}>
          {error ?? 'Article not found'}
        </Typography>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryBtn}>
          <Typography variant="bodySmall" color={Colors.primary}>
            Go Back
          </Typography>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const bodyText = hindiMode && post.body_hi ? post.body_hi : post.body_en;
  const titleText = hindiMode && post.title_hi ? post.title_hi : post.title_en;
  const excerptText = hindiMode && post.excerpt_hi ? post.excerpt_hi : post.excerpt_en;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!post} onRefresh={refresh} colors={[Colors.primary]} />}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {post.featured_image ? (
            <Image source={{ uri: post.featured_image }} style={styles.heroImg} />
          ) : (
            <View style={[styles.heroPlaceholder, { backgroundColor: Colors.gray100 }]}>
              <Icon name="newspaper" size={48} color={Colors.gray400} />
            </View>
          )}
          <View style={styles.heroOverlay} />
          {post.category && (
            <View style={[styles.catBadge, { backgroundColor: post.category.color }]}>
              <Typography variant="badgeText" color={Colors.white} style={styles.catBadgeText}>
                {post.category.name_en}
              </Typography>
            </View>
          )}
        </View>

        {/* ── Meta Row ── */}
        <View style={styles.metaRow}>
          <View style={styles.authorChip}>
            <View style={styles.authorAvatar}>
              <Icon name="account" size={14} color={Colors.white} />
            </View>
            <View>
              <Typography variant="bodySmall" color={Colors.gray800} style={{ fontWeight: '600' }}>
                {post.author.name}
              </Typography>
              <Typography variant="metaText" color={Colors.gray400}>
                {post.author.role}
              </Typography>
            </View>
          </View>
          <View style={styles.metaPills}>
            <View style={styles.metaPill}>
              <Icon name="clock-outline" size={10} color={Colors.gray400} />
              <Typography variant="metaText" color={Colors.gray500}>
                {post.reading_time_min} min
              </Typography>
            </View>
            <View style={styles.metaPill}>
              <Icon name="eye" size={10} color={Colors.gray400} />
              <Typography variant="metaText" color={Colors.gray500}>
                {post.view_count.toLocaleString()}
              </Typography>
            </View>
          </View>
        </View>

        {/* ── Title ── */}
        <View style={styles.identity}>
          <Typography variant="displayHeading" style={styles.title}>
            {titleText}
          </Typography>
          {post.title_hi && (
            <TouchableOpacity
              style={styles.hindiToggle}
              onPress={() => setHindiMode((p) => !p)}
              activeOpacity={0.7}
            >
              <Icon name="translate" size={12} color={Colors.primary} />
              <Typography variant="badgeText" color={Colors.primary}>
                {hindiMode ? 'English' : 'हिंदी'}
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Excerpt ── */}
        {excerptText && (
          <View style={styles.excerptBox}>
            <Typography variant="body" color={Colors.gray600} style={styles.excerptText}>
              {stripHtml(excerptText)}
            </Typography>
          </View>
        )}

        {/* ── Body ── */}
        {bodyText && (
          <View style={styles.bodySection}>
            <BodyContent html={bodyText} />
          </View>
        )}

        {/* ── Gallery ── */}
        {post.gallery?.length > 0 && (
          <View style={styles.section}>
            <Typography variant="sectionHeader" style={styles.sectionTitle}>
              Gallery
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
              {post.gallery.map((img: any, i: number) => (
                <Image key={i} source={{ uri: img.thumb }} style={styles.galleryThumb} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Tags ── */}
        {post.tags?.length > 0 && (
          <View style={styles.section}>
            <Typography variant="sectionHeader" style={styles.sectionTitle}>
              Tags
            </Typography>
            <View style={styles.tagsRow}>
              {post.tags.map((tag: any) => (
                <View key={tag.slug} style={styles.tagChip}>
                  <Icon name="tag" size={10} color={Colors.primary} />
                  <Typography variant="badgeText" color={Colors.gray600} style={{ marginLeft: 4 }}>
                    {tag.name_en}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Related Articles ── */}
        {post.related.length > 0 && (
          <View style={styles.section}>
            <Typography variant="sectionHeader" style={styles.sectionTitle}>
              Related Articles
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
              {post.related.map((rel) => (
                <TouchableOpacity
                  key={rel.slug}
                  style={styles.relatedCard}
                  onPress={() => navigation.navigate('BlogDetail', { slug: rel.slug })}
                  activeOpacity={0.7}
                >
                  <View style={styles.relatedThumb}>
                    {rel.category && (
                      <View style={[styles.relatedCat, { backgroundColor: rel.category.color }]}>
                        <Typography variant="overline" color={Colors.white} style={{ fontSize: 8 }}>
                          {rel.category.name_en}
                        </Typography>
                      </View>
                    )}
                  </View>
                  <View style={styles.relatedBody}>
                    <Typography variant="cardTitle" lines={2} style={{ fontSize: 12, lineHeight: 16 }}>
                      {rel.title_en}
                    </Typography>
                    <Typography variant="metaText" color={Colors.gray400}>
                      {rel.reading_time_min} min read
                    </Typography>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.safeBottom} />
      </ScrollView>

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <View style={styles.backBtnBg}>
          <Icon name="arrow-left" size={20} color={Colors.white} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ── HTML Helpers ──

/**
 * Strip HTML tags and convert block elements to readable line breaks.
 * Decodes common HTML entities.
 */
function stripHtml(html: string): string {
  if (!html) return '';
  let text = html
    // Convert block elements to newlines
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    // Remove all remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode common entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    // Collapse multiple newlines to max 2
    .replace(/\n{3,}/g, '\n\n')
    // Trim
    .trim();
  return text;
}

/**
 * Render HTML body content as formatted text blocks.
 * Splits by paragraphs and preserves headings as bold text.
 */
function BodyContent({ html }: { html: string }) {
  if (!html) return null;

  // Extract text blocks: split by paragraphs, divs, or heading closings
  const blocks = html
    .split(/<\/(?:p|div|h[1-6])>/i)
    .map((block) => stripHtml(block))
    .filter((block) => block.length > 0);

  return (
    <View style={{ gap: 12 }}>
      {blocks.map((block, i) => (
        <Typography key={i} variant="body" color={Colors.gray800} style={styles.bodyText}>
          {block}
        </Typography>
      ))}
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  centered: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 16 },
  errorText: { marginTop: 12, textAlign: 'center' },
  retryBtn: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.gray100, borderRadius: 8 },

  // Hero
  hero: { position: 'relative', width: SCREEN_W, height: 200, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },
  heroPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
  catBadge: { position: 'absolute', bottom: 12, left: 14, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  catBadgeText: { fontSize: 11, fontWeight: '700' },

  // Meta row
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  authorChip: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  authorAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  metaPills: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: Colors.gray50, borderRadius: 12, borderWidth: 1, borderColor: Colors.gray200 },

  // Identity
  identity: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 },
  title: { fontSize: 22, lineHeight: 28 },
  hindiToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: Colors.gray50, borderRadius: 12, borderWidth: 1, borderColor: Colors.gray200 },

  // Excerpt
  excerptBox: { marginHorizontal: 16, marginTop: 12, padding: 14, backgroundColor: Colors.gray50, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: Colors.info },
  excerptText: { fontStyle: 'italic', lineHeight: 22 },

  // Body
  bodySection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  bodyText: { lineHeight: 24, fontSize: 15 },

  // Section
  section: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle: { marginBottom: 12 },

  // Gallery
  galleryScroll: { gap: 8, paddingBottom: 8 },
  galleryThumb: { width: 120, height: 80, borderRadius: 10, borderWidth: 2, borderColor: Colors.gray100 },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: Colors.gray50, borderRadius: 20, borderWidth: 1, borderColor: Colors.gray200 },

  // Related
  relatedScroll: { gap: 12, paddingBottom: 8 },
  relatedCard: { width: 180, backgroundColor: Colors.gray50, borderRadius: 14, padding: 10, borderWidth: 1, borderColor: Colors.gray200, overflow: 'hidden' },
  relatedThumb: { width: '100%', height: 90, borderRadius: 10, backgroundColor: Colors.gray100, marginBottom: 8, position: 'relative' },
  relatedCat: { position: 'absolute', top: 6, left: 6, borderRadius: 6, paddingVertical: 2, paddingHorizontal: 6 },
  relatedBody: { gap: 4 },

  // Safe bottom
  safeBottom: { height: 100 },

  // Back button
  backBtn: { position: 'absolute', top: 12, left: 12, zIndex: 10 },
  backBtnBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
});
