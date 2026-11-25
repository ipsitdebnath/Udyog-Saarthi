import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';
import { Eye, EyeOff } from 'lucide-react-native';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  accessibilityLabel,
  accessibilityHint,
  highContrast = false,
  fontScale = 1,
  style,
  containerStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const themeColors = highContrast ? Colors.highContrast : Colors.light;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isSecured = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: themeColors.text,
              fontSize: 14 * fontScale,
              fontWeight: highContrast ? '700' : '600',
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.surface,
            borderColor: error
              ? themeColors.error
              : isFocused
              ? themeColors.borderFocus
              : themeColors.border,
            borderWidth: isFocused || highContrast ? 2 : 1.5,
            minHeight: multiline ? 80 : 50,
          },
          !editable && styles.disabled,
          style,
        ]}
      >
        {LeftIcon && <View style={styles.leftIcon}>{LeftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={highContrast ? '#555555' : '#94A3B8'}
          secureTextEntry={isSecured}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessible={true}
          accessibilityLabel={accessibilityLabel || label || placeholder}
          accessibilityHint={accessibilityHint}
          accessibilityRole="none"
          style={[
            styles.input,
            {
              color: themeColors.text,
              fontSize: 15 * fontScale,
              textAlignVertical: multiline ? 'top' : 'center',
            },
          ]}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            style={styles.rightAction}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={themeColors.textSecondary} />
            ) : (
              <Eye size={20} color={themeColors.textSecondary} />
            )}
          </TouchableOpacity>
        ) : RightIcon ? (
          <View style={styles.rightAction}>{RightIcon}</View>
        ) : null}
      </View>

      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[
            styles.errorText,
            {
              color: themeColors.error,
              fontSize: 12 * fontScale,
              fontWeight: highContrast ? '700' : '500',
            },
          ]}
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            styles.helperText,
            {
              color: themeColors.textSecondary,
              fontSize: 12 * fontScale,
            },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightAction: {
    padding: 6,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: '#F1F5F9',
  },
  errorText: {
    marginTop: 4,
  },
  helperText: {
    marginTop: 4,
  },
});
