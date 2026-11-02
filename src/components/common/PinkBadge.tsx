import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Genre, Status } from '../../types';

interface PinkBadgeProps {
  label: string;
  type?: 'genre' | 'status' | 'rating' | 'favorite' | 'custom';
  genre?: Genre;
  status?: Status;
  icon?: keyof typeof Ionicons.glyphMap;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PinkBadge: React.FC<PinkBadgeProps> = ({
  label,
  type = 'custom',
  genre,
  status,
  icon,
  backgroundColor,
  textColor,
  style,
  textStyle,
}) => {
  let bg = backgroundColor || colors.secondarySoft;
  let text = textColor || colors.textPrimary;
  let badgeIcon = icon;

  if (type === 'genre' && genre) {
    switch (genre) {
      case 'Fiction':
        bg = colors.genreFictionBg;
        text = colors.genreFiction;
        badgeIcon = badgeIcon || 'rose-outline';
        break;
      case 'Non-Fiction':
        bg = colors.genreNonFictionBg;
        text = colors.genreNonFiction;
        badgeIcon = badgeIcon || 'planet-outline';
        break;
      case 'Academic':
        bg = colors.genreAcademicBg;
        text = colors.genreAcademic;
        badgeIcon = badgeIcon || 'school-outline';
        break;
      case 'Other':
        bg = colors.genreOtherBg;
        text = colors.genreOther;
        badgeIcon = badgeIcon || 'sparkles-outline';
        break;
    }
  } else if (type === 'status' && status) {
    switch (status) {
      case 'To Read':
        bg = colors.statusToReadBg;
        text = colors.statusToRead;
        badgeIcon = badgeIcon || 'bookmark-outline';
        break;
      case 'Reading':
        bg = colors.statusReadingBg;
        text = colors.statusReading;
        badgeIcon = badgeIcon || 'book-outline';
        break;
      case 'Finished':
        bg = colors.statusFinishedBg;
        text = colors.statusFinished;
        badgeIcon = badgeIcon || 'checkmark-circle-outline';
        break;
    }
  } else if (type === 'favorite') {
    bg = colors.favoriteBg;
    text = colors.favorite;
    badgeIcon = badgeIcon || 'heart';
  } else if (type === 'rating') {
    bg = colors.ratingStarBg;
    text = colors.ratingStar;
    badgeIcon = badgeIcon || 'star';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {Boolean(badgeIcon) && (
        <Ionicons name={badgeIcon!} size={13} color={text} style={styles.icon} />
      )}
      <Text style={[styles.label, { color: text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(242, 220, 226, 0.6)',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
