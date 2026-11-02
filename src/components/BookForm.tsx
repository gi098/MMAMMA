import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookFormData, Genre, Status, GENRE_OPTIONS, STATUS_OPTIONS } from '../types';
import { validateBookForm } from '../utils/validation';
import { colors } from '../theme/colors';

interface BookFormProps {
  initialValues?: BookFormData;
  onSubmit: (formData: BookFormData) => Promise<{ success: boolean; error: string | null }>;
  onCancel?: () => void;
  submitButtonText?: string;
  mode?: 'add' | 'edit';
  serverError?: string | null;
  serverSuccess?: string | null;
  onClearMessages?: () => void;
}

const defaultValues: BookFormData = {
  title: '',
  author: '',
  genre: '',
  status: '',
  rating: '',
  notes: '',
};

export const BookForm: React.FC<BookFormProps> = ({
  initialValues = defaultValues,
  onSubmit,
  onCancel,
  submitButtonText = 'Add Book',
  mode = 'add',
  serverError = null,
  serverSuccess = null,
  onClearMessages,
}) => {
  const [formData, setFormData] = useState<BookFormData>(initialValues);
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (field: keyof BookFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (localError) setLocalError(null);
    if (onClearMessages) onClearMessages();
  };

  const handleSubmit = async () => {
    setLocalError(null);
    if (onClearMessages) onClearMessages();

    // Client-side validation
    const validation = validateBookForm(formData);
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

  // Determine active error
  const displayError = localError || serverError;

  return (
    <View testID="book-form" style={styles.container}>
      <Text style={styles.formTitle}>
        {mode === 'add' ? 'Add New Book' : 'Edit Book Details'}
      </Text>

      {/* Success Banner */}
      {Boolean(serverSuccess) && (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text testID="book-success" style={styles.successText}>
            {serverSuccess}
          </Text>
        </View>
      )}

      {/* Error Banner */}
      {Boolean(displayError) && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color={colors.error} />
          <Text testID="error-book" style={styles.errorText}>
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
          placeholder="e.g. The Great Gatsby"
          placeholderTextColor={colors.textMuted}
          value={formData.title}
          onChangeText={(val) => handleChange('title', val)}
          maxLength={110}
        />
        <Text style={styles.charHint}>{formData.title.length}/100</Text>
      </View>

      {/* Author Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Author <Text style={styles.requiredMark}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. F. Scott Fitzgerald"
          placeholderTextColor={colors.textMuted}
          value={formData.author}
          onChangeText={(val) => handleChange('author', val)}
          maxLength={70}
        />
        <Text style={styles.charHint}>{formData.author.length}/60</Text>
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
          placeholder="Personal thoughts, quotes, or reflection..."
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
        {onCancel && (
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
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.7}
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
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 6,
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 6,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  requiredMark: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  charHint: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
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
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 110,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitIcon: {
    marginRight: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
