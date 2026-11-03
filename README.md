# CineList - MMA301 Practical Exam Mobile Application

Ứng dụng di động **CineList** được xây dựng bằng **React Native**, **Expo**, **Firebase Authentication**, và **Cloud Firestore** theo đúng yêu cầu đề thi **MMA301 Practical Exam – FALL 2026**.

---

## 1. CÔNG NGHỆ SỬ DỤNG
- **Framework**: React Native (Expo SDK 54+), TypeScript.
- **Quản lý trạng thái**: React Context API (`AuthContext`, `MovieContext`).
- **Định tuyến & Điều hướng**: React Navigation (Native Stack).
- **Backend & Cơ sở dữ liệu**:
  - **Firebase Authentication**: Đăng ký và Đăng nhập bằng Email/Password thực tế.
  - **Cloud Firestore**: Lưu trữ và đồng bộ hóa thời gian thực (`movies` collection).
  - **Firestore Security Rules**: Ràng buộc phân quyền dữ liệu và validation schema nghiêm ngặt (`firestore.rules`).
- **Bảo mật biến môi trường**: Quản lý thông qua `.env` và `EXPO_PUBLIC_*`. Không hardcode API keys trong source code.
- **Phong cách giao diện**: **Pink Cloud – Soft Romantic** kết hợp bảng màu hoàng hôn hồng mây pastel (`#E07A9A`), đỏ hoa hồng tạo điểm nhấn (`#C94F68`) trên nền trắng hồng thanh khiết (`#FFF7F9`).

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
MMA/
├── src/
│   ├── config/
│   │   └── firebase.ts           # Cấu hình Firebase App, Auth và Firestore
│   ├── types/
│   │   └── index.ts              # Type definitions (Movie, Genre, Status, Navigation, etc.)
│   ├── utils/
│   │   └── validation.ts         # Logic validation chuẩn theo yêu cầu đề thi
│   ├── services/
│   │   ├── authService.ts        # Firebase Authentication services
│   │   └── movieService.ts       # Cloud Firestore CRUD & Chống trùng phim (Title + Director)
│   ├── context/
│   │   ├── AuthContext.tsx       # Quản lý authentication state và current user
│   │   └── MovieContext.tsx      # Quản lý danh sách phim, filter, search, summary
│   ├── components/
│   │   ├── Header.tsx            # Header hiển thị email người dùng và nút Logout
│   │   ├── FeatureCard.tsx       # Card tính năng tại màn hình Home
│   │   ├── MovieForm.tsx         # Form thêm/sửa phim (testID: movie-form, movie-success)
│   │   ├── MovieItem.tsx         # Card hiển thị phim (testID: movie-item)
│   │   ├── FilterBar.tsx         # Bộ lọc Genre, Status, Favorites Only và Search Box
│   │   ├── SummaryCard.tsx       # Thống kê movie-count, favorite-count, status counts
│   │   ├── LoadingView.tsx       # Màn hình loading thẩm mỹ
│   │   └── ConfirmModal.tsx      # Modal xác nhận trước khi xóa phim
│   ├── screens/
│   │   ├── HomeScreen.tsx        # Màn hình giới thiệu (testID: home-title)
│   │   ├── RegisterScreen.tsx    # Màn hình đăng ký (testID: form-success, error-auth)
│   │   ├── LoginScreen.tsx       # Màn hình đăng nhập (testID: error-auth)
│   │   ├── ListScreen.tsx        # Màn hình chính sau login (testID: list-screen, movies-empty)
│   │   └── DetailScreen.tsx      # Màn hình chi tiết / sửa / xóa phim
│   └── theme/
│       └── colors.ts             # Bảng màu thiết kế Pink Cloud - Soft Romantic
├── test/
│   └── logic.test.js             # 21 automated tests kiểm thử logic & validation
├── firestore.rules               # Security rules bảo vệ collection movies
├── .env.example                  # Template biến môi trường Firebase
├── app.json                      # Cấu hình Expo application
├── package.json
└── App.tsx                       # Root component
```

---

## 3. CHECKLIST TESTID THEO ĐỀ BÀI

| Screen / Component | testID | Visible Text / Yêu cầu | Trạng thái |
|---|---|---|---|
| HomeScreen | `home-title` | Text chính xác: `CineList` | Hoàn thành |
| ListScreen | `list-screen` | Container màn hình danh sách | Hoàn thành |
| ListScreen (Empty) | `movies-empty` | Text chính xác: `No movies found` | Hoàn thành |
| MovieForm | `movie-form` | Form thêm / chỉnh sửa phim | Hoàn thành |
| MovieForm (Success) | `movie-success` | Text chính xác: `Movie added` | Hoàn thành |
| MovieForm (Error) | `error-movie` | Hiển thị lỗi validation form phim | Hoàn thành |
| MovieItem | `movie-item` | Thẻ hiển thị bộ phim | Hoàn thành |
| SummaryCard | `movie-count` | Số lượng tổng phim | Hoàn thành |
| SummaryCard | `favorite-count` | Số lượng phim yêu thích | Hoàn thành |
| RegisterScreen | `form-success` | Text chính xác: `Registration successful` | Hoàn thành |
| Register / Login | `error-auth` | Hiển thị thông báo lỗi xác thực | Hoàn thành |

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY

```bash
# 1. Chạy bài kiểm thử logic tự động (21 tests)
node test/logic.test.js

# 2. Kiểm tra typecheck TypeScript
npx tsc --noEmit

# 3. Khởi động ứng dụng Expo
npx expo start -c
```
