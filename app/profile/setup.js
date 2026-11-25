import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  GraduationCap,
  Briefcase,
  Compass,
  HeartHandshake,
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../src/constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import profileService from '../../src/services/profileService';
import Header from '../../src/components/common/Header';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/Input';
import Card from '../../src/components/common/Card';
import StepIndicator from '../../src/components/forms/StepIndicator';
import SelectOption from '../../src/components/forms/SelectOption';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const theme = Colors.light;
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1: Personal Details
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Section 2: Education
  const [education, setEducation] = useState('12th Pass (Higher Secondary)');
  const [institution, setInstitution] = useState('');
  const [literacyLevel, setLiteracyLevel] = useState('Fluent Reading & Writing');

  // Section 3: Skills & Training
  const [skills, setSkills] = useState('');
  const [previousTraining, setPreviousTraining] = useState('');
  const [computerProficiency, setComputerProficiency] = useState('Basic (Typing, MS Office)');

  // Section 4: Employment Aspirations
  const [preferredSector, setPreferredSector] = useState('Government / Public Sector (PSU)');
  const [preferredLocation, setPreferredLocation] = useState('Delhi NCR');
  const [careerInterests, setCareerInterests] = useState('');

  // Section 5: Support Requirements & Washington Group
  const [disabilityCategory, setDisabilityCategory] = useState('Autism Spectrum Disorder');
  const [udidReference, setUdidReference] = useState('');
  const [functionalDifficulties, setFunctionalDifficulties] = useState({
    seeing: 'no_difficulty',
    hearing: 'no_difficulty',
    walking: 'no_difficulty',
    cognition_remembering: 'some_difficulty',
    self_care: 'no_difficulty',
    communication: 'some_difficulty',
  });
  const [assistiveDevices, setAssistiveDevices] = useState('');
  const [humanAssistance, setHumanAssistance] = useState('');

  const steps = [
    'Personal Info',
    'Education',
    'Skills & Training',
    'Aspirations',
    'Support & Needs',
  ];

  // Load existing profile on mount
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        setFullName(user?.user_metadata?.full_name || user?.full_name || '');
        setEmail(user?.email || '');
        setPhone(user?.user_metadata?.phone || user?.phone || '');

        const { data } = await profileService.getProfile();
        if (data?.candidateProfile) {
          const cp = data.candidateProfile;
          if (cp.date_of_birth) setDob(cp.date_of_birth);
          if (cp.address) setAddress(cp.address);
          if (cp.education) setEducation(cp.education);
          if (cp.literacy_level) setLiteracyLevel(cp.literacy_level);
          if (cp.skills) setSkills(cp.skills);
          if (cp.previous_training) setPreviousTraining(cp.previous_training);
          if (cp.computer_proficiency) setComputerProficiency(cp.computer_proficiency);
          if (cp.preferred_sector) setPreferredSector(cp.preferred_sector);
          if (cp.preferred_location) setPreferredLocation(cp.preferred_location);
          if (cp.career_interests) setCareerInterests(cp.career_interests);
        }

        if (data?.disabilityProfile) {
          const dp = data.disabilityProfile;
          if (dp.udid_reference) setUdidReference(dp.udid_reference);
          if (dp.disability_category) setDisabilityCategory(dp.disability_category);
          if (dp.functional_difficulties) setFunctionalDifficulties(dp.functional_difficulties);
          if (dp.assistive_devices) setAssistiveDevices(dp.assistive_devices);
          if (dp.human_assistance_requirements) setHumanAssistance(dp.human_assistance_requirements);
        }
      } catch (e) {
        console.warn('Error loading initial profile:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchExisting();
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    const profilePayload = {
      fullName,
      email,
      phone,
      dateOfBirth: dob,
      address,
      education,
      literacyLevel,
      skills,
      previousTraining,
      computerProficiency,
      preferredSector,
      preferredLocation,
      careerInterests,
      udidReference,
      disabilityCategory,
      functionalDifficulties,
      assistiveDevices,
      humanAssistanceRequirements: humanAssistance,
    };

    const { error, isOfflineFallback } = await profileService.saveProfile(profilePayload);
    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message || 'Failed to save profile.');
    } else {
      Alert.alert(
        'Profile Saved Successfully!',
        isOfflineFallback
          ? 'Your profile was cached locally and will sync with the central server.'
          : 'Your candidate learning & employment profile is updated in the database.',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSaveProfile();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading Saarthi Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Candidate Profile Setup"
        subtitle="Step-by-step career & support profile"
        showBack={true}
        onBack={handleBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          {/* Section 1: Personal Details */}
          {currentStep === 0 && (
            <View>
              <Text style={styles.sectionHeading}>Section 1: Personal Information</Text>
              <Text style={styles.sectionSubtitle}>
                Basic demographic information to register you with job coaches and institutions.
              </Text>

              <Card style={styles.formCard}>
                <Input
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Candidate full name"
                />

                <Input
                  label="Date of Birth"
                  value={dob}
                  onChangeText={setDob}
                  placeholder="YYYY-MM-DD (e.g. 2001-05-15)"
                />

                <Input
                  label="Mobile Phone"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="10 digit number"
                  keyboardType="phone-pad"
                />

                <Input
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                />

                <Input
                  label="Permanent / Residential Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Address with Pin Code"
                  multiline={true}
                  numberOfLines={3}
                />
              </Card>
            </View>
          )}

          {/* Section 2: Education */}
          {currentStep === 1 && (
            <View>
              <Text style={styles.sectionHeading}>Section 2: Educational Background</Text>
              <Text style={styles.sectionSubtitle}>
                Select your highest education level to match minimum reservation eligibility.
              </Text>

              <Text style={styles.inputGroupLabel}>Highest Educational Qualification</Text>
              {[
                'Below 10th Standard',
                '10th Pass (Matriculation)',
                '12th Pass (Higher Secondary)',
                'ITI / Vocational Certificate',
                'Graduate Degree (B.A / B.Sc / B.Com / Equivalent)',
                'Post-Graduate or Higher',
              ].map((lvl) => (
                <SelectOption
                  key={lvl}
                  label={lvl}
                  selected={education === lvl}
                  onSelect={() => setEducation(lvl)}
                />
              ))}

              <Card style={styles.formCard}>
                <Input
                  label="School, College, or Institute Name"
                  value={institution}
                  onChangeText={setInstitution}
                  placeholder="e.g. Govt Senior Secondary School / NIEPMD Center"
                />

                <Input
                  label="Literacy & Language Proficiency"
                  value={literacyLevel}
                  onChangeText={setLiteracyLevel}
                  placeholder="e.g. Fluent reading & writing in Hindi / English"
                />
              </Card>
            </View>
          )}

          {/* Section 3: Skills & Training */}
          {currentStep === 2 && (
            <View>
              <Text style={styles.sectionHeading}>Section 3: Skills & Computer Literacy</Text>
              <Text style={styles.sectionSubtitle}>
                Highlight your practical skills and previous training programs.
              </Text>

              <Card style={styles.formCard}>
                <Input
                  label="Core Skills"
                  value={skills}
                  onChangeText={setSkills}
                  placeholder="e.g. Data entry, office administration, filing, packaging, retail"
                  multiline={true}
                  numberOfLines={2}
                />

                <Input
                  label="Previous Vocational Training or Certificates"
                  value={previousTraining}
                  onChangeText={setPreviousTraining}
                  placeholder="e.g. 6-Month NIEPMD Data Management Course"
                  multiline={true}
                  numberOfLines={2}
                />
              </Card>

              <Text style={styles.inputGroupLabel}>Computer Proficiency Level</Text>
              {[
                'No Computer Experience Yet',
                'Basic (Typing, MS Office, Browsing)',
                'Intermediate (Spreadsheets, Database Entry, Email)',
                'Advanced (Software, Design, IT Systems)',
              ].map((cp) => (
                <SelectOption
                  key={cp}
                  label={cp}
                  selected={computerProficiency === cp}
                  onSelect={() => setComputerProficiency(cp)}
                />
              ))}
            </View>
          )}

          {/* Section 4: Employment Aspirations */}
          {currentStep === 3 && (
            <View>
              <Text style={styles.sectionHeading}>Section 4: Employment Aspirations</Text>
              <Text style={styles.sectionSubtitle}>
                Tell us where and what types of roles you desire to pursue.
              </Text>

              <Text style={styles.inputGroupLabel}>Preferred Employment Sector</Text>
              {[
                'Government / Public Sector (PSU)',
                'Private Sector & Equal Opportunity Employers',
                'Autonomous Institutes & Universities',
                'Flexible / Hybrid / Remote Roles',
              ].map((sec) => (
                <SelectOption
                  key={sec}
                  label={sec}
                  selected={preferredSector === sec}
                  onSelect={() => setPreferredSector(sec)}
                />
              ))}

              <Card style={styles.formCard}>
                <Input
                  label="Preferred Job Location(s)"
                  value={preferredLocation}
                  onChangeText={setPreferredLocation}
                  placeholder="e.g. Delhi NCR, Chennai, Mumbai, or Hometown"
                />

                <Input
                  label="Specific Career Interests / Dream Job"
                  value={careerInterests}
                  onChangeText={setCareerInterests}
                  placeholder="e.g. Junior Secretariat Assistant, Library Assistant, Storekeeper"
                />
              </Card>
            </View>
          )}

          {/* Section 5: Support Requirements & Washington Group Questions */}
          {currentStep === 4 && (
            <View>
              <Text style={styles.sectionHeading}>Section 5: Support & Accommodations</Text>
              <Text style={styles.sectionSubtitle}>
                Washington Group functional assessment to identify accommodations (exam scribes, extra time, accessible workplace).
              </Text>

              <Card style={styles.formCard}>
                <Input
                  label="Disability Category"
                  value={disabilityCategory}
                  onChangeText={setDisabilityCategory}
                  placeholder="e.g. Autism Spectrum Disorder, Intellectual Disability"
                />

                <Input
                  label="UDID (Unique Disability ID) Card Reference (Optional)"
                  value={udidReference}
                  onChangeText={setUdidReference}
                  placeholder="e.g. DL0120230009874"
                  helperText="Protecting privacy: UDID is optional for Day 1."
                />
              </Card>

              {/* Washington Group Functional Difficulty Assessment */}
              <Text style={styles.inputGroupLabel}>
                Functional Assessment (Washington Group Set)
              </Text>

              {/* Cognition / Remembering */}
              <Card style={styles.wgCard}>
                <Text style={styles.wgQuestion}>
                  Do you have difficulty remembering or concentrating?
                </Text>
                {['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do'].map((opt) => (
                  <SelectOption
                    key={opt}
                    label={opt.replace(/_/g, ' ').toUpperCase()}
                    selected={functionalDifficulties.cognition_remembering === opt}
                    onSelect={() =>
                      setFunctionalDifficulties((prev) => ({
                        ...prev,
                        cognition_remembering: opt,
                      }))
                    }
                  />
                ))}
              </Card>

              {/* Communication */}
              <Card style={styles.wgCard}>
                <Text style={styles.wgQuestion}>
                  Do you have difficulty communicating (understanding or being understood)?
                </Text>
                {['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do'].map((opt) => (
                  <SelectOption
                    key={opt}
                    label={opt.replace(/_/g, ' ').toUpperCase()}
                    selected={functionalDifficulties.communication === opt}
                    onSelect={() =>
                      setFunctionalDifficulties((prev) => ({
                        ...prev,
                        communication: opt,
                      }))
                    }
                  />
                ))}
              </Card>

              <Card style={styles.formCard}>
                <Input
                  label="Assistive Devices Used or Required"
                  value={assistiveDevices}
                  onChangeText={setAssistiveDevices}
                  placeholder="e.g. Noise-cancelling headphones, screen reader, magnification software"
                />

                <Input
                  label="Human Assistance Requirements"
                  value={humanAssistance}
                  onChangeText={setHumanAssistance}
                  placeholder="e.g. Scribe for exams, compensatory time, workplace buddy"
                  multiline={true}
                  numberOfLines={2}
                />
              </Card>
            </View>
          )}

          {/* Step Navigation Controls */}
          <View style={styles.navRow}>
            {currentStep > 0 ? (
              <Button
                title="Previous"
                size="md"
                variant="outline"
                onPress={handleBack}
                icon={<ChevronLeft size={18} color="#2457A6" />}
                style={styles.navButton}
              />
            ) : (
              <View style={styles.navButton} />
            )}

            <Button
              title={currentStep === steps.length - 1 ? 'Save Profile' : 'Next Step'}
              size="md"
              variant="primary"
              loading={saving}
              onPress={handleNext}
              icon={
                currentStep === steps.length - 1 ? (
                  <Save size={18} color="#FFFFFF" />
                ) : (
                  <ChevronRight size={18} color="#FFFFFF" />
                )
              }
              iconPosition="right"
              style={styles.navButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#5A6882',
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#5A6882',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  inputGroupLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 8,
    marginTop: 4,
  },
  formCard: {
    marginBottom: Spacing.md,
  },
  wgCard: {
    marginBottom: Spacing.md,
  },
  wgQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172033',
    marginBottom: 10,
    lineHeight: 18,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 12,
  },
  navButton: {
    flex: 1,
  },
});
