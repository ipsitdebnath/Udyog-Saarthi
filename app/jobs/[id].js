import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Calendar,
  Building,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Users,
  Eye,
  FileCheck,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import SectorBadge from '../../src/components/jobs/SectorBadge';
import DeadlineBadge from '../../src/components/jobs/DeadlineBadge';
import EligibilityCard from '../../src/components/jobs/EligibilityCard';
import { useAccessibility } from '../../src/context/AccessibilityContext';
import jobService from '../../src/services/jobService';
import aiService from '../../src/services/aiService';
import applicationService from '../../src/services/applicationService';
import { formatDateWithRelative } from '../../src/utils/jobHelpers';
import { Colors, BorderRadius, Spacing } from '../../src/constants/Colors';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fontScale, highContrast, soundAssistance, speak, stopSpeaking } =
    useAccessibility();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Saarthi AI modal state (wired to backend in Commit 4)
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Application recording modal state
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [recordNotes, setRecordNotes] = useState('');
  const [recordingApp, setRecordingApp] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Fetch job detail
  useEffect(() => {
    let isMounted = true;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await jobService.getJobById(id);
        if (isMounted) {
          if (res.success && res.data) {
            setJob(res.data);
          } else {
            setError(res.error || 'Job not found');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error loading job details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchJob();
    return () => {
      isMounted = false;
      stopSpeaking();
    };
  }, [id]);

  // Toggle bookmark
  const handleToggleSave = async () => {
    if (!job) return;
    setSaving(true);
    const newSaved = !job.is_saved;
    setJob((prev) => ({ ...prev, is_saved: newSaved }));

    if (soundAssistance) {
      speak(newSaved ? 'Opportunity saved to your bookmarks' : 'Bookmark removed');
    }

    const res = await jobService.toggleSaveJob(job.id, !newSaved);
    if (!res.success) {
      setJob((prev) => ({ ...prev, is_saved: !newSaved }));
    }
    setSaving(false);
  };

  // Open Official Application URL safely
  const handleOpenApplicationPortal = async () => {
    if (!job?.official_application_url) {
      Alert.alert(
        'Application URL Notice',
        'Official application portal link is not currently available for this listing. Please refer to the recruitment notification.',
        [{ text: 'OK' }]
      );
      return;
    }

    const url = job.official_application_url;
    Alert.alert(
      'Opening Official Portal',
      `You will be redirected to the verified recruitment website:\n\n${url}\n\nPlease ensure you keep your required documents ready.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to Apply',
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert('Unable to open link', `Could not open ${url}`);
              }
            } catch (err) {
              Alert.alert('Navigation Error', err.message);
            }
          },
        },
      ]
    );
  };

  // Open Official Notification PDF / Circular
  const handleOpenNotificationUrl = async () => {
    if (!job?.notification_url) {
      Alert.alert('Notification Notice', 'Official notification document is pending publication.');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(job.notification_url);
      if (supported) {
        await Linking.openURL(job.notification_url);
      } else {
        Alert.alert('Unable to open document', `Could not open ${job.notification_url}`);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Record an application submission
  const handleRecordApplication = async () => {
    setRecordingApp(true);
    try {
      const res = await applicationService.recordApplication({
        jobId: job.id,
        status: 'applied',
        notes: recordNotes.trim() || 'Applied via recruitment portal',
      });
      if (res.success) {
        setHasApplied(true);
        setRecordModalVisible(false);
        if (soundAssistance) speak('Application recorded in your journey tracker');
        Alert.alert(
          'Application Recorded!',
          'Your submission has been logged into the Employment Journey Tracker. You can monitor examination dates and admit cards anytime.',
          [
            { text: 'Stay Here', style: 'cancel' },
            { text: 'View Tracker', onPress: () => router.push('/applications') },
          ]
        );
      } else {
        Alert.alert('Error', res.error || 'Failed to record application');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setRecordingApp(false);
    }
  };

  // Toggle Read Aloud with Text-to-Speech
  const handleToggleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (aiData) {
      const datesSummary = aiData.importantDates?.map((d) => `${d.label}: ${d.date}`).join('. ') || '';
      const textToRead = `${aiData.simpleTitle || job.title}. ${aiData.whatThisJobMeans}. Who can apply: ${aiData.whoCanApply?.join(', ')}. Skills required: ${aiData.skillsRequired?.join(', ')}. Important dates: ${datesSummary}. Steps to apply: ${aiData.stepsToApply?.join('. ')}. Disclaimer: ${aiData.disclaimer}`;
      speak(textToRead);
      setIsSpeaking(true);
    }
  };

  // Trigger AI Simplification (calls backend service)
  const handleSimplifyWithAI = async () => {
    setAiModalVisible(true);
    if (aiData) return; // already loaded

    setAiLoading(true);
    setAiError(null);
    try {
      const res = await aiService.simplifyJob(job.id);
      if (res.success && res.data) {
        setAiData(res.data);
      } else {
        setAiError(res.error || 'Failed to simplify notification');
      }
    } catch (err) {
      setAiError(err.message || 'Error connecting to Saarthi AI service');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <Header title="Opportunity Details" showBack onBack={() => router.back()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading job details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <Header title="Opportunity Details" showBack onBack={() => router.back()} />
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color="#DC2626" />
          <Text style={styles.errorTitle}>Opportunity Not Found</Text>
          <Text style={styles.errorMessage}>{error || 'The requested job could not be located.'}</Text>
          <Button
            title="Back to Opportunities"
            variant="outline"
            size="md"
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        title={job.organization}
        subtitle={job.sector}
        showBack
        onBack={() => router.back()}
        highContrast={highContrast}
        fontScale={fontScale}
        rightAction={
          <TouchableOpacity
            onPress={handleToggleSave}
            disabled={saving}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={job.is_saved ? 'Remove bookmark' : 'Bookmark this opportunity'}
            style={styles.headerActionBtn}
          >
            {job.is_saved ? (
              <BookmarkCheck size={24} color={theme.primary} />
            ) : (
              <Bookmark size={24} color="#64748B" />
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Demo Data Banner if demo */}
        {job.is_demo && (
          <View style={styles.demoBanner}>
            <AlertCircle size={16} color="#991B1B" />
            <Text style={styles.demoBannerText}>
              DEMO DATA: This is an illustrative listing for demonstration purposes. Official URLs and notifications are sample links.
            </Text>
          </View>
        )}

        {/* Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <SectorBadge sector={job.sector} fontScale={fontScale} />
            <DeadlineBadge deadline={job.application_deadline} fontScale={fontScale} />
          </View>

          <Text style={[styles.jobTitle, { color: theme.text, fontSize: 20 * fontScale }]}>
            {job.title}
          </Text>

          <View style={styles.orgRow}>
            <Building size={16} color="#64748B" />
            <Text style={[styles.orgName, { fontSize: 14 * fontScale }]}>
              {job.organization}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={16} color="#64748B" />
            <Text style={[styles.locationName, { fontSize: 13 * fontScale }]}>
              {job.location} • {job.employment_type || 'Regular / Full-time'}
            </Text>
          </View>

          {/* Source Verification Badge */}
          <View style={styles.verificationRow}>
            <ShieldCheck size={14} color="#059669" />
            <Text style={styles.verificationText}>
              Source: {job.source_name || 'Official Gazette'} • Verified {job.source_verified_at ? new Date(job.source_verified_at).toLocaleDateString() : 'Recently'}
            </Text>
          </View>
        </Card>

        {/* Primary AI CTA Banner */}
        <TouchableOpacity
          onPress={handleSimplifyWithAI}
          activeOpacity={0.85}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Simplify job notification with Saarthi AI"
          accessibilityHint="Converts complex official gazette terms into plain language bullet points"
          style={styles.aiBannerBtn}
        >
          <View style={styles.aiIconBubble}>
            <Sparkles size={22} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.aiBannerTitle, { fontSize: 15 * fontScale }]}>
              Simplify with Saarthi AI
            </Text>
            <Text style={[styles.aiBannerSubtitle, { fontSize: 12 * fontScale }]}>
              Translate complex recruitment circular into plain language, eligibility check & step-by-step application guide.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Eligibility & Reservation Card */}
        <EligibilityCard
          educationRequirements={job.education_requirements}
          eligibleCategories={job.eligible_disability_categories}
          reservationDetails={job.reservation_details || {}}
          fontScale={fontScale}
        />

        {/* Reservation Quota & Vacancy Details */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Users size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
              Vacancies & Disability Reservation
            </Text>
          </View>

          {job.reservation_details?.quota && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>PwD Reservation:</Text>
              <Text style={styles.dataValue}>{job.reservation_details.quota}</Text>
            </View>
          )}

          {job.vacancy_details?.total && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Total Vacancies:</Text>
              <Text style={styles.dataValue}>
                {job.vacancy_details.total} {job.vacancy_details.pwdQuota ? `(${job.vacancy_details.pwdQuota} reserved for PwD)` : ''}
              </Text>
            </View>
          )}

          {job.age_requirement && (
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Age Requirement:</Text>
              <Text style={styles.dataValue}>{job.age_requirement}</Text>
            </View>
          )}

          {job.reservation_details?.scribeFacility && (
            <View style={styles.facilityBox}>
              <CheckCircle2 size={15} color="#059669" />
              <Text style={styles.facilityText}>
                Scribe facility and compensatory time (20 min/hour) guaranteed as per Central Guidelines.
              </Text>
            </View>
          )}
        </Card>

        {/* Job Description */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <FileText size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
              Job Description & Duties
            </Text>
          </View>
          <Text style={[styles.bodyText, { fontSize: 14 * fontScale, lineHeight: 22 * fontScale }]}>
            {job.description}
          </Text>
        </Card>

        {/* Required Skills */}
        {job.required_skills && job.required_skills.length > 0 && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Award size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
                Required Skills & Competencies
              </Text>
            </View>
            <View style={styles.skillsWrap}>
              {job.required_skills.map((skill, index) => (
                <View key={index} style={styles.skillPill}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Examination & Selection Process */}
        {job.examination_details && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Eye size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
                Examination & Selection Scheme
              </Text>
            </View>
            <Text style={[styles.bodyText, { fontSize: 13 * fontScale, lineHeight: 20 * fontScale }]}>
              {job.examination_details}
            </Text>
          </Card>
        )}

        {/* Required Documents */}
        {job.required_documents && job.required_documents.length > 0 && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <FileCheck size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
                Documents Required to Apply
              </Text>
            </View>
            {job.required_documents.map((doc, idx) => (
              <View key={idx} style={styles.docRow}>
                <CheckCircle2 size={15} color="#2457A6" style={{ marginTop: 2, marginRight: 8 }} />
                <Text style={[styles.docText, { fontSize: 13 * fontScale }]}>{doc}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Official Links & Notification */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ExternalLink size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>
              Official Verification Links
            </Text>
          </View>

          {job.notification_url ? (
            <TouchableOpacity
              onPress={handleOpenNotificationUrl}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Read official gazette notification"
              style={styles.linkRow}
            >
              <Text style={styles.linkText}>View Official Notification (PDF / Circular)</Text>
              <ExternalLink size={14} color="#2457A6" />
            </TouchableOpacity>
          ) : null}

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              Important: Udyog Saarthi provides verified vacancy summaries. Candidates must verify all eligibility parameters, reservation rosters, and guidelines directly with the official notification published by {job.organization}.
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          title={job.is_saved ? 'Saved' : 'Save'}
          variant="outline"
          size="sm"
          icon={job.is_saved ? <BookmarkCheck size={16} color={theme.primary} /> : <Bookmark size={16} color={theme.primary} />}
          onPress={handleToggleSave}
          style={styles.saveBtn}
        />

        <Button
          title={hasApplied ? 'Applied ✓' : 'Record'}
          variant="secondary"
          size="sm"
          icon={<FileCheck size={16} color="#0E635C" />}
          onPress={() => setRecordModalVisible(true)}
          style={styles.recordBtn}
        />

        <Button
          title="Apply on Portal"
          variant="primary"
          size="sm"
          icon={<ExternalLink size={16} color="#FFFFFF" />}
          onPress={handleOpenApplicationPortal}
          style={styles.applyBtn}
        />
      </View>

      {/* Record Application Modal */}
      <Modal
        visible={recordModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setRecordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recordSheet}>
            <View style={styles.recordHeader}>
              <FileCheck size={22} color="#059669" />
              <Text style={[styles.recordTitle, { fontSize: 17 * fontScale }]}>
                Record Application Submission
              </Text>
            </View>
            <Text style={styles.recordSub}>
              Applied on the official {job.organization} portal? Save your registration ID or notes here to track examination dates and admit cards.
            </Text>

            <TextInput
              value={recordNotes}
              onChangeText={setRecordNotes}
              placeholder="e.g. Reg ID: SSC-2026-9021. Exam center selected: Delhi."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              style={styles.recordInput}
              accessible={true}
              accessibilityLabel="Application registration number or notes input"
            />

            <View style={styles.recordActionsRow}>
              <Button
                title="Cancel"
                variant="outline"
                size="md"
                onPress={() => setRecordModalVisible(false)}
                style={{ flex: 1 }}
              />
              <Button
                title={recordingApp ? 'Saving...' : 'Confirm'}
                variant="primary"
                size="md"
                onPress={handleRecordApplication}
                disabled={recordingApp}
                style={{ flex: 1.5 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Simplification Modal */}
      <Modal
        visible={aiModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAiModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <Header
            title="Saarthi AI Summary"
            subtitle="Simplified Notification Assistant"
            showBack
            onBack={() => {
              stopSpeaking();
              setIsSpeaking(false);
              setAiModalVisible(false);
            }}
            rightAction={
              aiData ? (
                <TouchableOpacity
                  onPress={handleToggleReadAloud}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={isSpeaking ? 'Stop reading aloud' : 'Read simplified summary aloud'}
                  style={styles.headerActionBtn}
                >
                  {isSpeaking ? (
                    <VolumeX size={22} color="#DC2626" />
                  ) : (
                    <Volume2 size={22} color="#2457A6" />
                  )}
                </TouchableOpacity>
              ) : null
            }
          />

          {aiLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#2457A6" />
              <Text style={styles.loadingText}>Simplifying recruitment circular with AI...</Text>
            </View>
          ) : aiData ? (
            <ScrollView contentContainerStyle={styles.aiModalContent}>
              <View style={styles.aiHeaderCard}>
                <Sparkles size={28} color="#2457A6" />
                <Text style={styles.aiHeaderTitle}>{aiData.simpleTitle || job.title}</Text>
                <Text style={styles.aiHeaderSub}>{aiData.whatThisJobMeans}</Text>
              </View>

              {/* Listen Aloud Button Pill */}
              <TouchableOpacity
                onPress={handleToggleReadAloud}
                style={[styles.listenPill, isSpeaking && styles.listenPillActive]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isSpeaking ? 'Stop speech readout' : 'Listen to simplified summary'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX size={18} color="#DC2626" />
                    <Text style={[styles.listenText, { color: '#DC2626' }]}>Stop Reading Aloud</Text>
                  </>
                ) : (
                  <>
                    <Volume2 size={18} color="#2457A6" />
                    <Text style={styles.listenText}>Listen to Summary Aloud (TTS)</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Who Can Apply */}
              <View style={styles.aiSection}>
                <Text style={styles.aiSectionHeading}>👤 Who Can Apply</Text>
                {aiData.whoCanApply?.map((item, idx) => (
                  <View key={idx} style={styles.aiBulletRow}>
                    <Text style={styles.aiBullet}>•</Text>
                    <Text style={styles.aiBulletText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Skills Required */}
              <View style={styles.aiSection}>
                <Text style={styles.aiSectionHeading}>💡 Skills You Will Need</Text>
                {aiData.skillsRequired?.map((skill, idx) => (
                  <View key={idx} style={styles.aiBulletRow}>
                    <Text style={styles.aiBullet}>•</Text>
                    <Text style={styles.aiBulletText}>{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Steps To Apply */}
              <View style={styles.aiSection}>
                <Text style={styles.aiSectionHeading}>📝 Step-by-Step Application Guide</Text>
                {aiData.stepsToApply?.map((step, idx) => (
                  <View key={idx} style={styles.aiStepRow}>
                    <View style={styles.aiStepNumber}>
                      <Text style={styles.aiStepNumberText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.aiStepText}>{step}</Text>
                  </View>
                ))}
              </View>

              {/* Documents Required */}
              <View style={styles.aiSection}>
                <Text style={styles.aiSectionHeading}>📄 Documents to Prepare</Text>
                {aiData.documentsRequired?.map((doc, idx) => (
                  <View key={idx} style={styles.aiBulletRow}>
                    <Text style={styles.aiBullet}>✓</Text>
                    <Text style={styles.aiBulletText}>{doc}</Text>
                  </View>
                ))}
              </View>

              {/* Things to Remember */}
              {aiData.thingsToRemember && (
                <View style={styles.aiSection}>
                  <Text style={styles.aiSectionHeading}>⚠️ Things to Keep in Mind</Text>
                  {aiData.thingsToRemember.map((item, idx) => (
                    <View key={idx} style={styles.aiBulletRow}>
                      <Text style={styles.aiBullet}>•</Text>
                      <Text style={styles.aiBulletText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Disclaimer */}
              <View style={styles.aiDisclaimerBox}>
                <Text style={styles.aiDisclaimerText}>{aiData.disclaimer}</Text>
              </View>

              <Button
                title="Proceed to Apply"
                variant="primary"
                size="lg"
                onPress={() => {
                  setAiModalVisible(false);
                  handleOpenApplicationPortal();
                }}
                style={{ marginTop: 16 }}
              />
            </ScrollView>
          ) : (
            <View style={styles.centerContainer}>
              <AlertCircle size={40} color="#DC2626" />
              <Text style={styles.errorMessage}>{aiError || 'Unable to simplify notification.'}</Text>
              <Button
                title="Retry"
                variant="outline"
                size="md"
                onPress={handleSimplifyWithAI}
                style={{ marginTop: 16 }}
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  headerActionBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginBottom: Spacing.md,
  },
  demoBannerText: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    lineHeight: 16,
  },
  heroCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 26,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  orgName: {
    color: '#334155',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationName: {
    color: '#64748B',
    fontWeight: '500',
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  verificationText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  aiBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    padding: 14,
    marginBottom: Spacing.md,
    gap: 12,
  },
  aiIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBannerTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 2,
  },
  aiBannerSubtitle: {
    color: '#BFDBFE',
    lineHeight: 16,
  },
  sectionCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#172033',
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  dataLabel: {
    width: 140,
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  dataValue: {
    flex: 1,
    fontSize: 13,
    color: '#172033',
    fontWeight: '500',
  },
  facilityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  facilityText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  bodyText: {
    color: '#334155',
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  skillText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  docText: {
    color: '#172033',
    flex: 1,
    lineHeight: 18,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  linkText: {
    color: '#2457A6',
    fontWeight: '700',
    fontSize: 13,
  },
  disclaimerBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  disclaimerText: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  saveBtn: {
    flex: 1,
  },
  applyBtn: {
    flex: 2,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  aiModalContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  aiHeaderCard: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  aiHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A8A',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  aiHeaderSub: {
    fontSize: 13,
    color: '#3B82F6',
    textAlign: 'center',
    lineHeight: 18,
  },
  aiSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  aiSectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 8,
  },
  aiBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  aiBullet: {
    fontSize: 14,
    color: '#2457A6',
    marginRight: 8,
    lineHeight: 18,
  },
  aiBulletText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  aiStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  aiStepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2457A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  aiStepNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  aiStepText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  aiDisclaimerBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  aiDisclaimerText: {
    color: '#92400E',
    fontSize: 11,
    lineHeight: 15,
  },
  listenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  listenPillActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  listenText: {
    color: '#2457A6',
    fontWeight: '700',
    fontSize: 13,
  },
  recordBtn: {
    flex: 1.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  recordSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  recordTitle: {
    fontWeight: '800',
    color: '#172033',
  },
  recordSub: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  recordInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    backgroundColor: '#F8FAFC',
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
    color: '#172033',
    marginBottom: 14,
  },
  recordActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginTop: 12,
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
