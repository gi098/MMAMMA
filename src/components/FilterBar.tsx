import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookFilters, GenreFilter, StatusFilter, Genre, Status, GENRE_OPTIONS, STATUS_OPTIONS } from '../types';
import { colors } from '../theme/colors';

interface FilterBarProps {
  filters: BookFilters;
  onGenreChange: (genre: GenreFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
  onFavoritesOnlyChange: (favOnly: boolean) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onGenreChange,
  onStatusChange,
  onFavoritesOnlyChange,
  onSearchChange,
  onClear,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const allGenres: GenreFilter[] = ['All', ...GENRE_OPTIONS];
  const allStatuses: StatusFilter[] = ['All', ...STATUS_OPTIONS];

  const hasActiveFilters =
    filters.genre !== 'All' ||
    filters.status !== 'All' ||
    filters.favoritesOnly ||
    filters.search.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Title or Author..."
            placeholderTextColor={colors.textMuted}
            value={filters.search}
            onChangeText={onSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {filters.search.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearSearchButton}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.toggleFilterBtn, (isExpanded || hasActiveFilters) && styles.toggleFilterBtnActive]}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={hasActiveFilters ? colors.primaryDark : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Favorites Only Switch Row */}
      <View style={styles.favoritesRow}>
        <View style={styles.switchLabelContainer}>
          <Ionicons
            name={filters.favoritesOnly ? 'heart' : 'heart-outline'}
            size={18}
            color={filters.favoritesOnly ? colors.favorite : colors.textSecondary}
            style={styles.favIcon}
          />
          <Text style={styles.switchLabel}>Favorites Only</Text>
        </View>
        <Switch
          value={filters.favoritesOnly}
          onValueChange={onFavoritesOnlyChange}
          trackColor={{ false: colors.border, true: colors.favoriteBg }}
          thumbColor={filters.favoritesOnly ? colors.favorite : '#f4f3f4'}
        />
      </View>

      {/* Expandable Filter Details (Genre & Status) */}
      {(isExpanded || hasActiveFilters) && (
        <View style={styles.filterDetails}>
          {/* Genre Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterHeading}>Genre</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {allGenres.map((g) => {
                const isSelected = filters.genre === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => onGenreChange(g)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterHeading}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {allStatuses.map((s) => {
                const isSelected = filters.status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => onStatusChange(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearAllButton} onPress={onClear} activeOpacity={0.7}>
              <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.clearAllText}>Clear all filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: 4,
  },
  toggleFilterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleFilterBtnActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  favoritesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSecondary,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favIcon: {
    marginRight: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.textInverse,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 4,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    gap: 6,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
