import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList, Movie } from '../types';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import { Header } from '../components/Header';
import { SummaryCard } from '../components/SummaryCard';
import { FilterBar } from '../components/FilterBar';
import { MovieItem } from '../components/MovieItem';
import { MovieForm } from '../components/MovieForm';
import { LoadingView } from '../components/LoadingView';
import { colors, shadows } from '../theme/colors';

type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'List'>;

interface ListScreenProps {
  navigation: ListScreenNavigationProp;
}

export const ListScreen: React.FC<ListScreenProps> = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const {
    filteredMovies,
    filters,
    summary,
    loading,
    movieError,
    movieSuccess,
    setGenreFilter,
    setStatusFilter,
    setFavoritesOnly,
    setSearchQuery,
    clearFilters,
    addMovie,
    toggleFavorite,
    clearMessages,
  } = useMovies();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Home');
  };

  const renderHeader = () => (
    <View>
      {/* Summary Component with movie-count and favorite-count */}
      <SummaryCard summary={summary} />

      {/* Add Movie Toggle Button */}
      <View style={styles.addMovieBar}>
        <TouchableOpacity
          style={[styles.addMovieToggleBtn, showAddForm && styles.addMovieToggleBtnActive]}
          onPress={() => setShowAddForm(!showAddForm)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showAddForm ? 'close-circle-outline' : 'add-circle-outline'}
            size={20}
            color={showAddForm ? colors.accent : colors.accent}
            style={styles.addIcon}
          />
          <Text
            style={[
              styles.addMovieToggleText,
              showAddForm && { color: colors.accent },
            ]}
          >
            {showAddForm ? 'Close Add Form' : 'Add New Movie'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Movie Form Component */}
      {showAddForm && (
        <MovieForm
          onSubmit={async (formData) => {
            const res = await addMovie(formData);
            return res;
          }}
          onCancel={() => setShowAddForm(false)}
          submitButtonText="Add Movie"
          mode="add"
          serverError={movieError}
          serverSuccess={movieSuccess}
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

      {/* Movies Section Title */}
      <View style={styles.listHeaderRow}>
        <View style={styles.listHeadingWrapper}>
          <Ionicons name="sparkles" size={14} color={colors.accent} style={styles.headingSparkle} />
          <Text style={styles.listHeading}>Movie Collection</Text>
        </View>
        <Text style={styles.listSubheading}>
          {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return <LoadingView message="Loading your movies..." />;
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBadge}>
          <Ionicons name="film-outline" size={38} color={colors.primary} />
        </View>
        <Text testID="movies-empty" style={styles.emptyTitle}>
          No movies found
        </Text>
        <Text style={styles.emptySubtitle}>
          {filters.search || filters.genre !== 'All' || filters.status !== 'All' || filters.favoritesOnly
            ? 'Try adjusting your search or filters to see your movies.'
            : 'Start building your personal cinema sanctuary by tapping "Add New Movie" above.'}
        </Text>
      </View>
    );
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieItem
      movie={item}
      onPress={() => navigation.navigate('Detail', { movieId: item.id })}
      onToggleFavorite={() => toggleFavorite(item.id)}
    />
  );

  return (
    <SafeAreaView testID="list-screen" style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        userEmail={currentUser?.email || null}
        userName={currentUser?.displayName || null}
        onLogout={handleLogout}
      />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id}
        renderItem={renderMovieItem}
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
    paddingBottom: 36,
  },
  addMovieBar: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  addMovieToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.soft,
  },
  addMovieToggleBtnActive: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
  },
  addIcon: {
    marginRight: 6,
  },
  addMovieToggleText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.2,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
  },
  listHeadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingSparkle: {
    marginRight: 6,
  },
  listHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  listSubheading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
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
