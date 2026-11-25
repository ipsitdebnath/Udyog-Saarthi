import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Briefcase, ArrowUpRight, Sparkles } from 'lucide-react-native';
import Card from '../common/Card';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function RecommendedJobsSection({
  onViewAllPress,
  highContrast = false,
  fontScale = 1,
}) {
  const router = useRouter();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const sampleOpportunities = [
    {
      id: 'job-1',
      title: 'Data Processing Assistant',
      org: 'Staff Selection Commission (Govt of India)',
      reservation: '4% Quota: Autism, Specific Learning Disability',
      location: 'New Delhi & Regional Offices',
      tag: 'Verified Govt Opportunity',
    },
    {
      id: 'job-2',
      title: 'Office Attendant & Digital Scribe',
      org: 'National Institute for Empowerment (NIEPMD)',
      reservation: 'Eligible: Multiple Disabilities, Intellectual Disability',
      location: 'Chennai / Regional Hubs',
      tag: 'Accommodations Provided',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.text, fontSize: 17 * fontScale },
            ]}
          >
            Recommended Opportunities
          </Text>
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>Day 2 Preview</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/jobs')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View all job opportunities"
          style={styles.viewAllBtn}
        >
          <Text
            style={[
              styles.viewAllText,
              { color: theme.primary, fontSize: 13 * fontScale },
            ]}
          >
            Explore All
          </Text>
          <ArrowUpRight size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.hintText,
          { color: theme.textSecondary, fontSize: 12 * fontScale },
        ]}
      >
        Sample opportunities matched against 4% reservation provisions:
      </Text>

      {sampleOpportunities.map((opp) => (
        <Card
          key={opp.id}
          style={styles.oppCard}
          highContrast={highContrast}
          onPress={() => router.push('/(tabs)/jobs')}
          accessibilityLabel={`${opp.title} at ${opp.org}. ${opp.reservation}`}
        >
          <View style={styles.oppTagRow}>
            <View style={styles.tagPill}>
              <Sparkles size={11} color={theme.secondary} />
              <Text style={styles.tagText}>{opp.tag}</Text>
            </View>
          </View>

          <Text
            style={[
              styles.oppTitle,
              { color: theme.primary, fontSize: 15 * fontScale },
            ]}
          >
            {opp.title}
          </Text>

          <Text
            style={[
              styles.oppOrg,
              { color: theme.text, fontSize: 13 * fontScale },
            ]}
          >
            {opp.org}
          </Text>

          <View style={styles.reservationBox}>
            <Text
              style={[
                styles.reservationText,
                { color: theme.textSecondary, fontSize: 12 * fontScale },
              ]}
            >
              🎯 {opp.reservation}
            </Text>
            <Text
              style={[
                styles.locationText,
                { color: theme.textSecondary, fontSize: 12 * fontScale },
              ]}
            >
              📍 {opp.location}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  previewBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  previewBadgeText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '700',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontWeight: '600',
  },
  hintText: {
    marginBottom: 10,
    lineHeight: 16,
  },
  oppCard: {
    marginBottom: Spacing.sm,
  },
  oppTagRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    color: '#0E635C',
    fontSize: 11,
    fontWeight: '600',
  },
  oppTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  oppOrg: {
    fontWeight: '500',
    marginBottom: 6,
  },
  reservationBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  reservationText: {
    fontWeight: '500',
  },
  locationText: {},
});
