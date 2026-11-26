import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FileCheck, Clock, Award, Building2, ChevronRight } from 'lucide-react-native';
import Card from '../common/Card';
import applicationService from '../../services/applicationService';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function ApplicationProgressCard({
  highContrast = false,
  fontScale = 1,
}) {
  const router = useRouter();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const [stats, setStats] = useState({
    total: 0,
    saved: 0,
    applied: 0,
    examination: 0,
    interview: 0,
    placed: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await applicationService.getApplicationStats();
        if (isMounted && res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.warn('Error loading application stats:', err);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const stages = [
    { label: 'Saved', count: stats.saved || 0, active: false },
    { label: 'Applied', count: stats.applied || 0, active: stats.applied > 0 },
    { label: 'Exam', count: stats.examination || 0, active: stats.examination > 0 },
    { label: 'Interview', count: stats.interview || 0, active: stats.interview > 0 },
    { label: 'Placed', count: stats.placed || 0, active: stats.placed > 0 },
  ];

  return (
    <Card
      style={styles.card}
      highContrast={highContrast}
      onPress={() => router.push('/applications')}
      accessibilityLabel={`Employment Journey Tracker. ${stats.total} recorded applications. Tap to view tracker.`}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text
            style={[
              styles.title,
              { color: theme.text, fontSize: 16 * fontScale },
            ]}
          >
            Employment Journey Tracker
          </Text>
          <ChevronRight size={18} color="#64748B" />
        </View>
        <Text
          style={[
            styles.sub,
            { color: theme.textSecondary, fontSize: 12 * fontScale },
          ]}
        >
          Track every step from discover to placement
        </Text>
      </View>

      {/* Stage Flow Counters */}
      <View style={styles.flowRow}>
        {stages.map((stage) => (
          <View key={stage.label} style={styles.stageCol}>
            <View
              style={[
                styles.badgeCircle,
                stage.active
                  ? { backgroundColor: theme.primary, borderColor: theme.primary }
                  : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  {
                    color: stage.active ? '#FFFFFF' : '#475569',
                    fontSize: 13 * fontScale,
                  },
                ]}
              >
                {stage.count}
              </Text>
            </View>
            <Text
              style={[
                styles.stageLabel,
                {
                  color: stage.active ? theme.primary : theme.textSecondary,
                  fontWeight: stage.active ? '700' : '500',
                  fontSize: 11 * fontScale,
                },
              ]}
            >
              {stage.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Active Application Highlight */}
      <View style={styles.highlightBox}>
        <View style={styles.instRow}>
          <Building2 size={16} color={theme.primary} />
          <Text
            numberOfLines={1}
            style={[
              styles.instName,
              { color: theme.text, fontSize: 13 * fontScale },
            ]}
          >
            NIEPMD, Ministry of Social Justice
          </Text>
        </View>

        <Text
          style={[
            styles.jobTitle,
            { color: theme.primary, fontSize: 14 * fontScale },
          ]}
        >
          Junior Secretariat Assistant (PwD Quota)
        </Text>

        <View style={styles.statusPillRow}>
          <View style={styles.statusPill}>
            <Clock size={12} color="#059669" />
            <Text style={styles.statusPillText}>Admit Card Issued • Exam: 15 Dec 2026</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontWeight: '700',
  },
  sub: {
    lineHeight: 16,
  },
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  stageCol: {
    alignItems: 'center',
    flex: 1,
  },
  badgeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 4,
  },
  countText: {
    fontWeight: '700',
  },
  stageLabel: {
    textAlign: 'center',
  },
  highlightBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  instRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  instName: {
    fontWeight: '600',
    flex: 1,
  },
  jobTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
  statusPillRow: {
    flexDirection: 'row',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  statusPillText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '600',
  },
});
