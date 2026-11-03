import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MovieSummary, Status } from '../types';
import { colors, shadows } from '../theme/colors';

interface SummaryCardProps {
  summary: MovieSummary;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const getStatusBadgeStyle = (status: Status) => {
    switch (status) {
      case 'To Watch':
        return {
          bg: colors.statusToReadBg,
          text: colors.statusToRead,
          icon: 'bookmark-outline' as const,
        };
      case 'Watching':
        return {
          bg: colors.statusReadingBg,
          text: colors.statusReading,
          icon: 'play-outline' as const,
        };
      case 'Finished':
        return {
          bg: colors.statusFinishedBg,
          text: colors.statusFinished,
          icon: 'checkmark-circle-outline' as const,
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="sparkles" size={16} color={colors.accent} style={styles.sparkleIcon} />
        <Text style={styles.sectionTitle}>Cinema Overview</Text>
      </View>

      {/* Main Stats: Movie Count & Favorite Count */}
      <View style={styles.topStatsRow}>
        {/* Movie Count Card */}
        <View style={styles.statBox}>
          <LinearGradient
            colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statIconBadge}
          >
            <Ionicons name="film" size={18} color={colors.textInverse} />
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Total Movies</Text>
            <Text testID="movie-count" style={styles.statNumber}>
              {summary.movieCount}
            </Text>
          </View>
        </View>

        {/* Favorite Count Card */}
        <View style={styles.statBox}>
          <View style={[styles.statIconBadge, { backgroundColor: colors.favoriteBg }]}>
            <Ionicons name="heart" size={20} color={colors.favorite} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Favorites</Text>
            <Text testID="favorite-count" style={[styles.statNumber, { color: colors.accent }]}>
              {summary.favoriteCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Status Breakdown Section */}
      <View style={styles.statusDivider} />
      <Text style={styles.statusSectionHeading}>Watch Status</Text>
      <View style={styles.statusBreakdownRow}>
        {summary.statusCounts.map((item) => {
          const badge = getStatusBadgeStyle(item.status);
          return (
            <View
              key={item.status}
              style={[styles.statusPill, { backgroundColor: badge.bg }]}
            >
              <Ionicons name={badge.icon} size={14} color={badge.text} style={styles.statusIcon} />
              <Text style={[styles.statusLabel, { color: badge.text }]}>
                {item.status}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: badge.text }]}>
                <Text style={styles.countBadgeText}>{item.count}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sparkleIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  topStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  statusSectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  statusBreakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusPill: {
    flex: 1,
    minWidth: 98,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(242, 220, 226, 0.6)',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 6,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
