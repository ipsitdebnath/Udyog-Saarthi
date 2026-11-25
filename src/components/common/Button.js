import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'text'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon: IconComponent,
  iconPosition = 'left',
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
  highContrast = false,
  fontScale = 1,
}) {
  const themeColors = highContrast ? Colors.highContrast : Colors.light;

  const getBackgroundColor = () => {
    if (disabled) return '#CBD5E1';
    if (variant === 'primary') return themeColors.primary;
    if (variant === 'secondary') return themeColors.secondary;
    if (variant === 'outline' || variant === 'text') return 'transparent';
    return themeColors.primary;
  };

  const getTextColor = () => {
    if (disabled) return '#64748B';
    if (variant === 'primary' || variant === 'secondary') return '#FFFFFF';
    if (variant === 'outline') return themeColors.primary;
    if (variant === 'text') return themeColors.primary;
    return '#FFFFFF';
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return disabled ? '#CBD5E1' : (highContrast ? '#000000' : themeColors.primary);
    }
    return 'transparent';
  };

  const buttonHeight = size === 'sm' ? 44 : size === 'lg' ? 56 : 50;
  const fontSize = (size === 'sm' ? 14 : size === 'lg' ? 18 : 16) * fontScale;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.base,
        {
          minHeight: buttonHeight,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? (highContrast ? 2 : 1.5) : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {IconComponent && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{IconComponent}</View>
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: fontSize,
                fontWeight: highContrast ? '700' : '600',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {IconComponent && iconPosition === 'right' && (
            <View style={styles.iconRight}>{IconComponent}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  text: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
