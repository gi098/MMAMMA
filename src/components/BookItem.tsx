import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book, Status } from '../types';
import { colors, shadows } from '../theme/colors';

interface BookItemProps {
  book: Book;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const BookItem: React.FC<BookItemProps> = ({ book, onPress, onToggleFavorite }) => {
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'To Read':
        return { bg: colors.statusToReadBg, text: colors.statusToRead };
      case 'Reading':
        return { bg: colors.statusReadingBg, text: colors.statusReading };
      case 'Finished':
        return { bg: colors.statusFinishedBg, text: colors.statusFinished };
    }
  };

  const getGenreBadge = () => {
    switch (book.genre) {
      case 'Fiction':
        return { bg: colors.genreFictionBg, text: colors.genreFiction };
      case 'Non-Fiction':
        return { bg: colors.genreNonFictionBg, text: colors.genreNonFiction };
      case 'Academic':
        return { bg: colors.genreAcademicBg, text: colors.genreAcademic };
      default:
        return { bg: colors.genreOtherBg, text: colors.genreOther };
    }
  };

  const statusStyle = getStatusBadge(book.status);
  const genreStyle = getGenreBadge();

  return (
    <View testID="book-item" style={styles.card}>
      <TouchableOpacity
        style={styles.mainTouchable}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${book.title}`}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.author} numberOfLines={1}>
              by {book.author}
            </Text>
          </View>

          {/* Favorite Toggle Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={book.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons
              name={book.favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={book.favorite ? colors.favorite : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Badges Row: Genre, Status, Rating */}
        <View style={styles.badgesRow}>
          {/* Genre Badge */}
          <View style={[styles.genreBadge, { backgroundColor: genreStyle.bg }]}>
            <Text style={[styles.genreText, { color: genreStyle.text }]}>{book.genre}</Text>
          </View>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {book.status}
            </Text>
          </View>

          {/* Rating (if provided) */}
          {book.rating !== null && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.ratingStar} style={styles.badgeIcon} />
              <Text style={styles.ratingText}>{book.rating}/5</Text>
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
  author: {
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
