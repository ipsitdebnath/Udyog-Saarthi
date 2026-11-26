import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark, Sparkles, Filter, Briefcase } from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import JobSearchBar from '../../src/components/jobs/JobSearchBar';
import JobCard from '../../src/components/jobs/JobCard';
import JobFilters from '../../src/components/jobs/JobFilters';
import EmptyState from '../../src/components/jobs/EmptyState';
import { useAccessibility } from '../../src/context/AccessibilityContext';
import jobService from '../../src/services/jobService';
import { Colors, BorderRadius, Spacing } from '../../src/constants/Colors';

const SECTORS = ['All', 'Government', 'PSU', 'Private Sector'];

export default function JobsScreen() {
  const { fontScale, highContrast, soundAssistance, speak } = useAccessibility();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  // View state: 'all' | 'saved'
  const [activeTab, setActiveTab] = useState('all');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    sector: 'All',
    location: 'All',
    education: 'All',
    disabilityCategory: 'All',
  });

  // Data state
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Debounce timer ref
  const searchTimeoutRef = useRef(null);

  // Count active filters (excluding 'All')
  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== 'All'
  ).length;

  // Fetch opportunities
  const loadJobs = useCallback(
    async (query = searchQuery, currentFilters = filters) => {
      try {
        setError(null);
        const params = {
          search: query.trim() || undefined,
          sector: currentFilters.sector !== 'All' ? currentFilters.sector : undefined,
          location: currentFilters.location !== 'All' ? currentFilters.location : undefined,
          education: currentFilters.education !== 'All' ? currentFilters.education : undefined,
          disabilityCategory:
            currentFilters.disabilityCategory !== 'All'
              ? currentFilters.disabilityCategory
              : undefined,
        };

        const result = await jobService.getJobs(params);
        if (result.success) {
          setJobs(result.data || []);
        } else {
          setError(result.error || 'Failed to fetch jobs');
        }
      } catch (err) {
        setError(err.message || 'Error connecting to opportunities service');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchQuery, filters]
  );

  // Fetch saved jobs
  const loadSavedJobs = useCallback(async () => {
    try {
      const result = await jobService.getSavedJobs();
      if (result.success) {
        setSavedJobs(result.data || []);
      }
    } catch (err) {
      console.warn('Error fetching saved jobs:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadJobs(searchQuery, filters);
    loadSavedJobs();
  }, []);

  // Debounced search trigger
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      loadJobs(text, filters);
    }, 400);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadJobs('', filters);
  };

  // Filter handlers
  const handleUpdateFilters = (newFilters) => {
    setFilters(newFilters);
    loadJobs(searchQuery, newFilters);
  };

  const handleClearFilters = () => {
    const reset = {
      sector: 'All',
      location: 'All',
      education: 'All',
      disabilityCategory: 'All',
    };
    setFilters(reset);
    loadJobs(searchQuery, reset);
  };

  const handleSectorSelect = (sector) => {
    const updated = { ...filters, sector };
    setFilters(updated);
    loadJobs(searchQuery, updated);
  };

  // Bookmark toggle
  const handleToggleSave = async (job) => {
    const newSavedStatus = !job.is_saved;
    // Optimistic UI update
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, is_saved: newSavedStatus } : j))
    );

    if (newSavedStatus) {
      setSavedJobs((prev) => [...prev, { ...job, is_saved: true }]);
      if (soundAssistance) speak(`Saved ${job.title} to your bookmarks`);
    } else {
      setSavedJobs((prev) => prev.filter((j) => j.id !== job.id));
      if (soundAssistance) speak(`Removed ${job.title} from bookmarks`);
    }

    const res = await jobService.toggleSaveJob(job.id, !newSavedStatus);
    if (!res.success) {
      // Revert if failed
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, is_saved: !newSavedStatus } : j))
      );
      loadSavedJobs();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs(searchQuery, filters);
    loadSavedJobs();
  };

  // Display list based on active tab
  const displayedJobs = activeTab === 'all' ? jobs : savedJobs;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        title="Explore Opportunities"
        subtitle="Verified inclusive vacancies with reservation analysis"
        highContrast={highContrast}
        fontScale={fontScale}
      />

      {/* Main Container */}
      <View style={styles.container}>
        {/* Search Bar */}
        <JobSearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onClear={handleClearSearch}
          onOpenFilters={() => setFilterModalVisible(true)}
          activeFilterCount={activeFilterCount}
          fontScale={fontScale}
        />

        {/* View Switcher: All vs Saved */}
        <View style={styles.tabToggleRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            style={[
              styles.tabBtn,
              activeTab === 'all' && styles.tabBtnActive,
            ]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'all' }}
            accessibilityLabel={`All Opportunities, ${jobs.length} listings`}
          >
            <Briefcase
              size={15}
              color={activeTab === 'all' ? '#2457A6' : '#64748B'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'all' && styles.tabBtnTextActive,
                { fontSize: 13 * fontScale },
              ]}
            >
              All Opportunities ({jobs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('saved')}
            style={[
              styles.tabBtn,
              activeTab === 'saved' && styles.tabBtnActive,
            ]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'saved' }}
            accessibilityLabel={`Saved Opportunities, ${savedJobs.length} listings`}
          >
            <Bookmark
              size={15}
              color={activeTab === 'saved' ? '#2457A6' : '#64748B'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'saved' && styles.tabBtnTextActive,
                { fontSize: 13 * fontScale },
              ]}
            >
              Saved ({savedJobs.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sector Quick Pills (shown when viewing All) */}
        {activeTab === 'all' && (
          <View style={styles.sectorPillsRow}>
            {SECTORS.map((sec) => {
              const isSelected = filters.sector === sec;
              return (
                <TouchableOpacity
                  key={sec}
                  onPress={() => handleSectorSelect(sec)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${sec}`}
                  style={[
                    styles.sectorChip,
                    isSelected && styles.sectorChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.sectorChipText,
                      isSelected && styles.sectorChipTextSelected,
                      { fontSize: 12 * fontScale },
                    ]}
                  >
                    {sec}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Active Filters Tag Bar (when filters are applied) */}
        {activeFilterCount > 0 && activeTab === 'all' && (
          <View style={styles.activeFiltersBar}>
            <Text style={styles.activeFiltersLabel}>Filters: </Text>
            {filters.sector !== 'All' && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>{filters.sector}</Text>
              </View>
            )}
            {filters.disabilityCategory !== 'All' && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>{filters.disabilityCategory}</Text>
              </View>
            )}
            {filters.education !== 'All' && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>{filters.education}</Text>
              </View>
            )}
            {filters.location !== 'All' && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>{filters.location}</Text>
              </View>
            )}
            <TouchableOpacity onPress={handleClearFilters} style={styles.clearFiltersLink}>
              <Text style={styles.clearFiltersText}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Job List / Loading / Empty State */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading opportunities...
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayedJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JobCard
                job={item}
                onToggleSave={handleToggleSave}
                fontScale={fontScale}
                highContrast={highContrast}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                title={activeTab === 'saved' ? 'No Saved Jobs Yet' : 'No Opportunities Found'}
                message={
                  activeTab === 'saved'
                    ? 'Save interesting vacancies by tapping the bookmark icon to review and apply later.'
                    : 'Try clearing your filters or searching for another keyword.'
                }
                onReset={activeTab === 'all' && activeFilterCount > 0 ? handleClearFilters : null}
                fontScale={fontScale}
              />
            }
          />
        )}
      </View>

      {/* Filter Modal Sheet */}
      <JobFilters
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onClearFilters={handleClearFilters}
        fontScale={fontScale}
      />
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
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.sm,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#2457A6',
    fontWeight: '700',
  },
  sectorPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  sectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectorChipSelected: {
    backgroundColor: '#2457A6',
    borderColor: '#2457A6',
  },
  sectorChipText: {
    fontWeight: '600',
    color: '#475569',
  },
  sectorChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeFiltersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
    paddingVertical: 4,
  },
  activeFiltersLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  activePill: {
    backgroundColor: '#E8F0FE',
    borderWidth: 1,
    borderColor: '#C2D7FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activePillText: {
    fontSize: 11,
    color: '#2457A6',
    fontWeight: '600',
  },
  clearFiltersLink: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  clearFiltersText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
