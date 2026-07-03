import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { chatHistory, chatSuggestions, type ChatMessage } from '@/src/data/mock';
import { colors, font, radius, spacing, type } from '@/src/theme/tokens';

const CANNED_RESPONSES: Record<string, string> = {
  'explain': 'Your latest report shows Hemoglobin at 14.2 g/dL (normal), but LDL is 148 mg/dL — above the 100 mg/dL target. HbA1c also drifted to 5.9%, which is pre-diabetic range. I\'d prioritise lowering LDL first.',
  'ldl': 'LDL climbed from 130 → 148 over three tests. Likely contributors from your questionnaire: sedentary weekdays and BMI of 27.4. A 30-min daily brisk walk plus reducing saturated fat can drop LDL 10–15% in 12 weeks.',
  'workout': 'Given your moderate diabetes risk and elevated LDL, I\'d suggest a 30-minute brisk walk this afternoon (Zone 2 heart rate: 108–128 bpm). Your Fitbit shows you\'re at 8,234 steps — a 20-minute walk gets you to 12k.',
  'food': 'For lower cholesterol: oats, barley, legumes, fatty fish (2×/week), almonds, and olive oil. Reduce ghee, red meat, and fried snacks. Your diet plan tab has a full 7-day version tailored to your profile.',
};

function pickResponse(text: string) {
  const t = text.toLowerCase();
  if (t.includes('explain') || t.includes('lab') || t.includes('result')) return CANNED_RESPONSES.explain;
  if (t.includes('ldl') || t.includes('cholesterol')) return t.includes('food') ? CANNED_RESPONSES.food : CANNED_RESPONSES.ldl;
  if (t.includes('workout') || t.includes('exercise')) return CANNED_RESPONSES.workout;
  if (t.includes('food') || t.includes('diet') || t.includes('eat')) return CANNED_RESPONSES.food;
  return 'I can help with your labs, wearable data, or personalised diet & workout suggestions. Try tapping one of the suggestion chips below to get started.';
}

export default function AskMeScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = (payload?: string) => {
    const body = (payload ?? text).trim();
    if (!body) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const userMsg: ChatMessage = { id: String(Date.now()), role: 'user', text: body };
    setMessages((m) => [...m, userMsg]);
    setText('');
    setTyping(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1), role: 'ai', text: pickResponse(body),
      };
      setMessages((m) => [...m, aiMsg]);
      setTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }, 900);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color={colors.onBrandPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Ask Me</Text>
            <Text style={styles.sub}>Your AI health companion</Text>
          </View>
          <Pressable testID="ask-refresh" hitSlop={12}>
            <Ionicons name="refresh-outline" size={20} color={colors.onSurfaceSecondary} />
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          testID="chat-scroll"
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[styles.bubbleRow, m.role === 'user' && { justifyContent: 'flex-end' }]}
            >
              {m.role === 'ai' && (
                <View style={styles.miniAvatar}>
                  <Ionicons name="leaf" size={12} color={colors.brand} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  m.role === 'user' ? styles.bubbleUser : styles.bubbleAi,
                ]}
              >
                <Text style={m.role === 'user' ? styles.textUser : styles.textAi}>{m.text}</Text>
              </View>
            </View>
          ))}
          {typing && (
            <View style={styles.bubbleRow}>
              <View style={styles.miniAvatar}>
                <Ionicons name="leaf" size={12} color={colors.brand} />
              </View>
              <View style={[styles.bubble, styles.bubbleAi, styles.typing]}>
                <View style={styles.dot} />
                <View style={[styles.dot, { opacity: 0.6 }]} />
                <View style={[styles.dot, { opacity: 0.35 }]} />
              </View>
            </View>
          )}

          {messages.length <= 1 && (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsLabel}>TRY ASKING</Text>
              {chatSuggestions.map((s, i) => (
                <Pressable
                  key={s}
                  testID={`suggestion-${i}`}
                  onPress={() => send(s)}
                  style={styles.suggestChip}
                >
                  <Text style={styles.suggestText}>{s}</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.brand} />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Composer */}
        <View style={styles.composerWrap}>
          <View style={styles.composer}>
            <TextInput
              testID="chat-input"
              value={text}
              onChangeText={setText}
              placeholder="Ask about your health..."
              placeholderTextColor={colors.onSurfaceSecondary}
              style={styles.input}
              multiline
              maxLength={500}
            />
            <Pressable
              testID="chat-send-button"
              onPress={() => send()}
              disabled={!text.trim()}
              style={[styles.sendBtn, !text.trim() && { opacity: 0.4 }]}
            >
              <Ionicons name="arrow-up" size={18} color={colors.onBrandPrimary} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  aiAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  sub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 1 },

  body: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  miniAvatar: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: radius.lg,
  },
  bubbleAi: {
    backgroundColor: colors.surfaceSecondary,
    borderTopLeftRadius: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  bubbleUser: {
    backgroundColor: colors.brand,
    borderTopRightRadius: 6,
  },
  textAi: { fontSize: type.base, color: colors.onSurface, lineHeight: 22 },
  textUser: { fontSize: type.base, color: colors.onBrandPrimary, lineHeight: 22, fontWeight: font.medium },
  typing: { flexDirection: 'row', gap: 5, paddingVertical: 14 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand },

  suggestions: { marginTop: spacing.lg, gap: spacing.sm },
  suggestionsLabel: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.bold, letterSpacing: 1.4, marginBottom: 4 },
  suggestChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
    borderWidth: 1, borderColor: colors.brandSecondary + '30',
  },
  suggestText: { fontSize: type.base, color: colors.onBrandTertiary, fontWeight: font.semibold, flex: 1 },

  composerWrap: {
    padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.divider,
    backgroundColor: colors.surface,
    marginBottom: 82,
  },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.lg,
    paddingLeft: spacing.md, paddingRight: 6, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  input: {
    flex: 1, fontSize: type.base, color: colors.onSurface,
    paddingVertical: 8, maxHeight: 120,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
});
