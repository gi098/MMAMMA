import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { FeatureCard } from '../components/FeatureCard';
import { colors } from '../theme/colors';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();

  // If already logged in, redirect directly to List Screen
  useEffect(() => {
    if (currentUser) {
      navigation.replace('List');
    }
  }, [currentUser, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.brandIconWrapper}>
            <Ionicons name="book-sharp" size={38} color={colors.surface} />
          </View>
          <Text testID="home-title" style={styles.title}>
            BookShelf
          </Text>
          <Text style={styles.tagline}>
            Your personal digital sanctuary for organizing, reading, and cherishing books.
          </Text>
        </View>

        {/* Feature Cards Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Key Features</Text>

          <FeatureCard
            icon="library-outline"
            title="Track your books"
            description="Build your personal reading sanctuary, record notes, and keep every title cataloged."
          />

          <FeatureCard
            icon="filter-outline"
            title="Sort by status"
            description="Seamlessly organize what you are currently reading, want to read, or have completed."
          />

          <FeatureCard
            icon="star-outline"
            title="Rate your favorites"
            description="Give ratings from 0 to 5, bookmark cherished titles, and curate your top collection."
          />
        </View>

        {/* Action Buttons */}
        {!currentUser && (
          <View style={styles.authButtonsSection}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in-outline" size={20} color={colors.textInverse} style={styles.btnIcon} />
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add-outline" size={20} color={colors.primary} style={styles.btnIcon} />
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  brandIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  featuresSection: {
    marginBottom: 28,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  authButtonsSection: {
    gap: 12,
    marginBottom: 24,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  btnIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textInverse,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
