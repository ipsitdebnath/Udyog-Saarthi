import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/Colors';

export default function JobSearchBar({
  value,
  onChangeText,
  onClear,
  onOpenFilters,
  activeFilterCount = 0,
  fontScale = 1,
  placeholder = 'Search by title, organization, skills...',
}) {
  const theme = Colors.light;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search size={18} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          accessible={true}
          accessibilityLabel="Search opportunities"
          accessibilityHint="Type to search by job title, organization, or skills"
          style={[styles.input, { fontSize: 14 * fontScale }]}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value ? (
          <TouchableOpacity
            onPress={onClear}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Clear search text"
            style={styles.clearBtn}
          >
            <X size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={onOpenFilters}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Filter jobs. ${activeFilterCount} active filters`}
        accessibilityHint="Opens filtering options by sector, location, and disability category"
        style={[
          styles.filterButton,
          activeFilterCount > 0 && styles.filterButtonActive,
        ]}
      >
        <SlidersHorizontal
          size={18}
          color={activeFilterCount > 0 ? '#FFFFFF' : theme.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#172033',
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 6,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#2457A6',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2457A6',
    borderColor: '#2457A6',
  },
});
