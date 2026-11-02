import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Book } from '../types';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { Header } from '../components/Header';
import { SummaryCard } from '../components/SummaryCard';
import { FilterBar } from '../components/FilterBar';
import { BookItem } from '../components/BookItem';
import { BookForm } from '../components/BookForm';
import { LoadingView } from '../components/LoadingView';
import { colors } from '../theme/colors';

type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'List'>;

interface ListScreenProps {
  navigation: ListScreenNavigationProp;
}

export const ListScreen: React.FC<ListScreenProps> = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const {
    filteredBooks,
    filters,
    summary,
    loading,
    bookError,
    bookSuccess,
    setGenreFilter,
    setStatusFilter,
    setFavoritesOnly,
    setSearchQuery,
    clearFilters,
    addBook,
    toggleFavorite,
    clearMessages,
  } = useBooks();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Home');
  };

  const renderHeader = () => (
    <View>
      {/* Summary Component with book-count and favorite-count */}
      <SummaryCard summary={summary} />

      {/* Add Book Toggle Button */}
      <View style={styles.addBookBar}>
        <TouchableOpacity
          style={[styles.addBookToggleBtn, showAddForm && styles.addBookToggleBtnActive]}
          onPress={() => setShowAddForm(!showAddForm)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showAddForm ? 'close-circle-outline' : 'add-circle-outline'}
            size={20}
            color={showAddForm ? colors.error : colors.primary}
            style={styles.addIcon}
          />
          <Text
            style={[
              styles.addBookToggleText,
              showAddForm && { color: colors.error },
            ]}
          >
            {showAddForm ? 'Close Add Form' : 'Add New Book'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Book Form Component */}
      {showAddForm && (
        <BookForm
          onSubmit={async (formData) => {
            const res = await addBook(formData);
            return res;
          }}
          onCancel={() => setShowAddForm(false)}
          submitButtonText="Add Book"
          mode="add"
          serverError={bookError}
          serverSuccess={bookSuccess}
          onClearMessages={clearMessages}
        />
      )}

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onGenreChange={setGenreFilter}
        onStatusChange={setStatusFilter}
        onFavoritesOnlyChange={setFavoritesOnly}
        onSearchChange={setSearchQuery}
        onClear={clearFilters}
      />

      {/* Books Section Title */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.listHeading}>Book Collection</Text>
        <Text style={styles.listSubheading}>
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return <LoadingView message="Loading your books..." />;
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBadge}>
          <Ionicons name="book-outline" size={36} color={colors.textMuted} />
        </View>
        <Text testID="books-empty" style={styles.emptyTitle}>
          No books found
        </Text>
        <Text style={styles.emptySubtitle}>
          {filters.search || filters.genre !== 'All' || filters.status !== 'All' || filters.favoritesOnly
            ? 'Try adjusting your search or filters to see your books.'
            : 'Start building your library by tapping "Add New Book" above.'}
        </Text>
      </View>
    );
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <BookItem
      book={item}
      onPress={() => navigation.navigate('Detail', { bookId: item.id })}
      onToggleFavorite={() => toggleFavorite(item.id)}
    />
  );

  return (
    <SafeAreaView testID="list-screen" style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header userEmail={currentUser?.email || null} onLogout={handleLogout} />

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 32,
  },
  addBookBar: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  addBookToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addBookToggleBtnActive: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
  },
  addIcon: {
    marginRight: 6,
  },
  addBookToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
  },
  listHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listSubheading: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
