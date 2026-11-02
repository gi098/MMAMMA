import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';

interface PinkButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

export const PinkButton: React.FC<PinkButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  size = 'medium',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 38;
      case 'large':
        return 52;
      default:
        return 46;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 13;
      case 'large':
        return 16;
      default:
        return 15;
    }
  };

  const isGradient = variant === 'primary';

  const content = (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.accent : colors.textInverse}
        />
      ) : (
        <>
          {Boolean(icon) && (
            <Ionicons
              name={icon!}
              size={size === 'small' ? 16 : 18}
              color={
                variant === 'outline'
                  ? colors.accent
                  : variant === 'secondary'
                  ? colors.textPrimary
                  : colors.textInverse
              }
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              { fontSize: getFontSize() },
              variant === 'outline' && styles.textOutline,
              variant === 'secondary' && styles.textSecondary,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (isGradient) {
    const gradientColors: [string, string] = isPressed
      ? [colors.primaryDark, colors.accent]
      : [colors.primaryGradientStart, colors.primaryGradientEnd];

    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          styles.base,
          { height: getButtonHeight() },
          shadows.soft,
          disabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { height: getButtonHeight() }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getVariantStyle = () => {
    switch (variant) {
      case 'accent':
        return [styles.accent, isPressed && styles.accentPressed];
      case 'secondary':
        return [styles.secondary, isPressed && styles.secondaryPressed];
      case 'outline':
        return [styles.outline, isPressed && styles.outlinePressed];
      case 'danger':
        return [styles.danger, isPressed && styles.dangerPressed];
      default:
        return styles.primarySolid;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        { height: getButtonHeight() },
        getVariantStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontWeight: '700',
    color: colors.textInverse,
    letterSpacing: 0.2,
  },
  textOutline: {
    color: colors.accent,
  },
  textSecondary: {
    color: colors.textPrimary,
  },
  accent: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
  },
  accentPressed: {
    backgroundColor: '#B53D55',
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
  },
  secondaryPressed: {
    backgroundColor: '#ECCAD4',
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 16,
  },
  outlinePressed: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.accent,
  },
  danger: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    paddingHorizontal: 16,
  },
  dangerPressed: {
    backgroundColor: '#FCD7DF',
  },
  primarySolid: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});

