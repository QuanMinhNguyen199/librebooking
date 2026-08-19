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

### Trợ lý ảo dạng bubble

Sau khi đăng nhập, **GEO Assistant** xuất hiện dưới dạng bubble nổi. Có thể kéo
bubble đến bất kỳ vị trí nào trong màn hình và bấm để mở hộp chat. Trợ lý có thể
mô phỏng tìm phòng, đọc chi phí Claude và mở trực tiếp form đăng ký phòng.

Nhãn **Chế độ mô phỏng** giúp phân biệt rõ với MCP/AI thật. Khi kết nối backend,
phần hội thoại sẽ gọi MCP qua BFF thay vì chứa credential trên trình duyệt.

### Luồng đặt lịch để demo

1. Đăng nhập bằng tài khoản demo.
2. Chọn **Đăng ký sử dụng** hoặc **Đăng ký thêm**.
3. Chọn phòng để xem tiện nghi cố định và thiết bị có thể đăng ký thêm.
4. Thử chuyển phòng: danh sách tiện nghi/thiết bị sẽ cập nhật ngay và thiết bị
   không còn phù hợp sẽ được bỏ chọn.
5. Nhập ngày, giờ, số người; chọn thiết bị kèm số lượng nếu cần.
6. Chọn **Xác nhận đăng ký**. Lịch mới xuất hiện trong **Lịch sử dụng của tôi**.

Sidebar dùng **Lịch sử dụng** để xem các lượt đăng ký hiện có. Nút
**Đăng ký sử dụng** nằm trong nội dung trang là hành động tạo reservation mới,
tránh lặp lại cùng một CTA ở hai vị trí.

“Đăng ký sử dụng” chỉ áp dụng cho phòng, xe và thiết bị công ty đã có. Nghiệp vụ
mua tài sản hoặc dụng cụ mới sẽ là một feature riêng tên **Yêu cầu mua sắm**,
không thuộc phạm vi booking của LibreBooking.

Trong phiên bản hoàn chỉnh, **Lịch sử dụng** sẽ có chế độ ngày/tuần/tháng và tải
dữ liệu từ Reservations API.

### Phòng, tiện nghi và thiết bị đi kèm

Demo bám theo mô hình nghiệp vụ của LibreBooking:

- **Resource** là phòng được đặt.
- **Tiện nghi cố định** như TV, bảng trắng và điều hòa được hiển thị theo phòng;
  khi kết nối thật sẽ ánh xạ từ thông tin/custom attributes của Resource.
- **Accessory** là thiết bị có số lượng và có thể đăng ký kèm booking, ví dụ
  micro, webcam hoặc máy chiếu. Mỗi thiết bị chỉ xuất hiện ở các phòng đã được
  liên kết với nó trong LibreBooking.
- Khi đổi phòng, frontend tải lại danh sách theo `resourceId`, xóa lựa chọn không
  còn hợp lệ và gửi `accessoryId` cùng `quantityRequested` khi tạo reservation.

Dữ liệu này đang được mô phỏng trong `features/resources/mock.ts`. Khi dùng
backend thật, UI giữ nguyên và thay nguồn dữ liệu bằng Resources/Accessories API.

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
| GEO Assistant | Bubble kéo thả và hội thoại mô phỏng tác vụ MCP/AI |
| ESLint | Kiểm tra chất lượng mã nguồn |

## Kiểm tra trước khi chạy demo

```bash
npm run lint
npm run build
```

## Trạng thái hiện tại

- Màn hình đăng nhập và dashboard: sẵn sàng demo.
- Form đặt phòng, tiện nghi theo phòng, accessory kèm số lượng và cập nhật lịch
  hôm nay: sẵn sàng demo bằng dữ liệu mẫu.
- Giao diện responsive và nhận diện THEHEGEO: sẵn sàng demo.
- Debug log real-time: sẵn sàng demo; thao tác thành công không được ghi log.
- GEO Assistant kéo thả và chat theo kịch bản: sẵn sàng demo.
- LibreBooking client: đã có khung Authentication, Resources và Reservations.
- Dữ liệu LibreBooking thật: chưa kết nối.
- MCP server: đang trong kế hoạch, chưa triển khai.

## Kết nối backend thật

Sao chép `.env.example` thành `.env.local`, sau đó cấu hình
`LIBREBOOKING_BASE_URL`. Session token phải được giữ ở server và không được đưa
vào mã chạy trên trình duyệt.

## Cấu trúc frontend — đọc nhanh

Frontend được chia theo **feature**, không chia theo loại file toàn dự án. Ví dụ,
toàn bộ code tạo reservation nằm trong `features/reservations`, giúp sửa một
nghiệp vụ mà ít ảnh hưởng đến phần còn lại.

```text
src/
├── app/
│   ├── page.tsx                # Ghép dashboard và quản lý trạng thái màn hình
│   └── api/librebooking/       # BFF, giữ session và gọi LibreBooking
├── components/
│   ├── assistant/              # GEO Assistant dạng bubble
│   ├── brand/                  # Logo và nhận diện THEHEGEO
│   └── debug/                  # Debug console dùng chung
├── features/
│   ├── authentication/         # Login: types, api, service, component
│   ├── resources/              # Resource, tiện nghi, accessory và dữ liệu mẫu
│   └── reservations/           # Reservation: types, api, mapper, mock
└── lib/librebooking/           # HTTP client, server proxy và error chung
```

Trong mỗi feature:

- `components/`: giao diện và thao tác của người dùng.
- `types.ts`: kiểu dữ liệu frontend.
- `service.ts`: kiểm tra và xử lý quy tắc nghiệp vụ.
- `api.ts`: endpoint mà frontend gọi.
- `mapper.ts`: đổi dữ liệu giữa frontend và LibreBooking.
- `mock.ts`: dữ liệu giả chỉ dùng cho demo.

Component không gọi `fetch()` trực tiếp. Luồng chuẩn là:

```text
Component → service → feature/api.ts → client → BFF → LibreBooking API
```

Gợi ý khi sửa lỗi: nút/hiển thị sai thì kiểm tra `components`, endpoint sai thì
kiểm tra `api.ts`, tên trường không khớp backend thì sửa `mapper.ts`, còn quy tắc
nghiệp vụ sai thì sửa `service.ts`. Không chỉnh `package-lock.json` thủ công.
