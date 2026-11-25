import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Edit3,
  LogOut,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
} from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import { Colors, Spacing, BorderRadius } from '../../src/constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import profileService from '../../src/services/profileService';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = Colors.light;
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data } = await profileService.getProfile();
      if (data) {
        setProfileData(data);
      }
    } catch (e) {
      console.warn('Failed to load profile tab:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of Udyog Saarthi?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  const cand = profileData?.candidateProfile || {};
  const dis = profileData?.disabilityProfile || {};

  const displayName =
    user?.user_metadata?.full_name ||
    user?.full_name ||
    'Aarav Sharma';

  const displayEmail = user?.email || 'aarav.candidate@example.gov.in';
  const displayPhone = user?.user_metadata?.phone || user?.phone || '9876543210';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Candidate Profile"
        subtitle="Saarthi Employment & Learning Record"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <User size={38} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userRole}>
            {user?.user_metadata?.role === 'parent' ? 'Parent / Guardian' : 'Job Seeker (4% Reservation Program)'}
          </Text>

          <View style={styles.contactRow}>
            <Mail size={14} color="#5A6882" />
            <Text style={styles.contactText}>{displayEmail}</Text>
          </View>

          <View style={styles.contactRow}>
            <Phone size={14} color="#5A6882" />
            <Text style={styles.contactText}>{displayPhone}</Text>
          </View>

          <Button
            title="Edit Full Profile"
            size="md"
            variant="primary"
            icon={<Edit3 size={18} color="#FFFFFF" />}
            onPress={() => router.push('/profile/setup')}
            accessibilityLabel="Edit candidate profile"
            style={styles.editBtn}
          />
        </Card>

        {loading ? (
          <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: 20 }} />
        ) : (
          <>
            {/* Education Summary */}
            <Text style={styles.sectionHeader}>Education & Qualifications</Text>
            <Card style={styles.sectionCard}>
              <View style={styles.itemRow}>
                <GraduationCap size={20} color={theme.primary} />
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Highest Qualification</Text>
                  <Text style={styles.itemValue}>{cand.education || '12th Pass (Higher Secondary)'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.itemRow}>
                <CheckCircle size={20} color={theme.secondary} />
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Literacy Level</Text>
                  <Text style={styles.itemValue}>
                    {cand.literacy_level || 'Fluent Reading & Writing in Hindi and English'}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Skills & Aspirations */}
            <Text style={styles.sectionHeader}>Skills & Employment Aspirations</Text>
            <Card style={styles.sectionCard}>
              <View style={styles.itemRow}>
                <Briefcase size={20} color={theme.primary} />
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Skills</Text>
                  <Text style={styles.itemValue}>
                    {cand.skills || 'Data Entry, Document Scanning, Digital Archiving'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.itemRow}>
                <MapPin size={20} color={theme.secondary} />
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Preferred Sector & Location</Text>
                  <Text style={styles.itemValue}>
                    {cand.preferred_sector || 'Government / Public Sector'} •{' '}
                    {cand.preferred_location || 'Delhi NCR'}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Disability & Support Profile */}
            <Text style={styles.sectionHeader}>Protected Accommodations & Support</Text>
            <Card style={styles.sectionCard}>
              <View style={styles.itemRow}>
                <ShieldCheck size={20} color="#D97706" />
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Disability Category & UDID</Text>
                  <Text style={styles.itemValue}>
                    {dis.disability_category || 'Autism Spectrum Disorder & Specific Learning Disability'}
                    {dis.udid_reference ? ` (UDID: ${dis.udid_reference})` : ''}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.itemRow}>
                <CheckCircle size={20} color="#D97706" />
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Assistive Devices & Scribe Needs</Text>
                  <Text style={styles.itemValue}>
                    {dis.assistive_devices || 'Noise-cancelling headphones, Screen reader'} •{' '}
                    {dis.human_assistance_requirements || 'Scribe and extra exam time'}
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}

        {/* Sign Out Button */}
        <Button
          title="Sign Out"
          size="md"
          variant="outline"
          icon={<LogOut size={18} color="#DC2626" />}
          textStyle={{ color: '#DC2626' }}
          style={{ borderColor: '#FCA5A5', marginTop: Spacing.md }}
          onPress={handleLogout}
          accessibilityLabel="Log out of application"
        />
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
    paddingBottom: Spacing.xl,
  },
  userCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    color: '#5A6882',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    color: '#5A6882',
  },
  editBtn: {
    width: '100%',
    marginTop: Spacing.md,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionCard: {
    marginBottom: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  itemTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    color: '#5A6882',
    fontWeight: '600',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    color: '#172033',
    fontWeight: '500',
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
});
