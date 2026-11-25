import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, Sparkles } from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import { Colors, Spacing } from '../../src/constants/Colors';

export default function AssistantScreen() {
  const theme = Colors.light;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Saarthi AI Assistant" subtitle="Notification Simplifier & Career Guide" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.bannerCard}>
          <Bot size={36} color={theme.primary} />
          <Text style={styles.bannerTitle}>Your Employment Saarthi</Text>
          <Text style={styles.bannerSubtitle}>
            Gemini-powered assistant ready to simplify complex government recruitment notices, explain reservations, and provide step-by-step guidance.
          </Text>
        </Card>

        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderHeading}>Backend AI Integration</Text>
          <Text style={styles.placeholderText}>
            Direct chat with Saarthi AI will be enabled through our secure Node.js Express backend proxy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  content: {
    padding: Spacing.md,
  },
  bannerCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginTop: 8,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#5A6882',
    textAlign: 'center',
    lineHeight: 20,
  },
  placeholderBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  placeholderHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2457A6',
    marginBottom: 6,
  },
  placeholderText: {
    fontSize: 13,
    color: '#5A6882',
    textAlign: 'center',
  },
});
