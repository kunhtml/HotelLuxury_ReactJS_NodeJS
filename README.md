# Hotel Luxury - Hệ Thống Đặt Phòng Khách Sạn Hiện Đại

![Hotel Luxury](https://img.shields.io/badge/Hotel%20Luxury-Hệ%20Thống%20Đặt%20Phòng-blue)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)

Ứng dụng đặt phòng khách sạn full-stack được xây dựng bằng React, Node.js, Express và MySQL. Ứng dụng này cung cấp giải pháp toàn diện cho việc đặt phòng khách sạn với giao diện người dùng và quản trị viên.

## 📋 Tính Năng

### 🧑‍💼 Tính Năng Người Dùng

- Duyệt các phòng có sẵn với thông tin chi tiết
- Lọc phòng theo nhiều tiêu chí khác nhau
- Xem chi tiết phòng, tiện nghi và hình ảnh
- Đặt phòng với lựa chọn ngày
- Đăng ký và xác thực người dùng
- Bảng điều khiển người dùng để quản lý đặt phòng
- Viết và gửi đánh giá cho phòng
- Xem lịch sử và trạng thái đặt phòng

### 👨‍💻 Tính Năng Quản Trị Viên

- Bảng điều khiển quản trị viên toàn diện
- Quản lý phòng (thêm, sửa, xóa)
- Quản lý đặt phòng (xem, cập nhật trạng thái)
- Quản lý tài khoản người dùng
- Kiểm duyệt đánh giá
- Xem thống kê và báo cáo
- Theo dõi doanh thu và phân tích

## 🛠️ Công Nghệ Sử Dụng

### Frontend

- **React** (v19.0.0) - Thư viện UI
- **React Router DOM** (v7.5.3) - Định tuyến
- **Axios** - HTTP client
- **React Icons** - Thư viện biểu tượng
- **React DatePicker** - Component chọn ngày
- **Recharts** - Biểu đồ và đồ thị
- **Date-fns** - Xử lý ngày tháng
- **Vite** - Công cụ build và máy chủ phát triển

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL** - Cơ sở dữ liệu
- **JSON Web Token (JWT)** - Xác thực
- **Bcrypt** - Mã hóa mật khẩu
- **Cors** - Chia sẻ tài nguyên giữa các nguồn gốc khác nhau
- **Dotenv** - Biến môi trường

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- Node.js (v14 trở lên)
- MySQL (v5.7 trở lên)
- npm hoặc yarn

### Cài Đặt

#### Clone repository

```bash
git clone https://github.com/yourusername/hotel-luxury.git
cd hotel-luxury
```

#### Cài Đặt Backend

```bash
cd hotel-booking-backend

# Cài đặt các gói phụ thuộc
npm install

# Tạo file .env với các biến sau
# PORT=5000
# DB_HOST=localhost
# DB_USER=tên_người_dùng_mysql
# DB_PASSWORD=mật_khẩu_mysql
# DB_NAME=hotel_booking
# JWT_SECRET=khóa_bí_mật_jwt

# Thiết lập cơ sở dữ liệu
mysql -u tên_người_dùng_mysql -p < setup_database.sql

# Khởi động máy chủ
npm run dev
```

#### Cài Đặt Frontend

```bash
cd hotel-booking

# Cài đặt các gói phụ thuộc
npm install

# Khởi động máy chủ phát triển
npm run dev
```

## 📁 Cấu Trúc Dự Án

### Cấu Trúc Frontend

```
hotel-booking/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── admin/
│   │   ├── user/
│   │   ├── Home.jsx
│   │   ├── Rooms.jsx
│   │   └── ...
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── package.json
└── vite.config.js
```

### Cấu Trúc Backend

```
hotel-booking-backend/
├── config/
│   └── db.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── rooms.js
│   ├── bookings.js
│   └── reviews.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── setup_database.sql
```

## 📝 API Endpoints

### Xác Thực

- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập người dùng
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại

### Phòng

- `GET /api/rooms` - Lấy tất cả phòng
- `GET /api/rooms/:id` - Lấy phòng theo ID
- `POST /api/rooms` - Tạo phòng mới (admin)
- `PUT /api/rooms/:id` - Cập nhật phòng (admin)
- `DELETE /api/rooms/:id` - Xóa phòng (admin)

### Đặt Phòng

- `GET /api/bookings` - Lấy đặt phòng của người dùng
- `GET /api/bookings/all` - Lấy tất cả đặt phòng (admin)
- `POST /api/bookings` - Tạo đặt phòng
- `PUT /api/bookings/:id/status` - Cập nhật trạng thái đặt phòng (admin)

### Đánh Giá

- `GET /api/reviews/room/:id` - Lấy đánh giá cho phòng
- `POST /api/reviews` - Tạo đánh giá
- `PUT /api/reviews/:id/status` - Cập nhật trạng thái đánh giá (admin)

## 🔒 Biến Môi Trường

### Backend (.env)

```
PORT=5000
DB_HOST=localhost
DB_USER=tên_người_dùng_mysql
DB_PASSWORD=mật_khẩu_mysql
DB_NAME=hotel_booking
JWT_SECRET=khóa_bí_mật_jwt
```

## 🧪 Chạy Kiểm Thử

```bash
# Kiểm thử Backend
cd hotel-booking-backend
npm test

# Kiểm thử Frontend
cd hotel-booking
npm test
```

## 🚢 Triển Khai

### Frontend

```bash
cd hotel-booking
npm run build
```

### Backend

```bash
cd hotel-booking-backend
npm start
```

## 📜 Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT - xem file LICENSE để biết chi tiết.

## 👥 Người Đóng Góp

- Tên của bạn - Công việc ban đầu

## 🙏 Lời Cảm Ơn

- Cảm ơn đến bất kỳ ai có mã nguồn được sử dụng
- Nguồn cảm hứng
- v.v.
