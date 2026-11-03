import React, { useState, useEffect } from 'react';
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
import { MovieFilters, GenreFilter, StatusFilter, GENRE_OPTIONS, STATUS_OPTIONS } from '../types';
import { colors, shadows } from '../theme/colors';

interface FilterBarProps {
  filters: MovieFilters;
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>(filters.search);

  // Debounce search query so user can type smoothly without Android keyboard stutter
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchText);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchText]);

  // Sync if cleared externally (e.g. from Clear All Filters)
  useEffect(() => {
    if (filters.search !== searchText && filters.search === '') {
      setSearchText('');
    }
  }, [filters.search]);

  const allGenres: GenreFilter[] = ['All', ...GENRE_OPTIONS];
  const allStatuses: StatusFilter[] = ['All', ...STATUS_OPTIONS];

  const hasActiveFilters =
    filters.genre !== 'All' ||
    filters.status !== 'All' ||
    filters.favoritesOnly ||
    searchText.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Title or Director..."
            placeholderTextColor={colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                onSearchChange('');
              }}
              style={styles.clearSearchButton}
            >
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
            color={hasActiveFilters ? colors.accent : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Favorites Only Switch Row */}
      <View style={styles.favoritesRow}>
        <View style={styles.switchLabelContainer}>
          <View style={styles.heartCircle}>
            <Ionicons
              name={filters.favoritesOnly ? 'heart' : 'heart-outline'}
              size={16}
              color={filters.favoritesOnly ? colors.favorite : colors.textSecondary}
            />
          </View>
          <Text style={styles.switchLabel}>Favorites Only</Text>
        </View>
        <Switch
          value={filters.favoritesOnly}
          onValueChange={onFavoritesOnlyChange}
          trackColor={{ false: colors.border, true: colors.secondary }}
          thumbColor={filters.favoritesOnly ? colors.favorite : '#FFFFFF'}
        />
      </View>

      {/* Expandable Filter Details (Genre & Status) */}
      {isExpanded && (
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
            <Text style={styles.filterHeading}>Watch Status</Text>
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
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={() => {
                setSearchText('');
                onClear();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={15} color={colors.accent} />
              <Text style={styles.clearAllText}>Clear All Filters</Text>
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
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
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
    backgroundColor: '#FFF9FA',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1.5,
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
    height: '100%',
  },
  clearSearchButton: {
    padding: 4,
  },
  toggleFilterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleFilterBtnActive: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.primary,
  },
  favoritesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSecondary,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterDetails: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSecondary,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.secondarySoft,
    marginTop: 4,
    gap: 6,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
});
