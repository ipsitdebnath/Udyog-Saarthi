import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import { Colors, Spacing } from '../../src/constants/Colors';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const theme = Colors.light;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Profile Setup"
        subtitle="Complete your employment details"
        showBack={true}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.title}>Candidate Profile Flow</Text>
          <Text style={styles.sub}>
            Multi-section profile with Washington Group functional assessment, education, and job preferences.
            (Detailed form fully wired in Commit 6).
          </Text>
          <Button
            title="Return to Dashboard"
            variant="outline"
            onPress={() => router.replace('/(tabs)')}
            style={{ marginTop: 16 }}
          />
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
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#5A6882',
    textAlign: 'center',
    lineHeight: 20,
  },
});
