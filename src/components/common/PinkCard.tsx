import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows } from '../../theme/colors';

interface PinkCardProps {
  children: ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export const PinkCard: React.FC<PinkCardProps> = ({ children, style, testID }) => {
  return (
    <View testID={testID} style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    ...shadows.card,
  },
});

