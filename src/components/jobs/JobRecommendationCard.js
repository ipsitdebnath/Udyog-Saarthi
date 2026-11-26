import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import Card from '../common/Card';
import SectorBadge from './SectorBadge';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function JobRecommendationCard({
  job,
  matchScore = 85,
  matchReasons = [],
  fontScale = 1,
}) {
  const router = useRouter();
  const theme = Colors.light;

  return (
    <Card
      style={styles.card}
      accessibilityLabel={`Recommended: ${job.title} at ${job.organization}. Match score ${matchScore} percent`}
    >
      <View style={styles.topRow}>
        <View style={styles.scorePill}>
          <Sparkles size={12} color="#0E635C" />
          <Text style={styles.scoreText}>{matchScore}% Match</Text>
        </View>
        <SectorBadge sector={job.sector} fontScale={fontScale} />
      </View>

      <Text
        style={[styles.title, { fontSize: 16 * fontScale }]}
        numberOfLines={1}
      >
        {job.title}
      </Text>
      <Text
        style={[styles.org, { fontSize: 13 * fontScale }]}
        numberOfLines={1}
      >
        {job.organization}
      </Text>

      {/* Match Reasons */}
      <View style={styles.reasonsBox}>
        {matchReasons.map((reason, i) => (
          <View key={i} style={styles.reasonRow}>
            <CheckCircle2 size={13} color="#059669" style={{ marginTop: 2, marginRight: 6 }} />
            <Text style={[styles.reasonText, { fontSize: 12 * fontScale }]}>
              {reason}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => router.push(`/jobs/${job.id}`)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`View recommended job ${job.title}`}
        style={styles.viewBtn}
      >
        <Text style={[styles.viewBtnText, { fontSize: 13 * fontScale }]}>
          Review Recommendation
        </Text>
        <ArrowRight size={14} color={theme.primary} />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
    borderColor: '#99F6E4',
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  scoreText: {
    color: '#0E635C',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontWeight: '700',
    color: '#172033',
    marginBottom: 2,
  },
  org: {
    color: '#64748B',
    marginBottom: 10,
  },
  reasonsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  reasonText: {
    color: '#334155',
    flex: 1,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingVertical: 4,
  },
  viewBtnText: {
    color: '#2457A6',
    fontWeight: '700',
  },
});
