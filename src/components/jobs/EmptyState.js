import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SearchX, RotateCcw } from 'lucide-react-native';
import Button from '../common/Button';
import { Colors, Spacing } from '../../constants/Colors';

export default function EmptyState({
  title = 'No Opportunities Found',
  message = 'Try adjusting your search criteria or resetting filters to explore all vacancies.',
  onReset,
  fontScale = 1,
}) {
  const theme = Colors.light;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <SearchX size={36} color="#64748B" />
      </View>
      <Text style={[styles.title, { fontSize: 17 * fontScale }]}>{title}</Text>
      <Text style={[styles.message, { fontSize: 13 * fontScale }]}>{message}</Text>
      {onReset && (
        <Button
          title="Reset All Filters"
          size="sm"
          variant="outline"
          icon={<RotateCcw size={14} color={theme.primary} />}
          onPress={onReset}
          style={styles.resetBtn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: Spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontWeight: '700',
    color: '#172033',
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  resetBtn: {
    minWidth: 160,
  },
});
