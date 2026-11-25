import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, FileText, Settings, ShieldCheck, ChevronRight } from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import { Colors, Spacing, BorderRadius } from '../../src/constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = Colors.light;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Candidate Profile" subtitle="Saarthi Employment & Learning Profile" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <User size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>Candidate Profile</Text>
          <Text style={styles.userRole}>Job Seeker (4% Reservation Program)</Text>
          <Text style={styles.userStatus}>Status: Profile Incomplete (40%)</Text>

          <Button
            title="Update Employment Profile"
            size="md"
            variant="primary"
            onPress={() => router.push('/profile/setup')}
            accessibilityLabel="Edit and complete candidate profile"
            style={styles.setupBtn}
          />
        </Card>

        {/* Profile Sections Quick Links */}
        <Text style={styles.sectionHeader}>Profile Information</Text>

        <Card onPress={() => router.push('/profile/setup')} style={styles.menuCard}>
          <View style={styles.menuRow}>
            <View style={[styles.menuIcon, { backgroundColor: '#E8F0FE' }]}>
              <User size={20} color="#2457A6" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Personal & Contact Details</Text>
              <Text style={styles.menuSub}>Name, DOB, address, and guardian contact</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </View>
        </Card>

        <Card onPress={() => router.push('/profile/setup')} style={styles.menuCard}>
          <View style={styles.menuRow}>
            <View style={[styles.menuIcon, { backgroundColor: '#E0F2F1' }]}>
              <FileText size={20} color="#168C83" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Education & Skills</Text>
              <Text style={styles.menuSub}>Qualifications, literacy, and vocational training</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </View>
        </Card>

        <Card onPress={() => router.push('/profile/setup')} style={styles.menuCard}>
          <View style={styles.menuRow}>
            <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
              <ShieldCheck size={20} color="#D97706" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Support Requirements & UDID</Text>
              <Text style={styles.menuSub}>Washington Group difficulties & accommodations</Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </View>
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
  userCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2457A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    color: '#5A6882',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  setupBtn: {
    width: '100%',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
    marginBottom: Spacing.sm,
  },
  menuCard: {
    marginBottom: Spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#172033',
    marginBottom: 2,
  },
  menuSub: {
    fontSize: 12,
    color: '#64748B',
  },
});
