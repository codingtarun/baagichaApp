/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — STORY TEXT COMPOSER
 * ═══════════════════════════════════════════════════════════════
 *
 * Create a text-only story with colored background.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../theme/colors';
import { Space, Radius } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';
import { createStory } from '../services/storyApi';

const BG_COLORS = [
  '#3A7D44', '#D97706', '#DC2626', '#7C3AED',
  '#0369A1', '#BE185D', '#1F2937', '#059669',
];

export default function StoryTextComposer(): React.JSX.Element {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState(BG_COLORS[0]);
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!text.trim()) {
      showToast('Please enter some text', 'warning');
      return;
    }
    setPosting(true);
    try {
      await createStory({
        type: 'text',
        body: text.trim(),
        visibility: 'followers',
      });
      showToast('Story posted!', 'success');
      navigation.goBack();
    } catch {
      showToast('Failed to post story', 'error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>Text Story</Typography>
        <TouchableOpacity
          style={[styles.postBtn, !text.trim() && styles.postBtnDisabled]}
          onPress={handlePost}
          disabled={!text.trim() || posting}
          activeOpacity={0.8}
        >
          {posting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Typography variant="caption" style={styles.postBtnText}>Post</Typography>
          )}
        </TouchableOpacity>
      </View>

      {/* Text Input */}
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={text}
          onChangeText={setText}
          multiline
          textAlign="center"
          autoFocus
          maxLength={500}
        />
      </View>

      {/* Color Picker */}
      <View style={styles.colorBar}>
        {BG_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.colorDot, { backgroundColor: c }, bgColor === c && styles.colorDotActive]}
            onPress={() => setBgColor(c)}
            activeOpacity={0.8}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[4],
    paddingVertical: 12,
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontWeight: '700', fontSize: 16, color: Colors.white },
  postBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { color: Colors.gray900, fontWeight: '700', fontSize: 13 },
  inputWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Space[6],
  },
  input: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
  },
  colorBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: Space[6],
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  colorDotActive: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
});
