export const colors = {
  // Backgrounds
  background: '#FFF7F8',       // Trắng hồng nhẹ
  surface: '#FFFFFF',          // Card Background
  surfaceSecondary: '#FFF0F3', // Nền hồng nhạt rất nhẹ
  surfaceMuted: '#FCE8ED',     // Pill / chip background

  // Cloud & Rose brand colors
  primary: '#EFA6B8',          // Hồng mây
  primaryLight: '#F5C2CE',     // Hồng mây sáng
  primaryDark: '#D88A9E',      // Hồng mây nhấn
  primaryGradientStart: '#FAD1DC',
  primaryGradientEnd: '#EFA6B8',

  secondary: '#F8DCE4',        // Hồng pastel
  secondarySoft: '#FDF1F5',

  accent: '#C94F68',           // Đỏ hồng hoa hồng
  accentSoft: '#FDECEF',
  softRed: '#D97889',          // Đỏ dịu

  // Text
  textPrimary: '#513942',      // Nâu đỏ trầm
  textSecondary: '#9A7E87',    // Muted dusty rose
  textMuted: '#C4ADB5',        // Placeholder & subtle text
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#F2DCE2',           // Viền hồng nhạt
  borderFocus: '#EFA6B8',

  // Status badges (Harmonious soft pastel tones)
  statusToRead: '#B85E42',     // Soft terracotta
  statusToReadBg: '#FDEEE8',
  statusReading: '#7B599B',    // Soft lavender
  statusReadingBg: '#F5ECFB',
  statusFinished: '#3D8B6E',   // Soft sage mint
  statusFinishedBg: '#EAF7F1',

  // Genre badges
  genreFiction: '#AD4D6D',
  genreFictionBg: '#FDE7EF',
  genreNonFiction: '#6E568F',
  genreNonFictionBg: '#F1ECF8',
  genreAcademic: '#3B798A',
  genreAcademicBg: '#E7F4F7',
  genreOther: '#876251',
  genreOtherBg: '#F7EEE7',

  // Rating & Favorites
  ratingStar: '#E89D56',
  ratingStarBg: '#FEF3E8',
  favorite: '#C94F68',         // Đỏ hồng
  favoriteBg: '#FDECEF',

  // Alerts
  error: '#C94F68',            // Đỏ hồng dịu
  errorBg: '#FDEEF1',
  errorBorder: '#F7C2CC',
  success: '#3D8B6E',          // Xanh ngọc dịu
  successBg: '#EAF7F1',
  successBorder: '#BFE7D5',
};

export const shadows = {
  soft: {
    shadowColor: '#C94F68',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#A5495E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  floating: {
    shadowColor: '#C94F68',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
};
