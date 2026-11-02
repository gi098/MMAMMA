import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList, BookFormData, Status } from '../types';
import { useBooks } from '../context/BookContext';
import { BookForm } from '../components/BookForm';
import { ConfirmModal } from '../components/ConfirmModal';
import { colors, shadows } from '../theme/colors';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

interface DetailScreenProps {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { getBookById, updateBook, deleteBook, toggleFavorite, bookError, clearMessages } =
    useBooks();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const book = getBookById(bookId);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.accent} />
          <Text style={styles.notFoundText}>Book not found</Text>
          <TouchableOpacity
            style={styles.backToListTouch}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
              style={styles.backToListGradient}
            >
              <Text style={styles.backToListText}>Back to Library</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

  const handleUpdate = async (formData: BookFormData) => {
    const res = await updateBook(book.id, formData);
    if (res.success) {
      setIsEditing(false);
      clearMessages();
    }
    return res;
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    const res = await deleteBook(book.id);
    if (res.success) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.navIconButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>
          {isEditing ? 'Edit Book' : 'Book Details'}
        </Text>
        <TouchableOpacity
          style={styles.navIconButton}
          onPress={() => toggleFavorite(book.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={book.favorite ? 'heart' : 'heart-outline'}
            size={24}
            color={book.favorite ? colors.favorite : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isEditing ? (
          /* Edit Mode */
          <BookForm
            initialValues={{
              title: book.title,
              author: book.author,
              genre: book.genre,
              status: book.status,
              rating: book.rating !== null ? book.rating.toString() : '',
              notes: book.notes || '',
            }}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditing(false);
              clearMessages();
            }}
            submitButtonText="Save Changes"
            mode="edit"
            serverError={bookError}
            onClearMessages={clearMessages}
          />
        ) : (
          /* View Mode */
          <View style={styles.viewContainer}>
            {/* Main Header Card */}
            <View style={styles.headerCard}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bookIconBadge}
              >
                <Ionicons name="book" size={32} color={colors.textInverse} />
              </LinearGradient>

              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>by {book.author}</Text>

              {/* Status and Genre Badges */}
              <View style={styles.badgesRow}>
                <View style={[styles.genreBadge, { backgroundColor: genreStyle.bg }]}>
                  <Text style={[styles.genreText, { color: genreStyle.text }]}>{book.genre}</Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {book.status}
                  </Text>
                </View>

                {book.favorite && (
                  <View style={styles.favBadge}>
                    <Ionicons name="heart" size={13} color={colors.favorite} style={styles.badgeIcon} />
                    <Text style={styles.favBadgeText}>Favorite</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Rating Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionHeading}>Rating</Text>
              {book.rating !== null ? (
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= (book.rating ?? 0) ? 'star' : 'star-outline'}
                      size={22}
                      color={colors.ratingStar}
                      style={styles.starIcon}
                    />
                  ))}
                  <Text style={styles.ratingScore}>{book.rating} / 5</Text>
                </View>
              ) : (
                <Text style={styles.emptyFieldText}>No rating provided</Text>
              )}
            </View>

            {/* Notes Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionHeading}>Personal Notes</Text>
              {book.notes && book.notes.trim().length > 0 ? (
                <Text style={styles.notesText}>{book.notes}</Text>
              ) : (
                <Text style={styles.emptyFieldText}>No notes recorded for this book.</Text>
              )}
            </View>

            {/* Action Buttons: Edit and Delete */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.editTouch}
                onPress={() => setIsEditing(true)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.editGradient}
                >
                  <Ionicons name="create-outline" size={18} color={colors.textInverse} style={styles.btnIcon} />
                  <Text style={styles.editButtonText}>Edit Book</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setShowDeleteModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color={colors.accent} style={styles.btnIcon} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Book"
        message={`Are you sure you want to remove "${book.title}" from your bookshelf? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.soft,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  navIconButton: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 20,
  },
  backToListTouch: {
    borderRadius: 14,
    overflow: 'hidden',
    ...shadows.soft,
  },
  backToListGradient: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backToListText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textInverse,
  },
  viewContainer: {
    gap: 16,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  bookIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.soft,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 28,
  },
  author: {
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(242, 220, 226, 0.5)',
  },
  genreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(242, 220, 226, 0.5)',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  favBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.favoriteBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(242, 220, 226, 0.5)',
  },
  favBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.favorite,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 4,
  },
  ratingScore: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  emptyFieldText: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  notesText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editTouch: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
    ...shadows.soft,
  },
  editGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorBg,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  btnIcon: {
    marginRight: 6,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textInverse,
    letterSpacing: 0.2,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.accent,
  },
});
