import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileCheck,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import SectorBadge from '../../src/components/jobs/SectorBadge';
import EmptyState from '../../src/components/jobs/EmptyState';
import { useAccessibility } from '../../src/context/AccessibilityContext';
import applicationService from '../../src/services/applicationService';
import { Colors, BorderRadius, Spacing } from '../../src/constants/Colors';

const STATUS_FILTERS = ['All', 'Applied', 'Examination', 'Interview', 'Selected'];

export default function ApplicationsScreen() {
  const router = useRouter();
  const { fontScale, highContrast } = useAccessibility();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const [activeTab, setActiveTab] = useState('All');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadApplications = useCallback(async () => {
    try {
      setError(null);
      const res = await applicationService.getApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      } else {
        setError(res.error || 'Failed to load applications');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to application tracking service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const onRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'All') return true;
    return (app.status || '').toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const s = (status || 'applied').toLowerCase();
    switch (s) {
      case 'applied':
        return { label: 'Applied', bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
      case 'examination':
        return { label: 'Examination', bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
      case 'interview':
        return { label: 'Interview', bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF' };
      case 'selected':
      case 'placed':
        return { label: 'Selected / Placed', bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
      case 'rejected':
        return { label: 'Not Shortlisted', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
      default:
        return { label: status, bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        title="Application Tracker"
        subtitle="Monitor every step from portal submission to joining"
        showBack
        onBack={() => router.back()}
        highContrast={highContrast}
        fontScale={fontScale}
      />

      <View style={styles.container}>
        {/* Status Filter Tabs */}
        <View style={styles.tabBar}>
          {STATUS_FILTERS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabItem, isSelected && styles.tabItemActive]}
                accessible={true}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Filter by ${tab}`}
              >
                <Text
                  style={[
                    styles.tabItemText,
                    isSelected && styles.tabItemTextActive,
                    { fontSize: 12 * fontScale },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Applications List */}
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading your applications...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredApplications}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.primary]}
              />
            }
            renderItem={({ item }) => {
              const badge = getStatusBadge(item.status);
              const job = item.job || {};

              return (
                <Card
                  style={styles.appCard}
                  onPress={() => router.push(`/applications/${item.id}`)}
                  accessibilityLabel={`${job.title || 'Application'} at ${job.organization || ''}. Status: ${badge.label}`}
                >
                  {/* Top Row: Sector & Status Badge */}
                  <View style={styles.appTopRow}>
                    <SectorBadge sector={job.sector || 'Government'} fontScale={fontScale} />
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: badge.bg,
                          borderColor: badge.border,
                        },
                      ]}
                    >
                      <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  {/* Title & Organization */}
                  <Text
                    style={[
                      styles.appJobTitle,
                      { color: theme.text, fontSize: 16 * fontScale },
                    ]}
                  >
                    {job.title || 'Application Record'}
                  </Text>
                  <View style={styles.orgRow}>
                    <Building size={14} color="#64748B" />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.appOrgText,
                        { color: theme.textSecondary, fontSize: 13 * fontScale },
                      ]}
                    >
                      {job.organization || 'Recruiting Authority'}
                    </Text>
                  </View>

                  {/* Dates & Notes */}
                  <View style={styles.metaRow}>
                    <View style={styles.dateCol}>
                      <Clock size={12} color="#64748B" />
                      <Text style={styles.dateText}>
                        Applied: {item.applied_at ? new Date(item.applied_at).toLocaleDateString() : 'Recorded'}
                      </Text>
                    </View>
                  </View>

                  {item.notes ? (
                    <View style={styles.notesBox}>
                      <Text
                        numberOfLines={2}
                        style={[styles.notesText, { fontSize: 12 * fontScale }]}
                      >
                        📝 {item.notes}
                      </Text>
                    </View>
                  ) : null}

                  {/* View Details Action */}
                  <View style={styles.actionRow}>
                    <Text style={[styles.actionText, { color: theme.primary }]}>
                      Update Status & Timeline
                    </Text>
                    <ArrowRight size={14} color={theme.primary} />
                  </View>
                </Card>
              );
            }}
            ListEmptyComponent={
              <EmptyState
                title={
                  activeTab === 'All'
                    ? 'No Applications Recorded Yet'
                    : `No Applications in "${activeTab}"`
                }
                message="When you apply on official government and PSU portals, record your application here to track examination dates, admit cards, and results."
                onReset={() => router.push('/(tabs)/jobs')}
                fontScale={fontScale}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: BorderRadius.sm,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabItemText: {
    fontWeight: '600',
    color: '#64748B',
  },
  tabItemTextActive: {
    color: '#2457A6',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  appCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  appTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  appJobTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  appOrgText: {
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: '#64748B',
    fontSize: 12,
  },
  notesBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  notesText: {
    color: '#334155',
    lineHeight: 17,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  actionText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
