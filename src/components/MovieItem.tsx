import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie, Status } from '../types';
import { colors, shadows } from '../theme/colors';

interface MovieItemProps {
  movie: Movie;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const MovieItem: React.FC<MovieItemProps> = ({ movie, onPress, onToggleFavorite }) => {
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'To Watch':
        return { bg: colors.statusToReadBg, text: colors.statusToRead };
      case 'Watching':
        return { bg: colors.statusReadingBg, text: colors.statusReading };
      case 'Finished':
        return { bg: colors.statusFinishedBg, text: colors.statusFinished };
    }
  };

  const getGenreBadge = () => {
    switch (movie.genre) {
      case 'Action':
        return { bg: colors.genreActionBg, text: colors.genreAction };
      case 'Comedy':
        return { bg: colors.genreComedyBg, text: colors.genreComedy };
      case 'Drama':
        return { bg: colors.genreDramaBg, text: colors.genreDrama };
      case 'Sci-Fi':
        return { bg: colors.genreSciFiBg, text: colors.genreSciFi };
      case 'Animation':
        return { bg: colors.genreAnimationBg, text: colors.genreAnimation };
      case 'Romance':
        return { bg: colors.genreRomanceBg, text: colors.genreRomance };
      case 'Documentary':
        return { bg: colors.genreDocumentaryBg, text: colors.genreDocumentary };
      default:
        return { bg: colors.genreOtherBg, text: colors.genreOther };
    }
  };

  const statusStyle = getStatusBadge(movie.status);
  const genreStyle = getGenreBadge();

  return (
    <View testID="movie-item" style={styles.card}>
      <TouchableOpacity
        style={styles.mainTouchable}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${movie.title}`}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={styles.director} numberOfLines={1}>
              Directed by {movie.director}
            </Text>
          </View>

          {/* Favorite Toggle Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={movie.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons
              name={movie.favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={movie.favorite ? colors.favorite : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Badges Row: Genre, Status, Rating */}
        <View style={styles.badgesRow}>
          {/* Genre Badge */}
          <View style={[styles.genreBadge, { backgroundColor: genreStyle.bg }]}>
            <Text style={[styles.genreText, { color: genreStyle.text }]}>{movie.genre}</Text>
          </View>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {movie.status}
            </Text>
          </View>

          {/* Rating (if provided) */}
          {movie.rating !== null && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.ratingStar} style={styles.badgeIcon} />
              <Text style={styles.ratingText}>{movie.rating}/5</Text>
            </View>
          )}

          {/* Details Arrow */}
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
    overflow: 'hidden',
  },
  mainTouchable: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  director: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSecondary,
  },
  badgeIcon: {
    marginRight: 4,
  },
  genreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 220, 226, 0.5)',
  },
  genreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 220, 226, 0.5)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ratingStarBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 220, 226, 0.5)',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ratingStar,
  },
  arrowContainer: {
    marginLeft: 'auto',
    paddingLeft: 4,
  },
});
