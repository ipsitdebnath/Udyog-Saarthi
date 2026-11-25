import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import { Colors, Spacing } from '../../src/constants/Colors';

export default function DashboardTab() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Candidate Dashboard" subtitle="Udyog Saarthi" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.title}>Welcome back, Candidate!</Text>
          <Text style={styles.subtitle}>
            Your personalized dashboard is ready. (Detailed metrics wired in Commit 5).
          </Text>
        </Card>
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
  card: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5A6882',
  },
});
