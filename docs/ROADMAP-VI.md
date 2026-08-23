# Roadmap hệ thống đặt phòng THG

## Hướng xây dựng

THG giữ LibreBooking làm backend quản lý tài nguyên và reservation, đồng thời
xây giao diện Next.js riêng theo nhận diện công ty.

UI hiện tại không bị bỏ đi khi sang POC. Nhóm sẽ giữ design system và luồng đã
hợp lý, sau đó hoàn thiện từng phần dựa trên dữ liệu và phản hồi thật từ API.

```text
Prototype tổng thể → POC tích hợp → MVP → Pilot → Production → Mở rộng
```

## Trạng thái hiện tại: Prototype tổng thể

Mục tiêu là giúp quản lý và dev hình dung sản phẩm trước khi đầu tư tích hợp.

Đã có:

- Giao diện đăng nhập, dashboard, lịch, danh mục phòng và đặt phòng.
- Giao diện thay đổi theo một số vai trò.
- Luồng chọn phòng, xem tiện nghi, kiểm tra trùng và đặt lịch bằng mock data.
- Màn báo cáo sử dụng và chi phí để thảo luận nghiệp vụ.

Chưa được xem là hoàn thành:

- Dữ liệu phòng, lịch, người dùng và chi phí phần lớn vẫn là dữ liệu mẫu.
- Kiểm tra phòng trống chưa lấy trực tiếp từ LibreBooking.
- Chưa chứng minh luồng booking chạy xuyên suốt với backend thật.

## Giai đoạn 1 — POC tích hợp LibreBooking

### Mục tiêu

Chứng minh Next.js có thể thay giao diện cũ và dùng LibreBooking làm backend cho
nghiệp vụ đặt phòng cốt lõi.

### Luồng cần chạy thật

```text
Đăng nhập
→ lấy danh sách phòng
→ chọn ngày và giờ
→ kiểm tra phòng trống
→ tạo reservation
→ LibreBooking kiểm tra xung đột lần cuối
→ hiển thị reservation trên lịch
```

### Công việc chính

| Nghiệp vụ | Phần Frontend | LibreBooking cần nối |
|---|---|---|
| Đăng nhập | Trang đăng nhập, session | Authentication API |
| Danh sách phòng | Danh mục phòng, dropdown đặt phòng | Resources API |
| Kiểm tra phòng trống | Ngày, giờ, thông báo availability | Resource Availability API |
| Đặt phòng | Form đặt phòng | Create Reservation API |
| Xem lịch | Trang Kiểm tra lịch | Reservations API |
| Chống trùng | Cảnh báo và trạng thái nút đặt | Validation của LibreBooking |
| Xử lý lỗi | Thông báo và debug log | HTTP error, validation response |

### Phạm vi UI

- Giữ màu sắc, font, sidebar và component hiện tại.
- Chỉ tinh chỉnh các màn thuộc luồng booking cốt lõi.
- Thay mock bằng API theo từng feature, không thiết kế lại toàn bộ ứng dụng.
- Các dashboard và báo cáo chưa nối thật phải ghi rõ “Dữ liệu minh họa”.

### POC hoàn thành khi

- Đăng nhập bằng tài khoản LibreBooking thành công.
- Phòng và reservation hiển thị từ dữ liệu thật.
- Availability trả đúng phòng trống theo thời gian.
- Đặt phòng trống thành công và xuất hiện lại trên lịch.
- Đặt trùng bị backend từ chối, kể cả khi hai người thao tác gần đồng thời.
- Lỗi API được hiển thị dễ hiểu và ghi vào debug log.

## Giai đoạn 2 — MVP cho người dùng thật

### Mục tiêu

Một nhóm nhân viên có thể dùng hệ thống cho công việc hằng ngày.

### Phạm vi

- Đăng nhập và phân quyền cơ bản.
- Kiểm tra lịch theo ngày, tuần và phòng.
- Tìm phòng theo thời gian, sức chứa và tiện nghi.
- Tạo, xem, sửa và hủy reservation.
- Xử lý trạng thái chờ duyệt nếu phòng yêu cầu phê duyệt.
- Thông báo kết quả đặt, sửa hoặc hủy.
- Loading, empty state, error state và responsive.
- Audit/debug log không lưu token hoặc dữ liệu nhạy cảm.

### MVP hoàn thành khi

- Luồng chính có test tự động và test nghiệm thu.
- Quyền được kiểm tra ở backend, không chỉ ẩn nút trên giao diện.
- Người dùng thử hoàn thành được tác vụ mà không cần hướng dẫn trực tiếp.
- Có tài liệu chạy hệ thống và xử lý sự cố cơ bản.

## Giai đoạn 3 — Pilot

### Mục tiêu

Thử nghiệm với một nhóm hoặc một văn phòng trước khi áp dụng toàn công ty.

### Công việc

- Import phòng và tài khoản trong phạm vi thử nghiệm.
- Hướng dẫn người dùng và thu thập phản hồi.
- Theo dõi lỗi, tỉ lệ đặt thành công và trường hợp trùng lịch.
- Kiểm tra quy trình duyệt, email thông báo và quyền theo scope.
- Điều chỉnh UX dựa trên hành vi sử dụng thật.

### Điều kiện chuyển tiếp

- Không còn lỗi nghiêm trọng trong luồng đặt phòng.
- Dữ liệu giữa Next.js và LibreBooking nhất quán.
- Người phụ trách nghiệp vụ chấp nhận quy trình.

## Giai đoạn 4 — Production

### Mục tiêu

Triển khai chính thức cho các đơn vị đã được phê duyệt.

### Công việc

- Hoàn thiện bảo mật, backup, giám sát và cảnh báo lỗi.
- Cấu hình môi trường, domain, HTTPS và quy trình triển khai.
- Xác định SLA, người vận hành và cách hỗ trợ người dùng.
- Đào tạo admin tài nguyên và bàn giao tài liệu.
- Theo dõi hiệu năng và tính ổn định sau phát hành.

## Giai đoạn 5 — Mở rộng

Chỉ thực hiện sau khi booking cốt lõi vận hành ổn định:

- Check-in/check-out và xử lý trường hợp không đến.
- Lịch cá nhân, lịch nhóm và lịch công ty từ provider thật.
- Dashboard sử dụng phòng và chi phí vận hành.
- Báo cáo phòng dùng nhiều, dùng ít và đề xuất cải tạo.
- MCP hoặc trợ lý đặt phòng.
- Quy trình mua sắm tài sản riêng nếu THG có nhu cầu.

## Ưu tiên gần nhất

1. Đóng băng phạm vi POC, không mở rộng thêm dashboard mock.
2. Chạy LibreBooking backend và tạo bộ dữ liệu thử.
3. Nối Authentication API.
4. Nối Resources và Availability API.
5. Nối Create/Get Reservations API.
6. Chạy các test case đặt thành công, đặt trùng và lỗi kết nối.
7. Demo một luồng thật cho quản lý trước khi chốt phạm vi MVP.

## Cách trình bày ngắn với quản lý

> Hiện tại em đã dựng prototype tổng thể để mọi người thống nhất hình dáng và
> luồng sản phẩm. Bước tiếp theo là POC, tập trung chứng minh UI Next.js có thể
> đăng nhập, lấy phòng trống và đặt phòng thật qua LibreBooking. UI hiện tại
> được giữ lại và chỉ tinh chỉnh theo API. Khi POC đạt tiêu chí, nhóm mới xây
> MVP để thử nghiệm với một đơn vị trước khi triển khai toàn công ty.

