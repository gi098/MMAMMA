import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book, Status } from '../types';
import { colors } from '../theme/colors';

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

  const statusStyle = getStatusBadge(book.status);

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
          <View style={styles.genreBadge}>
            <Ionicons name="folder-outline" size={13} color={colors.brown} style={styles.badgeIcon} />
            <Text style={styles.genreText}>{book.genre}</Text>
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
              <Ionicons name="star" size={13} color={colors.amber} style={styles.badgeIcon} />
              <Text style={styles.ratingText}>{book.rating}/5</Text>
            </View>
          )}

          {/* Details Arrow */}
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  mainTouchable: {
    padding: 14,
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
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  author: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSecondary,
  },
  badgeIcon: {
    marginRight: 4,
  },
  genreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brownSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8DED1',
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.brown,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.amberSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amber,
  },
  arrowContainer: {
    marginLeft: 'auto',
    paddingLeft: 4,
  },
});
