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

## Công cụ chính

| Công cụ | Mục đích |
|---|---|
| Next.js + React | Xây dựng giao diện và các luồng tương tác |
| TypeScript | Kiểm soát dữ liệu và giảm lỗi khi kết nối API |
| Tailwind CSS | Styling responsive theo màu sắc THEHEGEO |
| Lucide React | Cung cấp icon cho giao diện |
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
- Giao diện responsive và nhận diện THEHEGEO: sẵn sàng demo.
- Debug log real-time: sẵn sàng demo; thao tác thành công không được ghi log.
- LibreBooking client: đã có khung Authentication, Resources và Reservations.
- Dữ liệu LibreBooking thật: chưa kết nối.
- MCP server: đang trong kế hoạch, chưa triển khai.

## Kết nối backend thật

Sao chép `.env.example` thành `.env.local`, sau đó cấu hình
`LIBREBOOKING_BASE_URL`. Session token phải được giữ ở server và không được đưa
vào mã chạy trên trình duyệt.
