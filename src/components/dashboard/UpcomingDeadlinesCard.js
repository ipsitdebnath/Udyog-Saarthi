import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, AlertCircle } from 'lucide-react-native';
import Card from '../common/Card';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function UpcomingDeadlinesCard({
  highContrast = false,
  fontScale = 1,
}) {
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const deadlines = [
    {
      id: '1',
      title: 'NIEPMD Junior Assistant Exam',
      date: '15 Dec 2026',
      daysLeft: '20 days left',
      urgent: false,
    },
    {
      id: '2',
      title: 'Railways Group D PwD Reservation Application',
      date: '20 Dec 2026',
      daysLeft: '25 days left',
      urgent: false,
    },
  ];

  return (
    <Card
      style={styles.card}
      highContrast={highContrast}
      accessibilityLabel="Upcoming deadlines section: 2 active recruitment milestones"
    >
      <View style={styles.header}>
        <Calendar size={18} color={theme.primary} />
        <Text
          style={[
            styles.title,
            { color: theme.text, fontSize: 16 * fontScale },
          ]}
        >
          Upcoming Deadlines
        </Text>
      </View>

      {deadlines.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.dot} />
          <View style={styles.itemContent}>
            <Text
              style={[
                styles.itemTitle,
                { color: theme.text, fontSize: 13 * fontScale },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.itemDate,
                { color: theme.textSecondary, fontSize: 12 * fontScale },
              ]}
            >
              {item.date} • <Text style={{ color: '#D97706', fontWeight: '600' }}>{item.daysLeft}</Text>
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2457A6',
    marginTop: 6,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  itemDate: {
    lineHeight: 16,
  },
});
