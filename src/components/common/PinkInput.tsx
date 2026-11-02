import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface PinkInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  error?: string | null;
  containerStyle?: ViewStyle;
}

export const PinkInput: React.FC<PinkInputProps> = ({
  label,
  required,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  containerStyle,
  style,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {Boolean(label) && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          Boolean(error) && styles.inputWrapperError,
        ]}
      >
        {Boolean(leftIcon) && (
          <Ionicons
            name={leftIcon!}
            size={18}
            color={isFocused ? colors.accent : colors.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...restProps}
        />

        {Boolean(rightIcon) && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconButton}
          >
            <Ionicons name={rightIcon!} size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  required: {
    color: colors.accent,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9FA',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputWrapperError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    height: '100%',
  },
  rightIconButton: {
    padding: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    fontWeight: '600',
  },
});

