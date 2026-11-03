import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MovieFormData, Genre, Status, GENRE_OPTIONS, STATUS_OPTIONS } from '../types';
import { validateMovieForm } from '../utils/validation';
import { colors, shadows } from '../theme/colors';

interface MovieFormProps {
  initialValues?: MovieFormData;
  onSubmit: (formData: MovieFormData) => Promise<{ success: boolean; error: string | null }>;
  onCancel?: () => void;
  submitButtonText?: string;
  mode?: 'add' | 'edit';
  serverError?: string | null;
  serverSuccess?: string | null;
  onClearMessages?: () => void;
}

const defaultValues: MovieFormData = {
  title: '',
  director: '',
  genre: '',
  status: '',
  rating: '',
  notes: '',
};

export const MovieForm: React.FC<MovieFormProps> = ({
  initialValues = defaultValues,
  onSubmit,
  onCancel,
  submitButtonText = 'Add Movie',
  mode = 'add',
  serverError = null,
  serverSuccess = null,
  onClearMessages,
}) => {
  const [formData, setFormData] = useState<MovieFormData>(initialValues);
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (field: keyof MovieFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (localError) setLocalError(null);
    if (onClearMessages) onClearMessages();
  };

  const handleSubmit = async () => {
    setLocalError(null);
    if (onClearMessages) onClearMessages();

    // Client-side validation
    const validation = validateMovieForm(formData);
    if (!validation.isValid) {
      setLocalError(validation.firstError);
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(formData);
    setSubmitting(false);

    if (result.success && mode === 'add') {
      // Clear form on add success
      setFormData(defaultValues);
    }
  };

  const displayError = localError || serverError;

  return (
    <View testID="movie-form" style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons
          name={mode === 'add' ? 'film-outline' : 'create-outline'}
          size={18}
          color={colors.accent}
          style={styles.formTitleIcon}
        />
        <Text style={styles.formTitle}>
          {mode === 'add' ? 'Add New Movie' : 'Edit Movie Details'}
        </Text>
      </View>

      {/* Success Banner */}
      {Boolean(serverSuccess) && (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text testID="movie-success" style={styles.successText}>
            {serverSuccess}
          </Text>
        </View>
      )}

      {/* Error Banner */}
      {Boolean(displayError) && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color={colors.error} />
          <Text testID="error-movie" style={styles.errorText}>
            {displayError}
          </Text>
        </View>
      )}

      {/* Title Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Title <Text style={styles.requiredMark}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Inception"
          placeholderTextColor={colors.textMuted}
          value={formData.title}
          onChangeText={(val) => handleChange('title', val)}
          maxLength={110}
        />
        <Text style={styles.charHint}>{formData.title.length}/100</Text>
      </View>

      {/* Director Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Director <Text style={styles.requiredMark}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Christopher Nolan"
          placeholderTextColor={colors.textMuted}
          value={formData.director}
          onChangeText={(val) => handleChange('director', val)}
          maxLength={70}
        />
        <Text style={styles.charHint}>{formData.director.length}/60</Text>
      </View>

      {/* Genre Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Genre <Text style={styles.requiredMark}>*</Text>
        </Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.optionPill, formData.genre === '' && styles.optionPillSelected]}
            onPress={() => handleChange('genre', '')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionPillText,
                formData.genre === '' && styles.optionPillTextSelected,
              ]}
            >
              Choose genre
            </Text>
          </TouchableOpacity>
          {GENRE_OPTIONS.map((g) => {
            const isSelected = formData.genre === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                onPress={() => handleChange('genre', g)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    isSelected && styles.optionPillTextSelected,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Status Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Status <Text style={styles.requiredMark}>*</Text>
        </Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.optionPill, formData.status === '' && styles.optionPillSelected]}
            onPress={() => handleChange('status', '')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionPillText,
                formData.status === '' && styles.optionPillTextSelected,
              ]}
            >
              Choose status
            </Text>
          </TouchableOpacity>
          {STATUS_OPTIONS.map((s) => {
            const isSelected = formData.status === s;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                onPress={() => handleChange('status', s)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    isSelected && styles.optionPillTextSelected,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Rating Field (optional) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Rating (Optional: 0 to 5)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 5"
          placeholderTextColor={colors.textMuted}
          value={formData.rating}
          onChangeText={(val) => handleChange('rating', val)}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>

      {/* Notes Field (optional) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Personal thoughts, quotes, or review..."
          placeholderTextColor={colors.textMuted}
          value={formData.notes}
          onChangeText={(val) => handleChange('notes', val)}
          multiline
          numberOfLines={3}
          maxLength={310}
        />
        <Text style={styles.charHint}>{formData.notes.length}/300</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        {Boolean(onCancel) && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={submitting}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.submitTouchWrapper, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitGradient}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.textInverse} />
            ) : (
              <>
                <Ionicons
                  name={mode === 'add' ? 'add-circle-outline' : 'save-outline'}
                  size={18}
                  color={colors.textInverse}
                  style={styles.submitIcon}
                />
                <Text style={styles.submitButtonText}>{submitButtonText}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitleIcon: {
    marginRight: 8,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  successText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 8,
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  requiredMark: {
    color: colors.accent,
  },
  input: {
    backgroundColor: '#FFF9FA',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 74,
    textAlignVertical: 'top',
  },
  charHint: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 3,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionPillTextSelected: {
    color: colors.textInverse,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  submitTouchWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    ...shadows.soft,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 14,
    minWidth: 120,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitIcon: {
    marginRight: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textInverse,
    letterSpacing: 0.2,
  },
});
