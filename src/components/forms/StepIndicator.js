import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function StepIndicator({
  steps,
  currentStep,
  highContrast = false,
  fontScale = 1,
}) {
  const theme = highContrast ? Colors.highContrast : Colors.light;
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.stepTitle,
            { color: theme.text, fontSize: 14 * fontScale },
          ]}
        >
          Section {currentStep + 1} of {steps.length}: <Text style={{ fontWeight: '700' }}>{steps[currentStep]}</Text>
        </Text>
        <Text
          style={[
            styles.percentage,
            { color: theme.primary, fontSize: 13 * fontScale },
          ]}
        >
          {progressPercent}%
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${progressPercent}%`,
              backgroundColor: theme.primary,
            },
          ]}
        />
      </View>

      <View style={styles.pillsRow}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <View
              key={step}
              style={[
                styles.stepPill,
                isCompleted
                  ? { backgroundColor: theme.secondary }
                  : isCurrent
                  ? { backgroundColor: theme.primary }
                  : { backgroundColor: '#E2E8F0' },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontWeight: '500',
  },
  percentage: {
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepPill: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});
