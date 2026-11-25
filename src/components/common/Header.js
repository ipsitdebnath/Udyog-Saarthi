import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '../../constants/Colors';
import { ChevronLeft, Eye, Volume2 } from 'lucide-react-native';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  onAccessibilityPress,
  highContrast = false,
  fontScale = 1,
}) {
  const themeColors = highContrast ? Colors.highContrast : Colors.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface,
          borderBottomColor: highContrast ? '#000000' : themeColors.border,
          borderBottomWidth: highContrast ? 2 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back to previous screen"
            style={styles.backButton}
          >
            <ChevronLeft size={28} color={themeColors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: themeColors.text,
                fontSize: 18 * fontScale,
                fontWeight: highContrast ? '700' : '600',
              },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                {
                  color: themeColors.textSecondary,
                  fontSize: 12 * fontScale,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightActionsContainer}>
          {onAccessibilityPress && (
            <TouchableOpacity
              onPress={onAccessibilityPress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Open accessibility toolbar"
              accessibilityHint="Adjust text size, contrast, or audio assistance"
              style={styles.actionBtn}
            >
              <Eye size={22} color={themeColors.primary} />
            </TouchableOpacity>
          )}
          {rightAction}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  placeholder: {
    width: 44,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    textAlign: 'center',
  },
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
