import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, Filter } from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import { Colors, Spacing } from '../../src/constants/Colors';

export default function JobsScreen() {
  const theme = Colors.light;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Opportunity Explorer" subtitle="Government & Inclusive Opportunities" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.bannerCard}>
          <Briefcase size={32} color={theme.primary} />
          <Text style={styles.bannerTitle}>Inclusive Job Discovery</Text>
          <Text style={styles.bannerSubtitle}>
            Government notifications simplified with 4% PwD reservation analysis and accessible application guidelines.
          </Text>
        </Card>

        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderHeading}>Coming in Day 2</Text>
          <Text style={styles.placeholderText}>
            Full AI-powered opportunity explorer, eligibility matcher, and Washington Group functional compatibility search.
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
