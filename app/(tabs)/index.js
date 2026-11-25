import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../../src/constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import GreetingHeader from '../../src/components/dashboard/GreetingHeader';
import ProfileProgressCard from '../../src/components/dashboard/ProfileProgressCard';
import ApplicationProgressCard from '../../src/components/dashboard/ApplicationProgressCard';
import UpcomingDeadlinesCard from '../../src/components/dashboard/UpcomingDeadlinesCard';
import RecommendedJobsSection from '../../src/components/dashboard/RecommendedJobsSection';
import QuickActionShortcuts from '../../src/components/dashboard/QuickActionShortcuts';

export default function CandidateDashboard() {
  const router = useRouter();
  const theme = Colors.light;
  const { user, refreshUser } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } catch (e) {
      console.warn('Dashboard refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = () => {
    Alert.alert(
      'Notifications & Alerts',
      '1. NIEPMD: Admit Card for Junior Assistant exam is now downloadable.\n\n2. Job Coach Dr. Sundaram Rao sent feedback on your vocational profile.',
      [{ text: 'Close' }]
    );
  };

  const candidateName =
    user?.user_metadata?.full_name ||
    user?.full_name ||
    'Aarav';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2457A6']} />
        }
      >
        {/* Personalized Greeting & Notification Bar */}
        <GreetingHeader
          userName={candidateName}
          roleLabel="Candidate • 4% PwD Reservation Ecosystem"
          unreadNotifications={2}
          onNotificationPress={handleNotificationPress}
        />

        {/* Profile Strength & Completion Milestone */}
        <ProfileProgressCard
          percentage={65}
          missingSection="Functional Difficulties & Support Needs"
          onCompletePress={() => router.push('/profile/setup')}
        />

        {/* 6-Stage Employment Journey Tracker */}
        <ApplicationProgressCard />

        {/* Recommended Opportunities [Day 2 Preview] */}
        <RecommendedJobsSection
          onViewAllPress={() => router.push('/(tabs)/jobs')}
        />

        {/* Upcoming Recruitment Deadlines */}
        <UpcomingDeadlinesCard />

        {/* Saarthi Ecosystem Quick Shortcuts */}
        <QuickActionShortcuts />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
