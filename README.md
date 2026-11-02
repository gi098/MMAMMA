# BookShelf - MMA301 Practical Exam Mobile Application

Ứng dụng di động **BookShelf** được xây dựng bằng **React Native**, **Expo**, **Firebase Authentication**, và **Cloud Firestore** theo đúng yêu cầu đề thi **MMA301 Practical Exam – FALL 2026**.

---

## 1. CÔNG NGHỆ SỬ DỤNG
- **Framework**: React Native (Expo SDK 58+), TypeScript.
- **Quản lý trạng thái**: React Context API (`AuthContext`, `BookContext`).
- **Định tuyến & Điều hướng**: React Navigation (Native Stack).
- **Backend & Cơ sở dữ liệu**:
  - **Firebase Authentication**: Đăng ký và Đăng nhập bằng Email/Password thực tế.
  - **Cloud Firestore**: Lưu trữ và đồng bộ hóa thời gian thực (`books` collection).
  - **Firestore Security Rules**: Ràng buộc phân quyền dữ liệu và validation schema nghiêm ngặt (`firestore.rules`).
- **Bảo mật biến môi trường**: Quản lý thông qua `.env` và `EXPO_PUBLIC_*`. Không hardcode API keys trong source code.

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
MMA/
├── src/
│   ├── config/
│   │   └── firebase.ts           # Cấu hình Firebase App, Auth và Firestore
│   ├── types/
│   │   └── index.ts              # Type definitions (Book, Genre, Status, Navigation, etc.)
│   ├── utils/
│   │   └── validation.ts         # Logic validation chuẩn theo yêu cầu đề thi
│   ├── services/
│   │   ├── authService.ts        # Firebase Authentication services
│   │   └── bookService.ts       # Cloud Firestore CRUD & Chống trùng sách
│   ├── context/
│   │   ├── AuthContext.tsx       # Quản lý authentication state và current user
│   │   └── BookContext.tsx       # Quản lý danh sách sách, filter, search, summary
│   ├── components/
│   │   ├── Header.tsx            # Header hiển thị email người dùng và nút Logout
│   │   ├── FeatureCard.tsx       # Card tính năng tại màn hình Home
│   │   ├── BookForm.tsx          # Form thêm/sửa sách (testID: book-form)
│   │   ├── BookItem.tsx          # Card hiển thị sách (testID: book-item)
│   │   ├── FilterBar.tsx         # Bộ lọc Genre, Status, Favorites Only và Search Box
│   │   ├── SummaryCard.tsx       # Thống kê book-count, favorite-count, status counts
│   │   ├── LoadingView.tsx       # Màn hình loading thẩm mỹ
│   │   └── ConfirmModal.tsx      # Modal xác nhận trước khi xóa sách
│   ├── screens/
│   │   ├── HomeScreen.tsx        # Màn hình giới thiệu (testID: home-title)
│   │   ├── RegisterScreen.tsx    # Màn hình đăng ký (testID: form-success)
│   │   ├── LoginScreen.tsx       # Màn hình đăng nhập (testID: error-auth)
│   │   ├── ListScreen.tsx        # Màn hình chính sau login (testID: list-screen)
│   │   └── DetailScreen.tsx      # Màn hình chi tiết, chỉnh sửa và xóa sách
│   ├── navigation/
│   │   └── AppNavigator.tsx      # Luồng điều hướng an toàn giữa các màn hình
│   └── theme/
│       └── colors.ts             # Bảng màu thiết kế ấm áp, thẩm mỹ (kem, xanh sage, nâu da)
├── test/
│   └── logic.test.js             # Bộ unit test tự động kiểm tra validation & nghiệp vụ
├── firestore.rules               # Quy tắc bảo mật Firestore Cloud Security Rules
├── .env.example                  # File mẫu biến môi trường (không chứa key bí mật)
├── .env                          # File cấu hình biến môi trường thực tế
├── App.tsx                       # Component gốc ứng dụng
├── app.json                      # Cấu hình Expo Project
└── package.json                  # Dependencies và scripts
```

---

## 3. DANH SÁCH TESTID ĐÃ TRIỂN KHAI

| testID | Vị trí màn hình / Component | Mục đích / Nội dung hiển thị |
| :--- | :--- | :--- |
| `home-title` | `HomeScreen.tsx` | Tiêu đề chính xác: `BookShelf` |
| `list-screen` | `ListScreen.tsx` | Màn hình danh sách chính sau khi đăng nhập |
| `book-form` | `BookForm.tsx` | Form nhập thông tin thêm/sửa sách |
| `book-item` | `BookItem.tsx` | Card hiển thị từng cuốn sách trong danh sách |
| `books-empty` | `ListScreen.tsx` | Hiển thị chính xác: `No books found` khi danh sách rỗng |
| `book-count` | `SummaryCard.tsx` | Tổng số sách đang được hiển thị |
| `favorite-count` | `SummaryCard.tsx` | Tổng số sách yêu thích đang được hiển thị |
| `book-success` | `BookForm.tsx` | Thông báo thành công chính xác: `Book added` |
| `error-book` | `BookForm.tsx` | Thông báo lỗi khi validate form sách hoặc lỗi duplicate |
| `error-auth` | `LoginScreen.tsx` | Thông báo lỗi đăng nhập từ Firebase Auth |
| `form-success` | `RegisterScreen.tsx` | Thông báo đăng ký thành công: `Registration successful` |

---

## 4. CHI TIẾT CÁC TÍNH NĂNG VÀ THÔNG BÁO CHUẨN ĐỀ THI

### A. Home Screen
- Tiêu đề `home-title`: nội dung `BookShelf`.
- Nút **Login** và **Register** khi chưa đăng nhập.
- Mô tả ngắn về ứng dụng quản lý sách cá nhân.
- 3 Feature Cards:
  1. `Track your books`
  2. `Sort by status`
  3. `Rate your favorites`
- Tự động chuyển thẳng tới **List Screen** nếu người dùng đã đăng nhập trước đó.

### B. Register Screen
- Form đăng ký: Email, Password, Confirm Password.
- Chuỗi thông báo Validation chính xác 100%:
  - `Email is required`
  - `Please enter a valid email address`
  - `Password is required`
  - `Password must be at least 6 characters`
  - `Confirm password is required`
  - `Passwords do not match`
- Khi đăng ký thành công: Hiển thị `Registration successful` trong phần tử có testID `form-success`.
- Tạo tài khoản thực tế bằng Firebase Authentication (`createUserWithEmailAndPassword`).

### C. Login Screen
- Form đăng nhập: Email, Password.
- Đăng nhập thực tế bằng Firebase Authentication (`signInWithEmailAndPassword`).
- Khi Firebase trả về lỗi: hiển thị trong `error-auth` (testID `error-auth`).
- Đăng nhập thành công chuyển ngay đến **List Screen**.

### D. List Screen & Add Book Form
- Header: Hiển thị email người dùng và nút Logout.
- Form thêm sách (testID `book-form`):
  - **Title** (bắt buộc, không chỉ khoảng trắng, tối đa 100 ký tự).
  - **Author** (bắt buộc, không chỉ khoảng trắng, tối đa 60 ký tự).
  - **Genre**: `Choose genre`, `Fiction`, `Non-Fiction`, `Academic`, `Other`.
  - **Status**: `Choose status`, `To Read`, `Reading`, `Finished`.
  - **Rating**: Không bắt buộc, số nguyên từ 0 đến 5.
  - **Notes**: Không bắt buộc, tối đa 300 ký tự.
- Validation chính xác từng từ:
  - `Title is required`
  - `Title must be at most 100 characters`
  - `Author is required`
  - `Author must be at most 60 characters`
  - `Please choose a genre`
  - `Please choose a status`
  - `Rating must be a whole number from 0 to 5`
  - `Notes must be at most 300 characters`
- Khi thêm thành công:
  - Lưu vào Firestore.
  - Cập nhật danh sách ngay lập tức.
  - Xóa trắng form.
  - Hiển thị `Book added` trong `book-success`.
- Nếu có lỗi (hoặc trùng sách): hiển thị trong `error-book`.

### E. Book List & Sorting
- Sắp xếp theo **Title** theo bảng chữ cái alphabet (không phân biệt chữ hoa/thường).
- Nếu Title giống nhau, sắp xếp theo **Author** (không phân biệt chữ hoa/thường).
- Mỗi item có nút Favorite toggle (trái tim): bấm vào cập nhật ngay lập tức và lưu vào Firestore.
- Nút mở Detail Screen.
- Khi không có sách nào phù hợp: hiển thị `No books found` với testID `books-empty`.

### F. Filter, Search & Summary
- **Genre Filter**: `All`, `Fiction`, `Non-Fiction`, `Academic`, `Other`.
- **Status Filter**: `All`, `To Read`, `Reading`, `Finished`.
- **Favorites Only Switch**: Bật/tắt chỉ xem sách yêu thích.
- **Search Box**: Tìm kiếm theo Title hoặc Author, không phân biệt hoa/thường, tự động loại bỏ khoảng trắng thừa ở đầu/cuối (`trim()`).
- Tất cả bộ lọc hoạt động đồng thời (tích hợp) và cập nhật tức thì.
- Nút **Clear all filters**: Xóa toàn bộ bộ lọc và ô tìm kiếm về mặc định.
- **Summary**:
  - `book-count`: Tổng số sách đang hiển thị.
  - `favorite-count`: Tổng số sách yêu thích đang hiển thị.
  - Thống kê số lượng sách theo từng Status:
    Sắp xếp theo thứ tự ưu tiên: 1. `To Read`, 2. `Reading`, 3. `Finished`. Nếu số lượng bằng nhau, bảo toàn thứ tự trên.

### G. Detail Screen
- Hiển thị đầy đủ: Title, Author, Genre, Status, Rating (sao và điểm), Notes, Favorite toggle.
- **Edit**:
  - Chuyển sang form chỉnh sửa với dữ liệu hiện tại của sách.
  - Nút **Save Changes** và **Cancel**.
  - Validation chặt chẽ như lúc thêm sách.
  - Lưu cập nhật lên Firestore và quay lại chế độ xem.
- **Delete**:
  - Hộp thoại Modal xác nhận trước khi xóa (bảo đảm an toàn dữ liệu).
  - Xóa sách khỏi Firestore.
  - Tự động quay về List Screen và cập nhật danh sách ngay lập tức.

### H. Cơ chế chống trùng sách (Concurrent-Safe Duplicate Prevention)
- Cùng một người dùng **không được phép** lưu 2 cuốn sách có Title và Author trùng nhau (không phân biệt chữ hoa/thường).
- Hai người dùng khác nhau **hoàn toàn được phép** lưu cùng một cuốn sách.
- Document ID được tạo theo dạng deterministic: `${userId}_${slug}_${hash}`. Nhờ đó, ngay cả khi có 2 request ghi đồng thời, Firestore atomic set/create sẽ chặn trùng lặp hoàn toàn mà không sợ race condition.

---

## 5. HƯỚNG DẪN CẤU HÌNH FIREBASE

### Bước 1: Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/).
2. Nhấp **Add project** (Đặt tên: `bookshelf-mma301`).

### Bước 2: Bật Firebase Authentication
1. Tại menu bên trái, chọn **Build** -> **Authentication**.
2. Nhấp **Get Started**.
3. Tại tab **Sign-in method**, chọn **Email/Password**.
4. Bật toggle **Email/Password** và nhấp **Save**.

### Bước 3: Tạo Cloud Firestore
1. Tại menu bên trái, chọn **Build** -> **Firestore Database**.
2. Nhấp **Create database**.
3. Chọn vị trí server (ví dụ: `asia-southeast1` hoặc `us-central1`).
4. Chọn chế độ **Start in production mode** (hoặc test mode).

### Bước 4: Cập nhật Firestore Security Rules
1. Tại tab **Rules** trong Firestore Database, sao chép toàn bộ nội dung file `firestore.rules` của dự án và dán vào.
2. Nhấp **Publish**.

### Bước 5: Lấy cấu hình Firebase Web App
1. Vào **Project Settings** (biểu tượng bánh răng ở góc trên bên trái) -> tab **General**.
2. Cuộn xuống mục **Your apps**, chọn biểu tượng **Web** (`</>`).
3. Đăng ký app (ví dụ: `BookShelf-Web`).
4. Sao chép các thông số cấu hình và dán vào file `.env` của dự án:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...
```

---

## 6. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Kiểm tra tính đúng đắn mã nguồn và logic
```bash
# Kiểm tra TypeScript typecheck
npx tsc --noEmit

# Chạy bộ unit test tự động
node test/logic.test.js
```

### Bước 3: Khởi động Expo Dev Server
```bash
npx expo start
```
- Nhấn `w` để mở trên Web Browser.
- Hoặc quét mã QR bằng ứng dụng **Expo Go** trên điện thoại Android/iOS.
- Nhấn `a` để chạy trên Android Emulator (nếu có sẵn Android Studio).

---

## 7. HƯỚNG DẪN TẠO TÀI KHOẢN TEST

1. Mở ứng dụng BookShelf, tại màn hình Home chọn **Register**.
2. Tạo tài khoản User 1:
   - Email: `user1@bookshelf.test`
   - Password: `password123`
   - Confirm Password: `password123`
   - Bấm **Register**. Ứng dụng sẽ hiển thị `Registration successful`.
3. Đăng nhập với User 1, thêm sách:
   - Cuốn 1: Title: `The Great Gatsby`, Author: `F. Scott Fitzgerald`, Genre: `Fiction`, Status: `Finished`, Rating: `5`.
   - Cuốn 2: Title: `Clean Code`, Author: `Robert C. Martin`, Genre: `Academic`, Status: `Reading`, Rating: `4`.
   - Cuốn 3: Title: `1984`, Author: `George Orwell`, Genre: `Fiction`, Status: `To Read`, Rating: `5`.
4. Logout và đăng ký tiếp User 2 (`user2@bookshelf.test`).
5. Đăng nhập User 2 và kiểm tra:
   - Danh sách của User 2 ban đầu sẽ rỗng (`No books found`), chứng minh dữ liệu User 1 được cô lập bảo mật tuyệt đối.
   - Thêm cùng cuốn sách `The Great Gatsby` của `F. Scott Fitzgerald` cho User 2 -> Thành công (đáp ứng tiêu chí 2 người khác nhau được phép lưu cùng một cuốn sách).

---

## 8. HƯỚNG DẪN TẠO GITHUB REPO & EXPO PROJECT LINK

### Tạo GitHub Repository:
1. Tạo một repository mới trên GitHub (ví dụ: `BookShelf-MMA301`).
2. Mở terminal tại thư mục dự án và chạy:
```bash
git init
git add .
git commit -m "feat: complete BookShelf mobile application for MMA301"
git branch -M main
git remote add origin https://github.com/<your-username>/BookShelf-MMA301.git
git push -u origin main
```

### Tạo Expo Project Link:
1. Đăng nhập tài khoản Expo:
```bash
npx eas-cli login
# hoặc npx expo login
```
2. Xuất bản hoặc chia sẻ link Expo:
```bash
npx eas-cli project:init
```

---

## 9. HƯỚNG DẪN CHỤP ẢNH MINH CHỨNG (THEO ĐỀ THI)

Khi nộp bài thi thực hành MMA301, sinh viên chụp các ảnh minh chứng rõ nét sau:
1. **Ảnh 1 - Home Screen**: Hiển thị tiêu đề `BookShelf`, 3 feature cards, nút Login & Register.
2. **Ảnh 2 - Register Screen**: Form đăng ký và thông báo `Registration successful`.
3. **Ảnh 3 - Register Validation**: Chụp màn hình khi vi phạm các điều kiện validation email/password.
4. **Ảnh 4 - Login Screen**: Form đăng nhập và thông báo lỗi khi nhập sai mật khẩu (`error-auth`).
5. **Ảnh 5 - List Screen**: Header có email và nút Logout, form `Add New Book`, Summary (`book-count`, `favorite-count`), status breakdown.
6. **Ảnh 6 - Add Book Validation & Success**: Form validate các trường và thông báo `Book added`.
7. **Ảnh 7 - Chống trùng sách**: Thử thêm lại sách đã tồn tại và hiển thị thông báo lỗi trong `error-book`.
8. **Ảnh 8 - Sorting**: Danh sách sách được sắp xếp đúng thứ tự alphabet theo Title, sau đó đến Author.
9. **Ảnh 9 - Filters & Search**: Kết quả khi áp dụng tìm kiếm từ khóa, lọc theo Genre, lọc theo Status và Favorites Only.
10. **Ảnh 10 - Detail Screen**: Chi tiết cuốn sách đầy đủ điểm số sao, ghi chú; màn hình Edit và Modal xác nhận Delete.
11. **Ảnh 11 - Firebase Console**: Chụp màn hình tab Authentication có các user đã tạo và tab Cloud Firestore có collection `books` với các document thực tế.
12. **Ảnh 12 - Firestore Rules**: Chụp tab Rules trong Firebase Console hiển thị file `firestore.rules`.

