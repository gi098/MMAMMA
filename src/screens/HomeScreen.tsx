import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { FeatureCard } from '../components/FeatureCard';
import { colors, shadows } from '../theme/colors';

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
        {/* Soft Sunset Cloud Background Glow */}
        <View style={styles.glowCloudWrapper}>
          <LinearGradient
            colors={['rgba(250, 209, 220, 0.45)', 'rgba(255, 247, 248, 0)']}
            style={styles.glowCloud}
          />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.brandIconWrapper}
          >
            <Ionicons name="book" size={36} color={colors.textInverse} />
          </LinearGradient>

          <View style={styles.titleBadgeRow}>
            <Ionicons name="sparkles" size={16} color={colors.accent} style={styles.sparkleIcon} />
            <Text testID="home-title" style={styles.title}>
              BookShelf
            </Text>
            <Ionicons name="sparkles" size={16} color={colors.accent} style={styles.sparkleIcon} />
          </View>

          <Text style={styles.tagline}>
            Your cozy romantic reading sanctuary to track, curate, and cherish every story.
          </Text>
        </View>

        {/* Feature Cards Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Highlights</Text>

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
            icon="heart-outline"
            title="Rate your favorites"
            description="Give ratings from 0 to 5, bookmark cherished titles, and curate your top collection."
          />
        </View>

        {/* Action Buttons */}
        {!currentUser && (
          <View style={styles.authButtonsSection}>
            <TouchableOpacity
              style={styles.loginTouch}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginGradient}
              >
                <Ionicons name="log-in-outline" size={19} color={colors.textInverse} style={styles.btnIcon} />
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add-outline" size={19} color={colors.accent} style={styles.btnIcon} />
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
    paddingVertical: 20,
  },
  glowCloudWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  glowCloud: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 26,
  },
  brandIconWrapper: {
    width: 74,
    height: 74,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.floating,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sparkleIcon: {
    marginHorizontal: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  featuresSection: {
    marginBottom: 26,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  authButtonsSection: {
    gap: 12,
    marginBottom: 24,
  },
  loginTouch: {
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.soft,
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  btnIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textInverse,
    letterSpacing: 0.2,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.soft,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.2,
  },
});
