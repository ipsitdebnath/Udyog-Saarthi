import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, ArrowRight } from 'lucide-react-native';
import Card from '../common/Card';
import Button from '../common/Button';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function ProfileProgressCard({
  percentage = 65,
  missingSection = 'Functional Support & Accommodations',
  onCompletePress,
  highContrast = false,
  fontScale = 1,
}) {
  const theme = highContrast ? Colors.highContrast : Colors.light;

  return (
    <Card
      style={styles.card}
      highContrast={highContrast}
      accessibilityLabel={`Profile completion status: ${percentage}% completed. Next step: ${missingSection}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text
            style={[
              styles.title,
              { color: theme.text, fontSize: 16 * fontScale },
            ]}
          >
            Saarthi Profile Strength
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary, fontSize: 12 * fontScale },
            ]}
          >
            A complete profile unlocks personalized 4% reservation matching
          </Text>
        </View>

        <View
          style={[
            styles.percentagePill,
            { backgroundColor: percentage > 75 ? '#ECFDF5' : '#E8F0FE' },
          ]}
        >
          <Text
            style={[
              styles.percentageText,
              { color: percentage > 75 ? '#059669' : '#2457A6', fontSize: 14 * fontScale },
            ]}
          >
            {percentage}%
          </Text>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: percentage > 75 ? '#059669' : theme.primary,
            },
          ]}
        />
      </View>

      <View style={styles.nextStepRow}>
        <CheckCircle2 size={16} color={theme.secondary} />
        <Text
          numberOfLines={1}
          style={[
            styles.nextStepText,
            { color: theme.text, fontSize: 13 * fontScale },
          ]}
        >
          Next: <Text style={{ fontWeight: '600' }}>{missingSection}</Text>
        </Text>
      </View>

      <Button
        title="Complete Profile"
        size="sm"
        variant="primary"
        icon={<ArrowRight size={16} color="#FFFFFF" />}
        iconPosition="right"
        onPress={onCompletePress}
        highContrast={highContrast}
        fontScale={fontScale}
        accessibilityLabel="Complete profile: Open multi-section setup"
        style={styles.button}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 16,
  },
  percentagePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  percentageText: {
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  nextStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  nextStepText: {
    flex: 1,
  },
  button: {
    marginTop: 2,
  },
});
