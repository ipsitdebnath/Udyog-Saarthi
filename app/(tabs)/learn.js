import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Award } from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import { Colors, Spacing } from '../../src/constants/Colors';

export default function LearnScreen() {
  const theme = Colors.light;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Saarthi Learning" subtitle="Exam Prep & Skill Development" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.bannerCard}>
          <BookOpen size={32} color={theme.secondary} />
          <Text style={styles.bannerTitle}>Accessible Learning Center</Text>
          <Text style={styles.bannerSubtitle}>
            Practice papers, competitive exam modules, and skill building designed specifically for candidates with diverse abilities.
          </Text>
        </Card>

        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderHeading}>Learning Modules (Day 3 & 4)</Text>
          <Text style={styles.placeholderText}>
            Interactive mock tests, multi-modal study materials, and job-coaching progress tracking will be unlocked here.
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
    color: '#168C83',
    marginBottom: 6,
  },
  placeholderText: {
    fontSize: 13,
    color: '#5A6882',
    textAlign: 'center',
  },
});
