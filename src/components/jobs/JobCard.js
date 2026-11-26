import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Bookmark, BookmarkCheck, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react-native';
import Card from '../common/Card';
import SectorBadge from './SectorBadge';
import DeadlineBadge from './DeadlineBadge';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function JobCard({
  job,
  onToggleSave,
  fontScale = 1,
  highContrast = false,
}) {
  const router = useRouter();
  const theme = highContrast ? Colors.highContrast : Colors.light;

  const categories = job.eligible_disability_categories || [];
  const displayCategories = categories.slice(0, 2);
  const remainingCount = categories.length - 2;

  const handlePressDetails = () => {
    router.push(`/jobs/${job.id}`);
  };

  return (
    <Card
      style={styles.card}
      highContrast={highContrast}
      accessibilityLabel={`${job.title} at ${job.organization}. Location: ${job.location}`}
    >
      {/* Top Meta Row */}
      <View style={styles.topRow}>
        <View style={styles.badgeCluster}>
          <SectorBadge sector={job.sector} fontScale={fontScale} />
          {job.is_demo && (
            <View style={styles.demoBadge}>
              <Text style={styles.demoText}>DEMO DATA</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onToggleSave && onToggleSave(job)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={job.is_saved ? 'Remove bookmark' : 'Save opportunity'}
          accessibilityHint="Bookmarks this opportunity to your saved jobs"
          style={styles.bookmarkBtn}
        >
          {job.is_saved ? (
            <BookmarkCheck size={22} color={theme.primary} />
          ) : (
            <Bookmark size={22} color="#94A3B8" />
          )}
        </TouchableOpacity>
      </View>

      {/* Title & Organization */}
      <TouchableOpacity
        onPress={handlePressDetails}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${job.title}`}
      >
        <Text
          style={[
            styles.title,
            { color: theme.text, fontSize: 16 * fontScale },
          ]}
        >
          {job.title}
        </Text>
        <Text
          style={[
            styles.organization,
            { color: theme.textSecondary, fontSize: 13 * fontScale },
          ]}
        >
          {job.organization}
        </Text>
      </TouchableOpacity>

      {/* Location and Deadline Row */}
      <View style={styles.infoRow}>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#64748B" style={{ marginRight: 4 }} />
          <Text
            numberOfLines={1}
            style={[
              styles.locationText,
              { color: '#475569', fontSize: 12 * fontScale },
            ]}
          >
            {job.location}
          </Text>
        </View>

        <DeadlineBadge deadline={job.application_deadline} fontScale={fontScale} />
      </View>

      {/* Verified Disability Eligibility Tags */}
      {displayCategories.length > 0 && (
        <View style={styles.categoriesRow}>
          <ShieldCheck size={13} color="#0E635C" style={{ marginRight: 4 }} />
          {displayCategories.map((cat) => (
            <View key={cat} style={styles.catPill}>
              <Text style={styles.catText}>{cat}</Text>
            </View>
          ))}
          {remainingCount > 0 && (
            <View style={styles.catPillMore}>
              <Text style={styles.catTextMore}>+{remainingCount} more</Text>
            </View>
          )}
        </View>
      )}

      {/* Reservation Quota */}
      {job.reservation_details?.quota && (
        <View style={styles.reservationBox}>
          <Text
            numberOfLines={1}
            style={[styles.reservationText, { fontSize: 11 * fontScale }]}
          >
            🎯 {job.reservation_details.quota}
          </Text>
        </View>
      )}

      {/* View Details Action Button */}
      <TouchableOpacity
        onPress={handlePressDetails}
        activeOpacity={0.85}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`View details and application guidelines for ${job.title}`}
        style={[
          styles.actionButton,
          { backgroundColor: theme.primary },
        ]}
      >
        <Text style={[styles.actionButtonText, { fontSize: 14 * fontScale }]}>
          View Details & Apply
        </Text>
        <ArrowRight size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  demoText: {
    color: '#991B1B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bookmarkBtn: {
    padding: 6,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
    lineHeight: 22,
  },
  organization: {
    fontWeight: '500',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  locationText: {
    fontWeight: '500',
  },
  categoriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  catPill: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '600',
  },
  catPillMore: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catTextMore: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  reservationBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  reservationText: {
    color: '#334155',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    borderRadius: BorderRadius.md,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
