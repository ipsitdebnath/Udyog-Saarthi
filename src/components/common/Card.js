import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function Card({
  children,
  onPress,
  style,
  highContrast = false,
  elevated = false,
  accessibilityLabel,
  accessibilityRole = 'none',
}) {
  const themeColors = highContrast ? Colors.highContrast : Colors.light;

  const cardStyle = [
    styles.card,
    {
      backgroundColor: themeColors.card,
      borderColor: highContrast ? '#000000' : themeColors.border,
      borderWidth: highContrast ? 2 : 1,
    },
    elevated && styles.elevated,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessible={true}
        accessibilityRole={accessibilityRole === 'none' ? 'button' : accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={cardStyle}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  elevated: {
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
