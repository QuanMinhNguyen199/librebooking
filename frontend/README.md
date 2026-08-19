# THEHEGEO Resource Frontend

Giao diện Next.js mới dành cho hệ thống quản lý tài nguyên của công ty. Phần
nghiệp vụ booking được kế thừa từ LibreBooking và kết nối thông qua REST API.

## Chạy demo

```bash
npm install
npm run dev
```

Mở <http://localhost:3000> và đăng nhập bằng:

```text
admin / demo123
```

Mật khẩu `demoadmin` của demo LibreBooking gốc cũng được chấp nhận.

Demo hiện dùng dữ liệu mẫu nên có thể chạy mà không cần PHP hoặc MySQL.

### Luồng đặt lịch để demo

1. Đăng nhập bằng tài khoản demo.
2. Chọn **Đặt tài nguyên** hoặc **Thêm booking**.
3. Nhập mục đích, tài nguyên, ngày, giờ và số người.
4. Chọn **Xác nhận đặt lịch**.
5. Booking mới xuất hiện ngay trong mục **Lịch hôm nay**.

Sidebar tách rõ hai tác vụ giống mô hình của LibreBooking:

- **Đặt tài nguyên**: mở ngay form tìm và tạo reservation.
- **Lịch của tôi**: đi tới danh sách các booking sắp tới của người dùng.

Trong phiên bản hoàn chỉnh, **Lịch của tôi** sẽ có chế độ ngày/tuần/tháng và tải
dữ liệu từ Reservations API.

Nếu giờ kết thúc không hợp lệ, lỗi sẽ xuất hiện ngay trong debug console.

## Công cụ chính

| Công cụ | Mục đích |
|---|---|
| Next.js + React | Xây dựng giao diện và các luồng tương tác |
| TypeScript | Kiểm soát dữ liệu và giảm lỗi khi kết nối API |
| Tailwind CSS | Styling responsive theo màu sắc THEHEGEO |
| Lucide React | Cung cấp icon cho giao diện |
| Feature service | Kiểm tra dữ liệu và điều phối việc tạo booking |
| LibreBooking client | Chuẩn hóa việc gọi Authentication, Resources và Reservations API |
| Debug console | Ghi lỗi action, HTTP, network và JavaScript theo thời gian thực |
| ESLint | Kiểm tra chất lượng mã nguồn |

## Kiểm tra trước khi chạy demo

```bash
npm run lint
npm run build
```

## Trạng thái hiện tại

- Màn hình đăng nhập và dashboard: sẵn sàng demo.
- Form đặt lịch và cập nhật lịch hôm nay: sẵn sàng demo bằng dữ liệu mẫu.
- Giao diện responsive và nhận diện THEHEGEO: sẵn sàng demo.
- Debug log real-time: sẵn sàng demo; thao tác thành công không được ghi log.
- LibreBooking client: đã có khung Authentication, Resources và Reservations.
- Dữ liệu LibreBooking thật: chưa kết nối.
- MCP server: đang trong kế hoạch, chưa triển khai.

## Kết nối backend thật

Sao chép `.env.example` thành `.env.local`, sau đó cấu hình
`LIBREBOOKING_BASE_URL`. Session token phải được giữ ở server và không được đưa
vào mã chạy trên trình duyệt.

## Cấu trúc feature

```text
src/
├── app/api/librebooking/       # BFF, giữ session và gọi LibreBooking
├── components/debug/           # Debug console dùng chung
├── features/
│   ├── authentication/         # Login: types, api, service, component
│   ├── resources/              # Resource: types, api, mapper, mock
│   └── reservations/           # Reservation: types, api, mapper, mock
└── lib/librebooking/           # HTTP client, server proxy và error chung
```

Component không gọi `fetch()` trực tiếp. Luồng chuẩn là:

```text
Component → service → feature/api.ts → client → BFF → LibreBooking API
```

Nếu một nút không khớp backend, kiểm tra `api.ts` khi sai endpoint,
`mapper.ts` khi sai tên trường, và `service.ts` khi sai quy tắc nghiệp vụ.
