import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Eye, Volume2, VolumeX, RotateCcw, X, ZoomIn, ZoomOut, Check } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';
import { useAccessibility } from '../../context/AccessibilityContext';
import Button from './Button';

export default function AccessibilityToolbar() {
  const {
    fontScale,
    highContrast,
    soundAssistance,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleSoundAssistance,
    resetSettings,
    speak,
    themeColors,
  } = useAccessibility();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* Floating Toolbar Pill */}
      <View style={styles.floatingContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Accessibility Toolbar. Current text scale ${Math.round(
            fontScale * 100
          )} percent. High contrast ${highContrast ? 'On' : 'Off'}`}
          accessibilityHint="Tap to open accessibility controls for font size, contrast, and voice assistance"
          style={[
            styles.floatingPill,
            {
              backgroundColor: highContrast ? '#000000' : '#2457A6',
              borderColor: '#FFFFFF',
            },
          ]}
        >
          <Eye size={18} color="#FFFFFF" />
          <Text style={styles.floatingText}>A11y</Text>
        </TouchableOpacity>
      </View>

      {/* Accessibility Control Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: themeColors.surface,
                borderColor: highContrast ? '#000000' : themeColors.border,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Eye size={22} color={themeColors.primary} />
                <Text
                  style={[
                    styles.modalTitle,
                    { color: themeColors.text, fontSize: 18 * fontScale },
                  ]}
                >
                  Accessibility Toolbar
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Close accessibility toolbar"
                style={styles.closeBtn}
              >
                <X size={22} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.modalSub,
                { color: themeColors.textSecondary, fontSize: 13 * fontScale },
              ]}
            >
              Customize font sizing, contrast, and audio assistance to suit your viewing comfort.
            </Text>

            {/* 1. Text Resizing Section */}
            <View style={styles.settingBlock}>
              <View style={styles.settingHeader}>
                <Text
                  style={[
                    styles.settingLabel,
                    { color: themeColors.text, fontSize: 15 * fontScale },
                  ]}
                >
                  Text Size: {Math.round(fontScale * 100)}%
                </Text>
              </View>

              <View style={styles.btnRow}>
                <Button
                  title="A- Smaller"
                  size="sm"
                  variant="outline"
                  icon={<ZoomOut size={16} color={themeColors.primary} />}
                  onPress={decreaseFontSize}
                  disabled={fontScale <= 0.9}
                  style={styles.halfBtn}
                  accessibilityLabel="Decrease text size"
                />
                <Button
                  title="A+ Larger"
                  size="sm"
                  variant="primary"
                  icon={<ZoomIn size={16} color="#FFFFFF" />}
                  onPress={increaseFontSize}
                  disabled={fontScale >= 1.4}
                  style={styles.halfBtn}
                  accessibilityLabel="Increase text size"
                />
              </View>
            </View>

            {/* 2. High Contrast Mode Toggle */}
            <View style={styles.settingBlock}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: themeColors.text, fontSize: 15 * fontScale },
                ]}
              >
                High Contrast Theme
              </Text>
              <Button
                title={highContrast ? 'High Contrast Enabled ✓' : 'Enable High Contrast'}
                size="md"
                variant={highContrast ? 'primary' : 'outline'}
                onPress={toggleHighContrast}
                accessibilityLabel={`High contrast is currently ${
                  highContrast ? 'enabled' : 'disabled'
                }. Tap to toggle`}
              />
            </View>

            {/* 3. Text-to-Speech Voice Assistance */}
            <View style={styles.settingBlock}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: themeColors.text, fontSize: 15 * fontScale },
                ]}
              >
                Speech / Voice Assistance
              </Text>
              <Button
                title={soundAssistance ? 'Voice Assistance Active 🔊' : 'Enable Voice Assistance 🔈'}
                size="md"
                variant={soundAssistance ? 'secondary' : 'outline'}
                icon={soundAssistance ? <Volume2 size={18} color="#FFFFFF" /> : <VolumeX size={18} color={themeColors.secondary} />}
                onPress={toggleSoundAssistance}
                accessibilityLabel={`Speech audio assistance is currently ${
                  soundAssistance ? 'active' : 'off'
                }. Tap to toggle voice reading`}
              />
            </View>

            {/* 4. Reset & Close Controls */}
            <View style={styles.footerRow}>
              <Button
                title="Reset Settings"
                size="sm"
                variant="text"
                icon={<RotateCcw size={14} color="#64748B" />}
                onPress={resetSettings}
                accessibilityLabel="Reset all accessibility settings to default"
              />

              <Button
                title="Apply & Close"
                size="md"
                variant="primary"
                onPress={() => setModalVisible(false)}
                accessibilityLabel="Close toolbar"
                style={{ minWidth: 140 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    zIndex: 999,
  },
  floatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    borderTopWidth: 2,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  modalSub: {
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  settingBlock: {
    marginBottom: Spacing.md,
  },
  settingHeader: {
    marginBottom: 8,
  },
  settingLabel: {
    fontWeight: '700',
    marginBottom: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: Spacing.md,
  },
});
