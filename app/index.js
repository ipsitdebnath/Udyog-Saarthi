import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Shield,
  Briefcase,
  BookOpen,
  Users,
  Eye,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../src/constants/Colors';
import Button from '../src/components/common/Button';
import Card from '../src/components/common/Card';

export default function LandingScreen() {
  const router = useRouter();
  const theme = Colors.light;

  const [accessibilityModalVisible, setAccessibilityModalVisible] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  const activeTheme = highContrast ? Colors.highContrast : Colors.light;

  const handleIncreaseText = () => {
    if (fontScale < 1.4) setFontScale(prev => Math.round((prev + 0.1) * 10) / 10);
  };

  const handleDecreaseText = () => {
    if (fontScale > 0.9) setFontScale(prev => Math.round((prev - 0.1) * 10) / 10);
  };

  const handleResetAccessibility = () => {
    setFontScale(1);
    setHighContrast(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: activeTheme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Accessibility Bar */}
        <View style={styles.topBar}>
          <View style={styles.govBadge}>
            <Shield size={14} color={activeTheme.primary} />
            <Text
              style={[
                styles.govBadgeText,
                { color: activeTheme.primary, fontSize: 11 * fontScale },
              ]}
            >
              GOVERNMENT OF INDIA • NIEPMD
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setAccessibilityModalVisible(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Accessibility options"
            accessibilityHint="Open accessibility menu to change text size or contrast"
            style={[
              styles.accessibilityPill,
              {
                borderColor: activeTheme.border,
                backgroundColor: activeTheme.surface,
              },
            ]}
          >
            <Eye size={16} color={activeTheme.primary} />
            <Text
              style={[
                styles.accessibilityPillText,
                { color: activeTheme.primary, fontSize: 12 * fontScale },
              ]}
            >
              Accessibility
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Branding Section */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: activeTheme.primaryLight, borderColor: activeTheme.primary },
            ]}
          >
            <Sparkles size={38} color={activeTheme.primary} />
          </View>

          <Text
            style={[
              styles.appTitle,
              {
                color: activeTheme.primary,
                fontSize: 28 * fontScale,
                fontWeight: highContrast ? '800' : '700',
              },
            ]}
          >
            Udyog Saarthi
          </Text>

          <Text
            style={[
              styles.tagline,
              {
                color: activeTheme.secondary,
                fontSize: 16 * fontScale,
                fontWeight: highContrast ? '700' : '600',
              },
            ]}
          >
            Every Ability Deserves an Opportunity
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: activeTheme.textSecondary,
                fontSize: 14 * fontScale,
              },
            ]}
          >
            An inclusive employment and coaching ecosystem empowering Persons with
            Disabilities to discover government and private jobs under 4% reservation,
            master exams, and connect with dedicated job coaches.
          </Text>
        </View>

        {/* Core Pillars Feature Cards */}
        <View style={styles.featuresContainer}>
          <Card
            style={styles.featureCard}
            highContrast={highContrast}
            accessibilityLabel="Opportunity Explorer feature: 4% reservation jobs simplified"
          >
            <View style={styles.featureRow}>
              <View
                style={[
                  styles.featureIconBox,
                  { backgroundColor: activeTheme.primaryLight },
                ]}
              >
                <Briefcase size={22} color={activeTheme.primary} />
              </View>
              <View style={styles.featureTextCol}>
                <Text
                  style={[
                    styles.featureHeading,
                    { color: activeTheme.text, fontSize: 16 * fontScale },
                  ]}
                >
                  Simplified Opportunities
                </Text>
                <Text
                  style={[
                    styles.featureSubtext,
                    { color: activeTheme.textSecondary, fontSize: 13 * fontScale },
                  ]}
                >
                  Official notifications transformed into plain language with Washington
                  Group functional compatibility.
                </Text>
              </View>
            </View>
          </Card>

          <Card
            style={styles.featureCard}
            highContrast={highContrast}
            accessibilityLabel="Saarthi Learning: Accessible exam preparation"
          >
            <View style={styles.featureRow}>
              <View
                style={[
                  styles.featureIconBox,
                  { backgroundColor: activeTheme.secondaryLight },
                ]}
              >
                <BookOpen size={22} color={activeTheme.secondary} />
              </View>
              <View style={styles.featureTextCol}>
                <Text
                  style={[
                    styles.featureHeading,
                    { color: activeTheme.text, fontSize: 16 * fontScale },
                  ]}
                >
                  Accessible Learning
                </Text>
                <Text
                  style={[
                    styles.featureSubtext,
                    { color: activeTheme.textSecondary, fontSize: 13 * fontScale },
                  ]}
                >
                  Adaptive preparation materials, model papers, and skill training
                  crafted for neurodivergent and diverse learners.
                </Text>
              </View>
            </View>
          </Card>

          <Card
            style={styles.featureCard}
            highContrast={highContrast}
            accessibilityLabel="Job Coach Connect: 1-on-1 human guidance and workplace support"
          >
            <View style={styles.featureRow}>
              <View
                style={[
                  styles.featureIconBox,
                  { backgroundColor: activeTheme.primaryLight },
                ]}
              >
                <Users size={22} color={activeTheme.primary} />
              </View>
              <View style={styles.featureTextCol}>
                <Text
                  style={[
                    styles.featureHeading,
                    { color: activeTheme.text, fontSize: 16 * fontScale },
                  ]}
                >
                  Job Coach Connect
                </Text>
                <Text
                  style={[
                    styles.featureSubtext,
                    { color: activeTheme.textSecondary, fontSize: 13 * fontScale },
                  ]}
                >
                  Dedicated mentorship for candidates and parents throughout application,
                  exam accommodations, and workplace onboarding.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Get Started"
            size="lg"
            variant="primary"
            highContrast={highContrast}
            fontScale={fontScale}
            icon={<ArrowRight size={20} color="#FFFFFF" />}
            iconPosition="right"
            accessibilityLabel="Get Started: Create your candidate account"
            onPress={() => router.push('/(auth)/register')}
          />

          <Button
            title="Sign In"
            size="lg"
            variant="outline"
            highContrast={highContrast}
            fontScale={fontScale}
            accessibilityLabel="Sign In: Access existing account"
            onPress={() => router.push('/(auth)/login')}
          />
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <CheckCircle2 size={14} color={activeTheme.secondary} />
          <Text
            style={[
              styles.footerText,
              { color: activeTheme.textMuted, fontSize: 12 * fontScale },
            ]}
          >
            Ministry of Social Justice & Empowerment • Govt. of India
          </Text>
        </View>
      </ScrollView>

      {/* Accessibility Settings Modal */}
      <Modal
        visible={accessibilityModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAccessibilityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: activeTheme.surface,
                borderColor: highContrast ? '#000000' : activeTheme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: activeTheme.text, fontSize: 18 * fontScale },
              ]}
            >
              Accessibility Options
            </Text>

            <View style={styles.modalSection}>
              <Text
                style={[
                  styles.modalSectionLabel,
                  { color: activeTheme.textSecondary, fontSize: 14 * fontScale },
                ]}
              >
                Text Size: {Math.round(fontScale * 100)}%
              </Text>
              <View style={styles.modalButtonsRow}>
                <Button
                  title="A- Smaller"
                  size="sm"
                  variant="outline"
                  onPress={handleDecreaseText}
                  highContrast={highContrast}
                  fontScale={fontScale}
                  accessibilityLabel="Decrease text size"
                />
                <Button
                  title="A+ Larger"
                  size="sm"
                  variant="primary"
                  onPress={handleIncreaseText}
                  highContrast={highContrast}
                  fontScale={fontScale}
                  accessibilityLabel="Increase text size"
                />
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text
                style={[
                  styles.modalSectionLabel,
                  { color: activeTheme.textSecondary, fontSize: 14 * fontScale },
                ]}
              >
                Contrast Mode
              </Text>
              <Button
                title={highContrast ? 'Switch to Standard Theme' : 'Enable High Contrast'}
                size="md"
                variant={highContrast ? 'primary' : 'outline'}
                onPress={() => setHighContrast(!highContrast)}
                highContrast={highContrast}
                fontScale={fontScale}
                accessibilityLabel="Toggle high contrast display"
              />
            </View>

            <View style={styles.modalSection}>
              <Button
                title="Reset to Defaults"
                size="sm"
                variant="text"
                onPress={handleResetAccessibility}
                highContrast={highContrast}
                fontScale={fontScale}
                accessibilityLabel="Reset accessibility settings to standard"
              />
            </View>

            <Button
              title="Done"
              size="md"
              variant="primary"
              onPress={() => setAccessibilityModalVisible(false)}
              highContrast={highContrast}
              fontScale={fontScale}
              accessibilityLabel="Close accessibility options"
            />
          </View>
        </View>
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
    paddingBottom: Spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  govBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  govBadgeText: {
    marginLeft: 4,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  accessibilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  accessibilityPillText: {
    marginLeft: 6,
    fontWeight: '600',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
  },
  appTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: Spacing.xs,
  },
  featuresContainer: {
    marginVertical: Spacing.md,
  },
  featureCard: {
    marginBottom: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTextCol: {
    flex: 1,
  },
  featureHeading: {
    fontWeight: '700',
    marginBottom: 4,
  },
  featureSubtext: {
    lineHeight: 18,
  },
  actionsContainer: {
    marginVertical: Spacing.md,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  footerText: {
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    borderTopWidth: 2,
  },
  modalTitle: {
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: Spacing.md,
  },
  modalSectionLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
