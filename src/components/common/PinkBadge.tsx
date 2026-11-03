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
      case 'Action':
        bg = colors.genreActionBg;
        text = colors.genreAction;
        badgeIcon = badgeIcon || 'flame-outline';
        break;
      case 'Comedy':
        bg = colors.genreComedyBg;
        text = colors.genreComedy;
        badgeIcon = badgeIcon || 'happy-outline';
        break;
      case 'Drama':
        bg = colors.genreDramaBg;
        text = colors.genreDrama;
        badgeIcon = badgeIcon || 'sparkles-outline';
        break;
      case 'Sci-Fi':
        bg = colors.genreSciFiBg;
        text = colors.genreSciFi;
        badgeIcon = badgeIcon || 'planet-outline';
        break;
      case 'Animation':
        bg = colors.genreAnimationBg;
        text = colors.genreAnimation;
        badgeIcon = badgeIcon || 'color-wand-outline';
        break;
      case 'Romance':
        bg = colors.genreRomanceBg;
        text = colors.genreRomance;
        badgeIcon = badgeIcon || 'heart-outline';
        break;
      case 'Documentary':
        bg = colors.genreDocumentaryBg;
        text = colors.genreDocumentary;
        badgeIcon = badgeIcon || 'videocam-outline';
        break;
      case 'Other':
        bg = colors.genreOtherBg;
        text = colors.genreOther;
        badgeIcon = badgeIcon || 'film-outline';
        break;
    }
  } else if (type === 'status' && status) {
    switch (status) {
      case 'To Watch':
        bg = colors.statusToWatchBg;
        text = colors.statusToWatch;
        badgeIcon = badgeIcon || 'time-outline';
        break;
      case 'Watching':
        bg = colors.statusWatchingBg;
        text = colors.statusWatching;
        badgeIcon = badgeIcon || 'play-circle-outline';
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
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
