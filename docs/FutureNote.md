# Future notes

Các mục dưới đây là backlog của prototype. `[x]` chỉ có nghĩa là đã mô phỏng
được trên demo; chưa đồng nghĩa với việc đã nối API thật.

## Đã cập nhật trong demo

- [x] Admin tài nguyên có thể lọc lịch theo phòng và mở form đặt hộ với phòng
  đã chọn.
- [x] Bấm thành viên sẽ mở màn chi tiết.
- [x] System Admin có thể đổi role và bật/tắt quyền theo feature bằng checkbox.
- [x] System Admin được truy cập toàn bộ feature quản trị trong demo.
- [x] CEO không được sửa role. Quản lý tài khoản là trách nhiệm của System Admin.
- [x] Bấm reservation trên lịch sẽ thấy thời gian, phòng, trạng thái, người tham
  gia và mã đặt chỗ.
- [x] Reservation của phòng cần duyệt hiển thị trạng thái `Chờ duyệt`.
- [x] Điều hướng từ nhắc nhở hoặc sau khi đặt sẽ tự cuộn đến reservation được
  highlight.
- [x] Form đặt phòng cho nhập email người tham gia, nhưng chưa gửi email thật.
- [x] Chi tiết phòng được chuyển sang page riêng, không còn nằm dưới danh sách.

## Còn phải làm khi sang POC/MVP

- [ ] Lấy role và permission thật từ backend; thay đổi quyền phải có audit log.
- [ ] Xác nhận API LibreBooking hỗ trợ participant/guest như thế nào trước khi
  chốt mapper.
- [ ] Nối dịch vụ email và gửi thư mời sau khi reservation được xác nhận.
- [ ] Lấy trạng thái approval thật và cho người có quyền duyệt/từ chối.
- [ ] Filter phòng và luồng đặt hộ phải kiểm tra scope ở backend.
- [ ] Test auto-scroll trên mobile, chế độ tháng và reservation ngoài tuần đang
  xem.
- [ ] Thực hiện usability test trước khi chốt UX cho MVP.

