# Calendar UX Specification

## Mục tiêu

Calendar cần cho người dùng nhìn được tổng quan thời gian giống cách làm quen
thuộc của Google Calendar, thay vì chỉ hiển thị danh sách sự kiện.

## Bố cục

- Thanh điều hướng ngày và nút quay về ngày demo/hôm nay.
- Chuyển chế độ **Ngày / Tuần / Tháng**.
- Thanh chip bật/tắt nguồn lịch.
- Khu vực chính là lưới thời gian hoặc lưới tháng.
- Nút **Đặt tài nguyên** luôn mở form Reservation.

## Nguồn lịch

- Lịch của tôi.
- Phòng & thiết bị.
- Lịch công ty.
- Nhóm của tôi theo Role + Scope.
- Ngày lễ Việt Nam luôn bật.

## Cách hiển thị

- Ngày: một cột thời gian từ 08:00 đến 18:00.
- Tuần làm việc: năm cột từ thứ Hai đến thứ Sáu, có trục giờ. Thứ Bảy và Chủ
  nhật là ngày linh hoạt nên không xuất hiện trong tổng quan mặc định.
- Tháng: lưới năm ngày làm việc, mỗi ô hiển thị các sự kiện của ngày đó.
- Reservation có trạng thái Chờ duyệt hoặc Đã xác nhận.
- Reservation chờ duyệt dùng màu vàng/cam; reservation đã xác nhận dùng màu
  theo nguồn lịch để người dùng nhận biết nhanh trạng thái.
- Một Reservation thuộc nhiều nguồn chỉ render một lần theo `reservationId`.
- Event private chỉ hiện **Bận** nếu người xem không có quyền.

## Quyền và phạm vi

- Employee chỉ xem dữ liệu mình được tham gia hoặc được chia sẻ.
- Lead/Manager chỉ xem thành viên và sự kiện trong Scope của họ.
- Resource Admin xem Reservation của Resource được giao.
- CEO chỉ xem dữ liệu toàn công ty khi có permission tương ứng.
- Việc lọc phải thực hiện tại API/BFF; ẩn trên giao diện không phải bảo mật.

## Vị trí của chức năng đặt tài nguyên

**Đặt tài nguyên** là một feature riêng trong sidebar vì đây là nghiệp vụ cốt
lõi. Calendar và Danh mục tài nguyên chỉ là hai điểm bắt đầu khác nhau, cùng
điều hướng về một booking form và dùng chung service tạo Reservation.

## Acceptance criteria cho demo

- [x] Chuyển được Ngày/Tuần/Tháng.
- [x] Ngày và Tuần hiển thị event theo vị trí thời gian.
- [x] Tháng hiển thị event trong đúng ô ngày.
- [x] Bật/tắt nguồn lịch cập nhật lưới ngay.
- [x] Ngày lễ Việt Nam không thể tắt.
- [x] Reservation không bị hiển thị trùng.
- [x] Private event được che nội dung theo quyền.
