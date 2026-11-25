import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, Lock, UserPlus, Check } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../src/constants/Colors';
import { Config } from '../../src/constants/Config';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/Input';
import Header from '../../src/components/common/Header';

export default function RegisterScreen() {
  const router = useRouter();
  const theme = Colors.light;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(Config.ROLES.CANDIDATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: Config.ROLES.CANDIDATE, label: 'Candidate', sub: 'Job seeker with disability' },
    { id: Config.ROLES.PARENT, label: 'Parent / Guardian', sub: 'Assisting a candidate' },
    { id: Config.ROLES.JOB_COACH, label: 'Job Coach', sub: 'Mentor / institution guide' },
  ];

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    // Real auth integration hooked up in Commit 3 via AuthContext
    setTimeout(() => {
      setLoading(false);
      router.replace('/profile/setup');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Create Account"
        showBack={true}
        onBack={() => router.back()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerBlock}>
            <Text style={styles.welcomeText}>Join Udyog Saarthi</Text>
            <Text style={styles.subtitleText}>
              Every Ability Deserves an Opportunity. Select your profile role to begin.
            </Text>
          </View>

          {/* Role Selection */}
          <Text style={styles.roleSectionTitle}>Select Your Role</Text>
          <View style={styles.roleGrid}>
            {roles.map((r) => {
              const selected = role === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setRole(r.id)}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${r.label}: ${r.sub}`}
                  style={[
                    styles.roleCard,
                    selected && styles.roleCardSelected,
                  ]}
                >
                  <View style={styles.roleHeader}>
                    <Text
                      style={[
                        styles.roleLabel,
                        selected && styles.roleLabelSelected,
                      ]}
                    >
                      {r.label}
                    </Text>
                    {selected && (
                      <View style={styles.checkBadge}>
                        <Check size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.roleSub}>{r.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Registration Form */}
          <View style={styles.formCard}>
            <Input
              label="Full Name"
              placeholder="e.g. Ramesh Kumar"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
              }}
              error={errors.fullName}
              leftIcon={<User size={20} color={theme.textSecondary} />}
              accessibilityLabel="Enter your full legal name"
            />

            <Input
              label="Email Address"
              placeholder="ramesh@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={theme.textSecondary} />}
              accessibilityLabel="Enter your email address"
            />

            <Input
              label="Mobile Phone Number"
              placeholder="9876543210"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
              }}
              error={errors.phone}
              keyboardType="phone-pad"
              leftIcon={<Phone size={20} color={theme.textSecondary} />}
              accessibilityLabel="Enter your 10 digit mobile phone number"
            />

            <Input
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              secureTextEntry={true}
              leftIcon={<Lock size={20} color={theme.textSecondary} />}
              accessibilityLabel="Create a password with at least 6 characters"
            />

            <Input
              label="Confirm Password"
              placeholder="Re-type your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              error={errors.confirmPassword}
              secureTextEntry={true}
              leftIcon={<Lock size={20} color={theme.textSecondary} />}
              accessibilityLabel="Confirm your password"
            />

            <Button
              title="Create Account"
              size="lg"
              variant="primary"
              loading={loading}
              onPress={handleRegister}
              icon={<UserPlus size={20} color="#FFFFFF" />}
              accessibilityLabel="Submit registration and create account"
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Navigate to sign in"
            >
              <Text style={styles.loginLinkText}> Sign In</Text>
            </TouchableOpacity>
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
  headerBlock: {
    marginVertical: Spacing.md,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#5A6882',
    lineHeight: 20,
  },
  roleSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
    marginBottom: Spacing.sm,
  },
  roleGrid: {
    marginBottom: Spacing.md,
    gap: 8,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  roleCardSelected: {
    borderColor: '#2457A6',
    backgroundColor: '#F0F6FF',
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#172033',
  },
  roleLabelSelected: {
    color: '#2457A6',
    fontWeight: '700',
  },
  checkBadge: {
    backgroundColor: '#2457A6',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleSub: {
    fontSize: 12,
    color: '#64748B',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  loginPromptText: {
    color: '#5A6882',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#2457A6',
    fontSize: 14,
    fontWeight: '700',
  },
});
