import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Briefcase, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react-native';
import Card from '../common/Card';
import JobRecommendationCard from '../jobs/JobRecommendationCard';
import recommendationService from '../../services/recommendationService';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function RecommendedJobsSection({
  onViewAllPress,
  highContrast = false,
  fontScale = 1,
}) {
  const router = useRouter();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recommendationService.getRecommendations();
      if (res.success && res.data) {
        setRecommendations(res.data.slice(0, 3)); // Top 3 recommendations for dashboard
      } else {
        setError(res.error || 'Failed to load recommendations');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to recommendations engine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
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
          <View style={styles.aiBadge}>
            <Sparkles size={11} color="#059669" />
            <Text style={styles.aiBadgeText}>AI Match</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => (onViewAllPress ? onViewAllPress() : router.push('/(tabs)/jobs'))}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Explore all job opportunities"
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
        Personalized opportunities matching your education, location and 4% reservation quotas:
      </Text>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Matching opportunities to your profile...
          </Text>
        </View>
      ) : error ? (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={fetchRecommendations}
            style={styles.retryBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Retry loading recommendations"
          >
            <RefreshCw size={14} color={theme.primary} />
            <Text style={[styles.retryText, { color: theme.primary }]}>Retry</Text>
          </TouchableOpacity>
        </Card>
      ) : recommendations.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Briefcase size={28} color="#64748B" />
          <Text style={styles.emptyTitle}>No matching jobs right now</Text>
          <Text style={styles.emptySub}>
            Explore all opportunities in the Jobs tab to find active vacancies.
          </Text>
        </Card>
      ) : (
        recommendations.map((rec, index) => (
          <JobRecommendationCard
            key={rec.job?.id || index}
            job={rec.job}
            matchScore={rec.matchScore}
            matchReasons={rec.matchReasons}
            fontScale={fontScale}
          />
        ))
      )}
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
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  aiBadgeText: {
    color: '#065F46',
    fontSize: 10,
    fontWeight: '700',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  viewAllText: {
    fontWeight: '600',
  },
  hintText: {
    marginBottom: 10,
    lineHeight: 16,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  errorCard: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginBottom: 8,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  retryText: {
    fontWeight: '700',
    fontSize: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyTitle: {
    fontWeight: '700',
    color: '#172033',
    marginTop: 8,
    marginBottom: 4,
  },
  emptySub: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
});
