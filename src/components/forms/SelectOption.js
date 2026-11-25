import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function SelectOption({
  label,
  description,
  selected,
  onSelect,
  highContrast = false,
  fontScale = 1,
}) {
  const theme = highContrast ? Colors.highContrast : Colors.light;

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}. ${description || ''}`}
      style={[
        styles.container,
        {
          backgroundColor: selected ? (highContrast ? '#E8F0FE' : '#F0F6FF') : theme.surface,
          borderColor: selected
            ? theme.primary
            : highContrast
            ? '#000000'
            : theme.border,
          borderWidth: selected || highContrast ? 2 : 1,
        },
      ]}
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            {
              color: selected ? theme.primary : theme.text,
              fontSize: 14 * fontScale,
              fontWeight: selected || highContrast ? '700' : '600',
            },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              {
                color: theme.textSecondary,
                fontSize: 12 * fontScale,
              },
            ]}
          >
            {description}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.radioCircle,
          {
            borderColor: selected ? theme.primary : '#94A3B8',
            backgroundColor: selected ? theme.primary : 'transparent',
          },
        ]}
      >
        {selected && <Check size={12} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    marginBottom: 2,
  },
  description: {
    lineHeight: 16,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
