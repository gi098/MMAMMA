export const colors = {
  // Main Romantic Palette (Pink Cloud theme)
  primary: '#E07A9A',          // Hồng cánh sen dịu dàng, lãng mạn
  primaryDark: '#B85573',      // Hồng đất trầm
  primaryLight: '#FAD4E0',     // Hồng phấn rất nhạt
  primaryPastel: '#FFF0F5',    // Lavender Blush cực nhẹ cho header/card
  primaryGradientStart: '#FAD1DC',
  primaryGradientEnd: '#EFA6B8',
  secondary: '#F8DCE4',        // Hồng pastel
  secondarySoft: '#FDF1F5',
  accent: '#C94F68',           // Hồng đào đậm / Crimson rose để tạo điểm nhấn
  accentSoft: '#F6B7C6',       // Hồng phớt
  softRed: '#D97889',          // Đỏ dịu

  // Backgrounds & Neutrals
  background: '#FFF7F9',       // Nền trang kem hồng phớt ấm áp
  surface: '#FFFFFF',          // Card trắng ngà sạch sẽ
  surfaceElevated: '#FFF1F4',  // Card nổi bật hơn
  surfaceSecondary: '#FFF0F3', // Nền hồng nhạt rất nhẹ
  surfaceMuted: '#FCE8ED',     // Pill / chip background

  // Text Hierarchy
  textPrimary: '#3A2E33',      // Nâu than mờ ấm áp
  textSecondary: '#7A6B72',    // Nâu xám tro dịu mắt
  textMuted: '#AFA4AA',        // Chữ phụ mờ nhạt
  textLight: '#FFFFFF',        // Chữ trắng trên nền hồng
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#F2DCE2',           // Viền hồng phấn nhẹ
  borderLight: '#F9ECEF',      // Viền siêu mờ
  borderFocus: '#EFA6B8',

  // Status badges
  statusToWatch: '#B85E42',     // Soft terracotta
  statusToWatchBg: '#FDEEE8',
  statusWatching: '#7B599B',    // Soft lavender
  statusWatchingBg: '#F5ECFB',
  statusFinished: '#3D8B6E',   // Soft sage mint
  statusFinishedBg: '#EAF7F1',

  // Backward-compat status colors if needed
  statusToRead: '#B85E42',
  statusToReadBg: '#FDEEE8',
  statusReading: '#7B599B',
  statusReadingBg: '#F5ECFB',

  // Genre badges
  genreAction: '#C94F68',
  genreActionBg: '#FDECEF',
  genreComedy: '#E89D56',
  genreComedyBg: '#FEF3E8',
  genreDrama: '#7B599B',
  genreDramaBg: '#F5ECFB',
  genreSciFi: '#3B798A',
  genreSciFiBg: '#E7F4F7',
  genreAnimation: '#E07A9A',
  genreAnimationBg: '#FDF0F4',
  genreRomance: '#D64E72',
  genreRomanceBg: '#FDE7EF',
  genreDocumentary: '#5A738E',
  genreDocumentaryBg: '#EDF3F7',
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
    shadowColor: '#8A2D44',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
};
