# THEHEGEO Resource Frontend

Giao diện Next.js mới dành cho hệ thống quản lý tài nguyên của công ty. Phần
nghiệp vụ booking được kế thừa từ LibreBooking và kết nối thông qua REST API.

## Chạy demo

```bash
npm install
npm run dev
```

Mở <http://localhost:3000>. Các tài khoản demo dùng chung mật khẩu `demo123`:

| Username | Role | Nội dung được xem |
|---|---|---|
| `employee` | Nhân viên | Announcement, nhắc nhở, Calendar và Resource |
| `manager` | Manager | Báo cáo sử dụng, chi phí và phê duyệt trong Marketing |
| `resourceadmin` | Admin tài nguyên | Tình trạng phòng, chi phí vận hành và phê duyệt tại Văn phòng HCM |
| `sysadmin` | Admin hệ thống | Kiểm tra toàn bộ feature và quản lý tài khoản, nhóm, quyền |
| `ceo` | CEO | Tình trạng phòng, mức sử dụng và chi phí vận hành toàn công ty |

Mật khẩu `demoadmin` cũng được chấp nhận để tương thích demo cũ.

### Xem prototype trên GitHub Pages

Sau khi workflow deploy được push lên nhánh `develop`, prototype sẽ có tại:

<https://quanminhnguyen199.github.io/librebooking/>

Đây là bản static chỉ dùng mock data để mọi người xem và góp ý. Các route BFF và
LibreBooking API không được đưa lên GitHub Pages. Không nhập dữ liệu thật hoặc
thông tin nhạy cảm vào bản public này.

Để kích hoạt lần đầu, vào repository **Settings → Pages → Build and deployment**
và chọn nguồn **GitHub Actions**. Các lần push tiếp theo có thay đổi trong
`frontend/` sẽ tự động cập nhật trang.

### Cấu trúc page theo feature

Mỗi feature có page riêng trong sidebar. `Kiểm tra lịch` dùng để xem thời gian,
`Danh mục phòng` dùng để xem phòng và thiết bị bên trong, còn `Đặt tài nguyên`
dùng để tạo Reservation. Kết quả được đưa về Calendar và highlight ngắn để
người dùng nhận ra vị trí. Các điểm bắt đầu đều dùng chung một booking form và
service gọi API.

Demo hiện dùng dữ liệu mẫu nên có thể chạy mà không cần PHP hoặc MySQL.

### Luồng đặt lịch để demo

1. Đăng nhập bằng tài khoản demo.
2. Chọn **Đăng ký sử dụng** hoặc **Đăng ký thêm**.
3. Chọn phòng để xem tiện nghi cố định và thiết bị có thể đăng ký thêm.
4. Thử chuyển phòng: danh sách tiện nghi/thiết bị sẽ cập nhật ngay và thiết bị
   không còn phù hợp sẽ được bỏ chọn.
5. Nhập ngày, giờ, số người; chọn thiết bị kèm số lượng nếu cần.
6. Kiểm tra lịch cá nhân, phòng, công ty, nhóm và ngày lễ trước khi đặt.
7. Nếu phòng bị trùng, đổi giờ; lịch cá nhân/công ty/nhóm chỉ tạo cảnh báo.
8. Xác nhận hoặc gửi yêu cầu duyệt. Reservation xuất hiện trong Calendar.

### Các lớp lịch khi kiểm tra booking

- **Lịch của tôi:** sự kiện cá nhân và reservation user tạo/tham gia.
- **Phòng & thiết bị:** reservation, blackout và bảo trì theo resource.
- **Lịch công ty:** town hall, đào tạo và sự kiện chung.
- **Nhóm của tôi:** chỉ hiện theo role/scope của Lead hoặc Manager.
- **Ngày lễ Việt Nam:** luôn bật và không thể ẩn.

Một reservation có thể thuộc nhiều nguồn nhưng chỉ hiển thị một lần theo
`reservationId`. Private event chỉ hiện “Bận” với người không có quyền xem.
Xung đột resource/blackout chặn đăng ký; xung đột lịch cá nhân, công ty hoặc nhóm
chỉ cảnh báo. Phê duyệt dựa trên chính sách của resource, không dựa trên nguồn lịch.

Các lịch đang dùng dữ liệu demo. Khi kết nối thật, reservation của tổ chức lấy
từ LibreBooking; lịch cá nhân và ngày lễ cần adapter từ calendar provider. Quyền
riêng tư phải được xử lý ở server/BFF trước khi trả dữ liệu xuống trình duyệt.

Sidebar dùng **Kiểm tra lịch** để mở lịch hợp nhất theo cách quen thuộc của
Google Calendar/Apple Calendar. Người dùng có thể chuyển ngày, xem theo
ngày/tuần/tháng và bật hoặc tắt từng nguồn lịch. Nút **Đăng ký sử dụng** là hành
động tạo reservation mới.

“Đăng ký sử dụng” chỉ áp dụng cho phòng, xe và thiết bị công ty đã có. Nghiệp vụ
mua tài sản hoặc dụng cụ mới sẽ là một feature riêng tên **Yêu cầu mua sắm**,
không thuộc phạm vi booking của LibreBooking.

Trong phiên bản hoàn chỉnh, lịch tài nguyên sẽ tải từ Reservations API; lịch
công ty, lịch cá nhân và ngày lễ sẽ đi qua calendar adapter tại BFF.

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
- AI Agent và MCP: tạm ẩn để demo tập trung vào đặt lịch và quản lý tài nguyên.
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
│   ├── assistant/              # Mã thử nghiệm, chưa hiển thị trong demo
│   ├── brand/                  # Logo và nhận diện THEHEGEO
│   └── debug/                  # Debug console dùng chung
├── features/
│   ├── dashboard/              # Dashboard thay đổi theo Role + Scope
│   ├── authentication/         # Login: types, api, service, component
│   ├── calendar/               # Nguồn lịch, loại sự kiện và kiểm tra xung đột
│   ├── resources/              # Resource, tiện nghi, accessory và dữ liệu mẫu
│   ├── reservations/           # Reservation: types, api, mapper, mock
│   ├── usage/                  # Resource Usage theo scope
│   ├── ai-usage/               # Mã thử nghiệm, ngoài phạm vi demo hiện tại
│   ├── costs/                  # Chi phí vận hành phòng và thiết bị
│   ├── people/                 # Nhân sự, Role và Scope
│   └── approvals/              # Danh sách Reservation chờ duyệt
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
