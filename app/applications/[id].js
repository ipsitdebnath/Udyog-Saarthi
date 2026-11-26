import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileCheck,
  Building,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  Briefcase,
  ChevronRight,
} from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import SectorBadge from '../../src/components/jobs/SectorBadge';
import { useAccessibility } from '../../src/context/AccessibilityContext';
import applicationService from '../../src/services/applicationService';
import { Colors, BorderRadius, Spacing } from '../../src/constants/Colors';

const STAGES = [
  { key: 'applied', label: 'Applied' },
  { key: 'examination', label: 'Examination' },
  { key: 'interview', label: 'Interview' },
  { key: 'selected', label: 'Selected / Placed' },
];

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fontScale, highContrast, soundAssistance, speak } = useAccessibility();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Editable fields
  const [currentStatus, setCurrentStatus] = useState('applied');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchApp = async () => {
      try {
        setLoading(true);
        const res = await applicationService.getApplicationById(id);
        if (isMounted) {
          if (res.success && res.data) {
            setApplication(res.data);
            setCurrentStatus(res.data.status || 'applied');
            setNotes(res.data.notes || '');
          } else {
            setError(res.error || 'Application not found');
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Error loading application');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (id) fetchApp();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSaveUpdates = async () => {
    try {
      setSaving(true);
      const res = await applicationService.updateApplication(id, {
        status: currentStatus,
        notes: notes.trim(),
      });

      if (res.success && res.data) {
        setApplication(res.data);
        if (soundAssistance) {
          speak(`Application status updated to ${currentStatus}`);
        }
        Alert.alert('Success', 'Application status and notes updated successfully.');
      } else {
        Alert.alert('Update Error', res.error || 'Failed to update application');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenJob = () => {
    if (application?.job_id) {
      router.push(`/jobs/${application.job_id}`);
    }
  };

  const handleOpenPortal = async () => {
    const url = application?.job?.official_application_url;
    if (!url) {
      Alert.alert('Portal Link', 'Official portal link not available for this record.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${url}`);
      }
    } catch (err) {
      Alert.alert('Navigation Error', err.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <Header title="Application Details" showBack onBack={() => router.back()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading application timeline...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !application) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <Header title="Application Details" showBack onBack={() => router.back()} />
        <View style={styles.centerContainer}>
          <AlertCircle size={44} color="#DC2626" />
          <Text style={styles.errorTitle}>Application Not Found</Text>
          <Text style={styles.errorSub}>{error || 'The requested application record could not be loaded.'}</Text>
          <Button
            title="Back to Tracker"
            variant="outline"
            size="md"
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const job = application.job || {};

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        title="Application Details"
        subtitle={job.organization || 'Government / Inclusive Job'}
        showBack
        onBack={() => router.back()}
        highContrast={highContrast}
        fontScale={fontScale}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Job Overview Card */}
        <Card style={styles.overviewCard}>
          <View style={styles.badgeRow}>
            <SectorBadge sector={job.sector || 'Government'} fontScale={fontScale} />
          </View>

          <Text style={[styles.jobTitle, { color: theme.text, fontSize: 18 * fontScale }]}>
            {job.title || 'Job Opportunity'}
          </Text>

          <View style={styles.orgRow}>
            <Building size={15} color="#64748B" />
            <Text style={[styles.orgName, { fontSize: 13 * fontScale }]}>
              {job.organization} • {job.location}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleOpenJob}
            style={styles.viewJobBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View full job posting and guidelines"
          >
            <Text style={[styles.viewJobText, { color: theme.primary }]}>
              View Job Notification & Requirements
            </Text>
            <ChevronRight size={16} color={theme.primary} />
          </TouchableOpacity>
        </Card>

        {/* Stage Timeline Card */}
        <Card style={styles.timelineCard}>
          <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
            Current Stage in Recruitment
          </Text>
          <Text style={styles.timelineHint}>
            Select your current application stage to keep your dashboard tracker updated:
          </Text>

          <View style={styles.stagePicker}>
            {STAGES.map((stg) => {
              const active = currentStatus === stg.key;
              return (
                <TouchableOpacity
                  key={stg.key}
                  onPress={() => setCurrentStatus(stg.key)}
                  style={[styles.stageChip, active && styles.stageChipActive]}
                  accessible={true}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Stage: ${stg.label}`}
                >
                  <View
                    style={[styles.radioCircle, active && styles.radioCircleActive]}
                  >
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.stageChipText, active && styles.stageChipTextActive]}>
                    {stg.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Application Notes & Registration Card */}
        <Card style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <Edit3 size={18} color={theme.primary} />
            <Text style={[styles.sectionHeading, { fontSize: 15 * fontScale }]}>
              Registration & Application Notes
            </Text>
          </View>
          <Text style={styles.notesSub}>
            Keep track of your official Registration ID, Roll Number, Exam Center, or Scribe details:
          </Text>

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g., Reg No: SSC-2026-8841. Requested screen reader and scribe assistance."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            style={[styles.notesInput, { fontSize: 13 * fontScale }]}
            accessible={true}
            accessibilityLabel="Application notes and registration details input"
          />

          <View style={styles.datesRow}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.dateMeta}>
              First recorded on: {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <Button
            title={saving ? 'Saving...' : 'Save Updates'}
            variant="primary"
            size="md"
            icon={<Save size={16} color="#FFFFFF" />}
            onPress={handleSaveUpdates}
            disabled={saving}
            style={{ marginTop: 12 }}
          />
        </Card>

        {/* Portal Quick Access */}
        {job.official_application_url ? (
          <Card style={styles.portalCard}>
            <Text style={[styles.portalTitle, { fontSize: 14 * fontScale }]}>
              Official Portal Link
            </Text>
            <Text style={styles.portalSub}>
              Visit the official recruitment website to download admit cards, check results, or review application status.
            </Text>
            <Button
              title="Open Official Portal"
              variant="outline"
              size="md"
              icon={<ExternalLink size={16} color={theme.primary} />}
              onPress={handleOpenPortal}
              style={{ marginTop: 10 }}
            />
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginTop: 12,
  },
  errorSub: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  overviewCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  badgeRow: {
    marginBottom: 8,
  },
  jobTitle: {
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 24,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  orgName: {
    color: '#475569',
    fontWeight: '500',
  },
  viewJobBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
  },
  viewJobText: {
    fontWeight: '700',
    fontSize: 12,
  },
  timelineCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  sectionHeading: {
    fontWeight: '700',
    color: '#172033',
  },
  timelineHint: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  stagePicker: {
    gap: 8,
  },
  stageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 10,
  },
  stageChipActive: {
    borderColor: '#2457A6',
    backgroundColor: '#EFF6FF',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#2457A6',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2457A6',
  },
  stageChipText: {
    fontWeight: '600',
    color: '#475569',
    fontSize: 13,
  },
  stageChipTextActive: {
    color: '#2457A6',
    fontWeight: '700',
  },
  notesCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notesSub: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 16,
  },
  notesInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    backgroundColor: '#FFFFFF',
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#172033',
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  dateMeta: {
    color: '#64748B',
    fontSize: 11,
  },
  portalCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#F8FAFC',
  },
  portalTitle: {
    fontWeight: '700',
    color: '#172033',
    marginBottom: 4,
  },
  portalSub: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 16,
  },
});
