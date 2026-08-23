# Implementation plan — THEHEGEO Resource

File này dùng để theo dõi những gì đã làm, còn thiếu và điều kiện cần đạt trước
khi commit. Không tick một mục chỉ vì giao diện đã xuất hiện; chỉ tick khi đáp
ứng đầy đủ tiêu chí kiểm tra ghi bên dưới.

Implementation chỉ bắt đầu sau khi yêu cầu tương ứng trong
[`BUSINESS-ANALYSIS-VI.md`](./BUSINESS-ANALYSIS-VI.md) đạt Definition of Ready.
Code lịch hợp nhất hiện tại là prototype để thảo luận, chưa phải nghiệp vụ đã duyệt.

## Ký hiệu

- `[x]`: đã triển khai và đã kiểm tra.
- `[ ]`: chưa làm hoặc chưa kiểm tra đủ.
- `Demo`: đang dùng dữ liệu giả.
- `Thật`: đã nối backend/API và áp dụng quyền thực tế.

## 1. Mục tiêu phiên bản demo

Người xem có thể đăng nhập, hiểu tình trạng tài nguyên, kiểm tra lịch, đặt phòng
kèm thiết bị và thấy kết quả ngay. Các tính năng giả lập phải được ghi rõ, không
được khiến người xem hiểu rằng LibreBooking, MCP hoặc AI thật đã kết nối.

## 2. Checklist chức năng

### Đăng nhập

- [x] Có màn hình đăng nhập trước dashboard.
- [x] Tài khoản demo đăng nhập được.
- [x] Sai thông tin đăng nhập được đưa vào debug log.
- [ ] Kết nối Authentication API của LibreBooking.
- [ ] Giữ session/token tại server, không đưa credential xuống trình duyệt.
- [ ] Kiểm tra logout và session hết hạn với backend thật.

### Dashboard

- [x] Dashboard thay đổi theo Role + Scope.
- [x] Nhân viên chỉ thấy announcement, nhắc nhở và lịch sắp tới.
- [x] Manager/CEO thấy summary Usage, AI Usage và Chi phí theo permission.
- [x] Resource Admin xem Resource Usage trong scope; AI/Chi phí cần quyền riêng.
- [x] Mỗi feature chi tiết có page riêng, không nhúng toàn bộ vào Dashboard.
- [x] Responsive ở desktop và màn hình nhỏ.
- [x] Màu sắc/font theo nhận diện THEHEGEO.
- [ ] Các card lấy dữ liệu thật và có trạng thái loading/empty/error.
- [ ] Thống nhất cách tính từng KPI với quản lý.

### Tài nguyên và phòng

- [x] Có dữ liệu mẫu cho nhiều phòng.
- [x] Đổi phòng cập nhật tiện nghi cố định.
- [x] Đổi phòng cập nhật accessory có thể đăng ký.
- [x] Accessory cũ không phù hợp được tự bỏ chọn.
- [x] Người dùng chọn được số lượng trong giới hạn min/max.
- [ ] Lấy Resource và custom attributes từ LibreBooking.
- [ ] Lấy Accessory và quan hệ `associatedResources` từ LibreBooking.
- [ ] Kiểm tra sức chứa, trạng thái và quyền truy cập phòng thật.

### Kiểm tra lịch trước khi booking

- [x] Có 5 nguồn: cá nhân, resource, công ty, nhóm và ngày lễ.
- [x] Lịch private chỉ hiện trạng thái bận với người không có quyền.
- [x] Reservation thuộc nhiều nguồn chỉ hiển thị một lần theo `reservationId`.
- [x] Có lịch cộng đồng/ngày lễ Việt Nam luôn bật.
- [x] Đổi phòng, ngày hoặc giờ sẽ tính lại xung đột trong demo.
- [x] UI cảnh báo khi khung giờ đã chọn trùng lịch.
- [x] Xung đột resource/blackout chặn submit; lịch khác chỉ cảnh báo.
- [x] Demo phân biệt Resource cần duyệt và xác nhận ngay.
- [ ] Không cho submit khi LibreBooking xác nhận phòng không khả dụng.
- [ ] Đồng bộ reservation tổ chức từ LibreBooking.
- [ ] Chọn calendar provider cho lịch cá nhân.
- [ ] Chọn nguồn ngày lễ Việt Nam và quy tắc cập nhật hằng năm.
- [ ] Áp dụng privacy tại BFF/server trước khi trả sự kiện xuống frontend.
- [ ] Xác định múi giờ chuẩn và kiểm tra sự kiện cả ngày/lịch lặp.

### Tạo reservation

- [x] Nhập mục đích, phòng, ngày, giờ và số người.
- [x] Gửi được cấu trúc `accessoryId` và `quantityRequested` ở mapper.
- [x] Demo thêm reservation mới vào lịch cá nhân ngay sau khi xác nhận.
- [x] Chặn giờ kết thúc không sau giờ bắt đầu.
- [ ] Kiểm tra availability ngay trước khi submit để tránh race condition.
- [ ] Tạo reservation thật bằng Reservations API.
- [ ] Hiển thị lỗi validation/conflict từ LibreBooking bằng tiếng Việt.
- [ ] Hỗ trợ sửa/hủy reservation.
- [ ] Hỗ trợ recurrence, participant, guest, approval và check-in/out.

### Kiểm tra lịch hợp nhất

- [x] Hiển thị các reservation mẫu sắp tới.
- [x] Reservation vừa tạo được thêm ngay trong demo.
- [x] Sidebar dùng tên “Kiểm tra lịch” và mở đúng khu vực lịch hợp nhất.
- [x] Có chuyển ngày và chế độ xem Ngày/Tuần/Tháng.
- [x] Có thể bật/tắt lịch cá nhân/resource/công ty/nhóm; ngày lễ luôn bật.
- [ ] Lấy lịch của người dùng từ LibreBooking.
- [ ] Có bộ lọc theo resource, trạng thái và thời gian.
- [ ] Phân biệt pending, approved, checked-in, cancelled.

### GEO Assistant và MCP

- [x] Bubble có thể kéo trong phạm vi màn hình.
- [x] Bấm để mở/đóng hội thoại.
- [x] Có nhãn “Chế độ mô phỏng”.
- [x] Có thể mở form đăng ký phòng từ bubble.
- [ ] Xây MCP server thật.
- [ ] Agent gọi tool bằng quyền của người dùng hiện tại.
- [ ] Có bước xác nhận trước khi agent tạo/sửa/hủy reservation.
- [ ] Ghi audit log cho tool call nhưng không lộ token hoặc dữ liệu nhạy cảm.
- [ ] Có fallback khi MCP/AI không khả dụng.

### Debug và quan sát lỗi

- [x] Debug log cập nhật real-time.
- [x] Chỉ ghi lỗi, không ghi action thành công.
- [x] Bắt lỗi UI, promise, HTTP và network.
- [ ] Gắn request/correlation ID giữa frontend, BFF và LibreBooking.
- [ ] Chọn nơi lưu log server và chính sách thời gian lưu.
- [ ] Ẩn password, token, cookie và dữ liệu cá nhân khỏi log.

### AI Usage và chi phí

- [x] Có dashboard demo về Claude usage.
- [x] Có ghi rõ số liệu demo, chưa phải dữ liệu thật.
- [ ] Chọn nguồn dữ liệu usage chính thức của nhà cung cấp AI.
- [ ] Ánh xạ API key/project với nhân viên hoặc phòng ban.
- [ ] Tính token, tiền, ngân sách và cảnh báo theo kỳ.
- [ ] Xác định quyền xem chi phí cá nhân, nhóm và toàn công ty.

### Yêu cầu mua sắm

- [x] Đã tách khái niệm mua sắm khỏi booking.
- [ ] Viết PRD riêng cho yêu cầu mua, duyệt, báo giá và nhận tài sản.
- [ ] Chọn backend/tool quản lý procurement hoặc tự xây module.
- [ ] Xác định điểm liên kết tài sản mới với Resource của LibreBooking.

## 3. Checklist chất lượng UI

- [x] `npm run lint` thành công sau thay đổi gần nhất.
- [x] `npm run build` thành công sau thay đổi gần nhất.
- [ ] Kiểm tra thủ công luồng login → chọn phòng → kiểm tra lịch → submit.
- [ ] Kiểm tra kéo bubble và mở modal trên mobile.
- [ ] Kiểm tra keyboard navigation, focus và screen reader label.
- [ ] Kiểm tra empty state, loading state và error state.
- [ ] Không có nội dung demo bị trình bày như dữ liệu thật.

## 4. Những quyết định còn cần chốt

- Calendar cá nhân dùng Google Calendar, Microsoft 365 hay nguồn khác?
- Sự kiện private được hiển thị thời gian bận hay chỉ một khối “Không khả dụng”?
- Ngày lễ Việt Nam lấy từ provider nào và ai chịu trách nhiệm cập nhật?
- Lịch cá nhân có chặn đặt phòng hay chỉ cảnh báo?
- Khi có conflict, ai được quyền override?
- Demo chỉ đặt phòng hay cho phép đặt xe/thiết bị như Resource độc lập?
- Dữ liệu AI usage được ghi nhận theo user, API key, project hay cost center?

## 5. Điều kiện được commit

Một thay đổi chỉ nên commit khi:

- [ ] Business Analysis và acceptance criteria liên quan đã được duyệt.
- [x] Phạm vi thay đổi đã được ghi trong checklist này.
- [ ] Các mục bắt buộc của thay đổi đã được tick.
- [x] Không có file ngoài phạm vi trong `git status`.
- [x] `git diff --check` không có lỗi.
- [x] Lint và build đều thành công nếu có thay đổi code.
- [ ] Luồng chính đã được kiểm tra thủ công nếu thay đổi hành vi UI.
- [x] README/doc liên quan đã được cập nhật.
- [ ] Người phụ trách xác nhận có thể commit/push.

## 6. Trạng thái working tree hiện tại

Chưa commit các thay đổi sau:

- Tài liệu tổng quan chức năng LibreBooking.
- Bảng kiểm tra lịch tổ chức, cá nhân và ngày lễ Việt Nam.
- Tài liệu implementation/checklist này.

Các thay đổi code đã qua lint và production build, nhưng vẫn cần kiểm tra thủ
công trên trình duyệt trước khi tick cổng commit.
