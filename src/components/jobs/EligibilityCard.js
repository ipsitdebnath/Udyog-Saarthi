import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react-native';
import Card from '../common/Card';
import { Colors, Spacing } from '../../constants/Colors';

export default function EligibilityCard({
  educationRequirements = [],
  eligibleCategories = [],
  reservationDetails = {},
  fontScale = 1,
}) {
  const theme = Colors.light;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ShieldCheck size={18} color={theme.primary} />
        <Text style={[styles.heading, { fontSize: 15 * fontScale }]}>
          Eligibility & Reservation Verification
        </Text>
      </View>

      {/* Education Requirements */}
      <Text style={[styles.subheading, { fontSize: 13 * fontScale }]}>
        Minimum Educational Qualification:
      </Text>
      {educationRequirements.map((req, i) => (
        <View key={i} style={styles.itemRow}>
          <CheckCircle2 size={14} color="#059669" style={{ marginTop: 2, marginRight: 6 }} />
          <Text style={[styles.itemText, { fontSize: 13 * fontScale }]}>{req}</Text>
        </View>
      ))}

      {/* Eligible Disability Categories */}
      <Text style={[styles.subheading, { fontSize: 13 * fontScale, marginTop: 12 }]}>
        Verified Eligible Disability Categories:
      </Text>
      <View style={styles.pillsWrap}>
        {eligibleCategories.map((cat, i) => (
          <View key={i} style={styles.pill}>
            <Text style={[styles.pillText, { fontSize: 11 * fontScale }]}>{cat}</Text>
          </View>
        ))}
      </View>

      {/* Age Relaxation */}
      {reservationDetails.ageRelaxation && (
        <View style={styles.relaxationBox}>
          <Text style={[styles.relaxationText, { fontSize: 12 * fontScale }]}>
            ℹ️ <Text style={{ fontWeight: '700' }}>Age Relaxation: </Text>
            {reservationDetails.ageRelaxation}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  heading: {
    fontWeight: '700',
    color: '#172033',
  },
  subheading: {
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemText: {
    color: '#172033',
    flex: 1,
    lineHeight: 18,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  pill: {
    backgroundColor: '#E0F2F1',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillText: {
    color: '#0E635C',
    fontWeight: '600',
  },
  relaxationBox: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
  },
  relaxationText: {
    color: '#334155',
    lineHeight: 18,
  },
});
