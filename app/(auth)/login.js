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
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../src/constants/Colors';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/Input';
import Header from '../../src/components/common/Header';

export default function LoginScreen() {
  const router = useRouter();
  const theme = Colors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    // Real auth integration is connected in Commit 3 via AuthContext
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Sign In"
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
            <Text style={styles.welcomeText}>Welcome to Udyog Saarthi</Text>
            <Text style={styles.subtitleText}>
              Sign in with your registered account to continue your career journey.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Input
              label="Email Address"
              placeholder="candidate@example.gov.in"
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
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              secureTextEntry={true}
              leftIcon={<Lock size={20} color={theme.textSecondary} />}
              accessibilityLabel="Enter your password"
            />

            <TouchableOpacity
              onPress={() => alert('Password reset instructions will be sent to your email.')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Forgot Password? Request password reset link"
              style={styles.forgotPassBtn}
            >
              <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              size="lg"
              variant="primary"
              loading={loading}
              onPress={handleLogin}
              icon={<LogIn size={20} color="#FFFFFF" />}
              accessibilityLabel="Sign in button"
              style={styles.loginBtn}
            />
          </View>

          <View style={styles.registerPrompt}>
            <Text style={styles.registerPromptText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Create account: Navigate to registration"
            >
              <Text style={styles.registerLinkText}> Register Now</Text>
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
    marginVertical: Spacing.lg,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: '#5A6882',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.lg,
  },
  forgotPassBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
    paddingVertical: 4,
  },
  forgotPassText: {
    color: '#2457A6',
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    marginTop: Spacing.sm,
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  registerPromptText: {
    color: '#5A6882',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#2457A6',
    fontSize: 14,
    fontWeight: '700',
  },
});
