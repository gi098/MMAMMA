import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="book" size={20} color={colors.surface} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.appName}>BookShelf</Text>
          {Boolean(userEmail) && (
            <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="middle">
              {userEmail}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Logout"
      >
        <Ionicons name="log-out-outline" size={18} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 4,
  },
});
