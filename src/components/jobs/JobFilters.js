import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { X, Check, RotateCcw } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';
import Button from '../common/Button';

export default function JobFilters({
  visible,
  onClose,
  filters,
  onUpdateFilters,
  onClearFilters,
  fontScale = 1,
}) {
  const theme = Colors.light;

  const sectors = ['All', 'Government', 'PSU', 'Private Sector'];
  const locations = [
    'All',
    'Delhi NCR',
    'Chennai',
    'Kolkata',
    'Bengaluru',
    'Mumbai',
    'Bhopal',
    'PAN India',
    'Remote',
  ];
  const educations = [
    'All',
    '10th Pass',
    '12th Pass',
    'Graduate',
  ];
  const disabilities = [
    'All',
    'Autism Spectrum Disorder',
    'Specific Learning Disability',
    'Intellectual Disability',
    'Locomotor Disability',
    'Hearing Impairment',
    'Visual Impairment',
    'Multiple Disabilities',
  ];

  const handleSelect = (key, value) => {
    onUpdateFilters({ ...filters, [key]: value });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheetCard}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { fontSize: 18 * fontScale }]}>
              Filter Opportunities
            </Text>
            <TouchableOpacity
              onPress={onClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
              style={styles.closeBtn}
            >
              <X size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Sector */}
            <Text style={styles.sectionHeading}>Employment Sector</Text>
            <View style={styles.chipGrid}>
              {sectors.map((sec) => {
                const active = (filters.sector || 'All') === sec;
                return (
                  <TouchableOpacity
                    key={sec}
                    onPress={() => handleSelect('sector', sec)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {sec}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Disability Category */}
            <Text style={styles.sectionHeading}>Eligible Disability Category (Verified)</Text>
            <View style={styles.chipGrid}>
              {disabilities.map((cat) => {
                const active = (filters.disabilityCategory || 'All') === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleSelect('disabilityCategory', cat)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Minimum Education */}
            <Text style={styles.sectionHeading}>Minimum Qualification</Text>
            <View style={styles.chipGrid}>
              {educations.map((edu) => {
                const active = (filters.education || 'All') === edu;
                return (
                  <TouchableOpacity
                    key={edu}
                    onPress={() => handleSelect('education', edu)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {edu}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Location */}
            <Text style={styles.sectionHeading}>Job Location</Text>
            <View style={styles.chipGrid}>
              {locations.map((loc) => {
                const active = (filters.location || 'All') === loc;
                return (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => handleSelect('location', loc)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <Button
              title="Clear All"
              size="md"
              variant="outline"
              icon={<RotateCcw size={16} color="#64748B" />}
              onPress={onClearFilters}
              style={{ flex: 1 }}
            />
            <Button
              title="Apply Filters"
              size="md"
              variant="primary"
              onPress={onClose}
              style={{ flex: 1.5 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: Spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontWeight: '700',
    color: '#172033',
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: Spacing.md,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172033',
    marginTop: 12,
    marginBottom: 8,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  chipActive: {
    borderColor: '#2457A6',
    backgroundColor: '#E8F0FE',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#2457A6',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});
